-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    total DECIMAL(10,2) NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    name TEXT NOT NULL,
    image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create RLS policies for orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own orders"
    ON orders FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders"
    ON orders FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for order_items
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own order items"
    ON order_items FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM orders
        WHERE orders.id = order_items.order_id
        AND orders.user_id = auth.uid()
    ));

CREATE POLICY "Users can create their own order items"
    ON order_items FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM orders
        WHERE orders.id = order_items.order_id
        AND orders.user_id = auth.uid()
    ));

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for orders table
CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create function to get user's order history with items
CREATE OR REPLACE FUNCTION get_user_orders(user_id UUID)
RETURNS TABLE (
    order_id UUID,
    total DECIMAL(10,2),
    status TEXT,
    created_at TIMESTAMP WITH TIME ZONE,
    items JSONB
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        o.id as order_id,
        o.total,
        o.status,
        o.created_at,
        COALESCE(
            (
                SELECT jsonb_agg(
                    jsonb_build_object(
                        'id', oi.id,
                        'product_id', oi.product_id,
                        'name', oi.name,
                        'quantity', oi.quantity,
                        'price', oi.price,
                        'image', oi.image
                    )
                )
                FROM order_items oi
                WHERE oi.order_id = o.id
            ),
            '[]'::jsonb
        ) as items
    FROM orders o
    WHERE o.user_id = get_user_orders.user_id
    ORDER BY o.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 
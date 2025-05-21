export interface Profile {
  id: string;
  email: string;
  name?: string;
  role?: string;
  full_name?: string;
  phone?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  image?: string;
  category: string;
  tags: string[];
  featured?: boolean;
  rating?: number;
}

export interface Order {
  id: string;
  user_id: string;
  created_at: string;
  status: string;
  total: number;
  items: OrderItem[];
}

export interface OrderItem {
  id: string;
  product_id: string;
  quantity: number;
  price: number;
  name: string;
}

export interface Donation {
  id: string;
  user_id: string;
  amount: number;
  created_at: string;
  message?: string;
}

export interface CartItem extends Product {
  qty: number;
}

export interface Toast {
  type: 'cart' | 'wishlist' | 'error' | 'success';
  message: string;
}

export interface BrandModalStyles {
  [key: string]: {
    bg: string;
    accent: string;
    border: string;
  };
}

export interface CategoryModalStyles {
  [key: string]: {
    bg: string;
    accent: string;
    border: string;
  };
} 
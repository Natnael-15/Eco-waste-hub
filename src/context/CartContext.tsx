import React, { createContext, useContext, useState, useEffect } from 'react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  qty?: number;
  originalPrice?: number;
  discountPercent?: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, delta: number) => void;
  clearCart: () => void;
  clearCartAfterCheckout: () => void;
  cartTotal: number;
  cartSummary: CartItem[];
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item: CartItem) => {
    setCart(prev => [...prev, item]);
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setCart(prev => {
      const idx = prev.findIndex(item => item.id === itemId);
      if (idx === -1) return prev;

      const copy = [...prev];
      if (delta > 0) {
        copy.push(copy[idx]);
      } else {
        copy.splice(idx, 1);
      }
      return copy;
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  // New function to clear cart after checkout
  const clearCartAfterCheckout = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  // Calculate cart summary
  const cartSummary = cart.reduce((acc: CartItem[], item) => {
    const found = acc.find(i => i.id === item.id);
    if (found) {
      found.qty = (found.qty || 0) + 1;
    } else {
      acc.push({ ...item, qty: 1 });
    }
    return acc;
  }, []);

  const cartTotal = cartSummary.reduce((sum, item) => sum + item.price * (item.qty || 1), 0);

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      clearCartAfterCheckout,
      cartTotal,
      cartSummary
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 
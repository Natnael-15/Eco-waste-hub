import React from 'react';
import { FaShoppingCart, FaMinus, FaPlus, FaTrash } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose }) => {
  const { cartSummary, cartTotal, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleProceedToCheckout = () => {
    // Store the cart items in localStorage for the checkout page
    const checkoutData = {
      items: cartSummary,
      total: cartTotal,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('checkoutCart', JSON.stringify(checkoutData));
    onClose();
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 bg-black/40 dark:bg-black/80 z-50 flex items-center justify-center" onClick={onClose}>
      <div
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl max-w-md w-full p-8 relative animate-fade-in border-4 border-eco-yellow dark:border-eco-green"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-eco-green dark:text-eco-yellow dark:hover:text-eco-green text-2xl">×</button>
        <h2 className="text-2xl font-bold font-playfair text-eco-green dark:text-eco-yellow mb-4 flex items-center gap-2"><FaShoppingCart /> Cart</h2>
        {cartSummary.length === 0 ? (
          <div className="text-center text-gray-400 dark:text-eco-yellow/60 py-8">Your cart is empty.</div>
        ) : (
          <>
            <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
              {cartSummary.map(item => (
                <div key={item.id} className="flex items-center gap-4 border-b border-gray-200 dark:border-gray-800 pb-3">
                  <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded-lg" />
                  <div className="flex-1">
                    <div className="font-bold text-eco-green dark:text-eco-yellow">{item.name}</div>
                    <div className="text-xs text-gray-500 dark:text-eco-yellow/70">£{item.price.toFixed(2)}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <button
                        className="p-1 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-eco-yellow hover:text-eco-green dark:hover:bg-eco-green dark:hover:text-white"
                        onClick={() => updateQuantity(item.id, -1)}
                        aria-label="Remove one"
                      >
                        <FaMinus className="w-3 h-3" />
                      </button>
                      <span className="text-sm">{item.qty}</span>
                      <button
                        className="p-1 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-eco-yellow hover:text-eco-green dark:hover:bg-eco-green dark:hover:text-white"
                        onClick={() => updateQuantity(item.id, 1)}
                        aria-label="Add one"
                      >
                        <FaPlus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <button
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full"
                    onClick={() => removeFromCart(item.id)}
                    aria-label="Remove all"
                  >
                    <FaTrash className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-800">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600 dark:text-eco-yellow/80">Total:</span>
                <span className="text-xl font-bold text-eco-green dark:text-eco-yellow">£{cartTotal.toFixed(2)}</span>
              </div>
              <button
                onClick={handleProceedToCheckout}
                className="w-full bg-eco-green text-white py-3 rounded-xl font-bold hover:bg-eco-yellow hover:text-eco-green dark:bg-eco-yellow dark:text-gray-900 dark:hover:bg-eco-green dark:hover:text-white transition"
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartModal; 
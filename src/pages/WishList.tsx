import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { FaHeart, FaTrash, FaShoppingCart, FaBoxOpen, FaStar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

interface WishItem {
  id: string;
  name: string;
  image: string;
  price: number;
  description?: string;
  rating?: number;
  tags?: string[];
  type?: string;
}

const WishList: React.FC = () => {
  const [items, setItems] = useState<WishItem[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<WishItem | null>(null);
  const [toast, setToast] = useState<{ type: string; message: string } | null>(null);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('wishlist') || '[]');
    setItems(saved);
  }, []);

  const removeItem = (id: string) => {
    const updated = items.filter(item => item.id !== id);
    setItems(updated);
    localStorage.setItem('wishlist', JSON.stringify(updated));
  };

  const handleAddToCart = (item: WishItem) => {
    addToCart(item);
    setToast({ type: 'cart', message: `${item.name} added to cart!` });
    setTimeout(() => setToast(null), 2000);
  };

  const getStars = (rating: number = 0) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar key={i} className={
          i <= Math.floor(rating)
            ? 'text-yellow-400'
            : i - rating < 1
            ? 'text-yellow-300'
            : 'text-gray-300'
        } />
      );
    }
    return stars;
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-eco-green/10 via-eco-yellow/10 to-eco-green/5 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-300 pt-24 px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold font-playfair text-eco-green dark:text-eco-yellow mb-8 text-center flex items-center justify-center gap-3">
            <FaHeart className="text-eco-yellow animate-pulse" /> My Wish List
          </h1>
          
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24">
              <FaBoxOpen className="text-7xl text-gray-300 dark:text-gray-700 mb-4" />
              <p className="text-lg text-gray-500 dark:text-gray-400 mb-2">Your wish list is empty.</p>
              <button
                onClick={() => navigate('/shop')}
                className="mt-4 px-6 py-3 bg-eco-green dark:bg-eco-yellow text-white dark:text-eco-green font-bold rounded-full shadow hover:bg-eco-yellow hover:text-eco-green dark:hover:bg-eco-green dark:hover:text-white transition text-lg"
              >
                Browse Shop
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {items.map(item => (
                <div key={item.id} className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-eco-green/10 dark:border-eco-yellow/10 p-6 flex flex-col items-center group hover:shadow-eco-yellow/20 dark:hover:shadow-eco-green/20 transition-all">
                  <img src={item.image} alt={item.name} className="w-32 h-32 object-cover rounded-xl mb-4 shadow-lg group-hover:scale-105 transition-transform" />
                  <h2 className="text-xl font-bold text-eco-green dark:text-eco-yellow mb-2 text-center">{item.name}</h2>
                  <p className="text-lg font-semibold text-eco-yellow dark:text-eco-green mb-4">£{item.price.toFixed(2)}</p>
                  <div className="flex gap-3 w-full justify-center">
                    <button
                      onClick={() => { setShowModal(true); setSelectedItem(item); }}
                      className="flex-1 px-4 py-2 bg-eco-green dark:bg-eco-yellow text-white dark:text-eco-green rounded-full font-semibold hover:bg-eco-yellow hover:text-eco-green dark:hover:bg-eco-green dark:hover:text-white transition flex items-center gap-2 justify-center"
                    >
                      <FaShoppingCart /> View Details
                    </button>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="flex-1 px-4 py-2 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 rounded-full font-semibold hover:bg-red-200 dark:hover:bg-red-700 transition flex items-center gap-2 justify-center"
                    >
                      <FaTrash /> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Product Details Modal */}
      {showModal && selectedItem && (
        <div
          className="fixed inset-0 bg-black/40 dark:bg-black/80 z-50 flex items-center justify-center"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl max-w-md w-full p-6 relative animate-fade-in border-4 border-eco-yellow dark:border-eco-green"
            onClick={e => e.stopPropagation()}
          >
            <button onClick={() => setShowModal(false)} className="absolute top-3 right-3 text-gray-400 hover:text-eco-green dark:text-eco-yellow dark:hover:text-eco-green text-xl">×</button>
            <img src={selectedItem.image} alt={selectedItem.name} className="w-full h-48 object-cover rounded-xl mb-4" />
            <h3 className="text-2xl font-bold font-playfair mb-2 text-eco-green dark:text-eco-yellow">{selectedItem.name}</h3>
            <p className="text-gray-600 dark:text-eco-yellow/80 mb-4">{selectedItem.description}</p>
            {selectedItem.tags && (
              <div className="flex gap-2 mb-4 flex-wrap">
                {selectedItem.tags.map((tag) => (
                  <span key={tag} className="bg-eco-green/10 text-eco-green px-2 py-1 rounded-full text-xs dark:bg-eco-yellow/20 dark:text-eco-yellow">{tag}</span>
                ))}
              </div>
            )}
            {selectedItem.rating && (
              <div className="flex items-center gap-2 mb-4">
                {getStars(selectedItem.rating)}
                <span className="text-gray-400 text-xs">({selectedItem.rating})</span>
              </div>
            )}
            <div className="flex items-center gap-4 mb-4">
              <span className="text-2xl font-bold text-eco-green dark:text-eco-yellow">£{selectedItem.price.toFixed(2)}</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleAddToCart(selectedItem)}
                className="bg-eco-green text-white px-4 py-2 rounded-lg flex-1 flex items-center justify-center gap-2 hover:bg-eco-yellow hover:text-eco-green dark:bg-eco-yellow dark:text-gray-900 dark:hover:bg-eco-green dark:hover:text-white transition font-semibold"
              >
                <FaShoppingCart /> Add to Cart
              </button>
              <button
                onClick={() => removeItem(selectedItem.id)}
                className="bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-200 dark:hover:bg-red-700 transition"
              >
                <FaTrash /> Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-8 right-8 z-50 bg-white dark:bg-gray-900 border border-eco-yellow text-eco-green dark:text-eco-yellow px-6 py-3 rounded-xl shadow-lg flex items-center gap-3 animate-fade-in">
          {toast.type === 'cart' ? <FaShoppingCart className="text-2xl" /> : <FaHeart className="text-2xl" />}
          <span className="font-semibold">{toast.message}</span>
        </div>
      )}
    </>
  );
};

export default WishList; 
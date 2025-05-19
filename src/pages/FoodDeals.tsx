import React, { useState, useEffect } from 'react';
import { FaSearch, FaLeaf, FaFire, FaStar, FaCarrot, FaFish, FaAppleAlt, FaShoppingCart, FaHeart, FaTag, FaMinus, FaPlus, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import CartModal from '../components/CartModal';

const categories = [
  { name: 'Vegetables', icon: <FaLeaf className="text-eco-green" /> },
  { name: 'Fruits', icon: <FaAppleAlt className="text-eco-yellow" /> },
  { name: 'Bakery', icon: <FaStar className="text-yellow-500" /> },
  { name: 'Seafood', icon: <FaFish className="text-blue-400" /> },
  { name: 'Snacks', icon: <FaCarrot className="text-orange-400" /> },
  { name: 'Meals', icon: <FaFire className="text-red-400" /> },
];

const tags = ['organic', 'vegan', 'fresh', 'protein', 'snack'];

const FoodDeals: React.FC = () => {
  const { user } = useAuth();
  const { cart, addToCart } = useCart();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalDeal, setModalDeal] = useState<any>(null);
  const [cartModal, setCartModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [deals, setDeals] = useState([]);
  const [loadingDeals, setLoadingDeals] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    setLoadingDeals(true);
    setErrorMsg('');
    fetch('https://qtavtrnrevqvjytklpsb.supabase.co/rest/v1/products?select=*', {
      headers: {
        apikey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0YXZ0cm5yZXZxdmp5dGtscHNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY5MjM5OTcsImV4cCI6MjA2MjQ5OTk5N30.9PBunJ6CmoOKz_dufo3lq7rm6qBVn0_EljXI1VjpyQI',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0YXZ0cm5yZXZxdmp5dGtscHNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY5MjM5OTcsImV4cCI6MjA2MjQ5OTk5N30.9PBunJ6CmoOKz_dufo3lq7rm6qBVn0_EljXI1VjpyQI'
      }
    })
      .then(res => res.json())
      .then(data => {
        // Normalize data types
        const normalized = (data || []).map(product => {
          const basePrice = product.price ? Number(product.price) : 0;
          return {
            ...product,
            originalPrice: basePrice,
            price: basePrice * 0.7,
            rating: product.rating ? Number(product.rating) : 0,
            discountPercent: 30,
            tags: Array.isArray(product.tags) ? product.tags : [],
          };
        });
        setDeals(normalized);
        setLoadingDeals(false);
      })
      .catch(error => {
        setErrorMsg(error.message || 'Failed to fetch deals');
        setDeals([]);
        setLoadingDeals(false);
      });
  }, []);

  const filteredDeals = deals.filter(deal => {
    return (
      (!selectedCategory || deal.category === selectedCategory) &&
      (!selectedTag || (deal.tags && deal.tags.includes(selectedTag))) &&
      (deal.name.toLowerCase().includes(search.toLowerCase()) || deal.description.toLowerCase().includes(search.toLowerCase()))
    );
  });

  const featuredDeal = deals.find(d => d && d.featured) || deals[0] || {};

  const handleAddToCart = (deal) => {
    if (!user) {
      navigate('/login');
      return;
    }
    addToCart(deal);
    setToast({ type: 'cart', message: `${deal.name} added to cart!` });
    setTimeout(() => setToast(null), 2000);
  };

  const handleWishlist = (deal) => {
    if (!user) {
      navigate('/login');
      return;
    }
    setWishlist(prev => prev.some(p => p.id === deal.id) ? prev.filter(p => p.id !== deal.id) : [...prev, deal]);
    setToast({ type: 'wishlist', message: wishlist.some(p => p.id === deal.id) ? `${deal.name} removed from wishlist` : `${deal.name} added to wishlist!` });
    setTimeout(() => setToast(null), 2000);
  };

  // Calculate cart summary
  const cartSummary = cart.reduce((acc, item) => {
    const found = acc.find(i => i.id === item.id);
    if (found) {
      found.qty += 1;
    } else {
      acc.push({ ...item, qty: 1 });
    }
    return acc;
  }, []);
  const cartTotal = cartSummary.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleProceedToCheckout = () => {
    setCartModal(false);
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      {/* Toast Notifications */}
      {toast && (
        <div className={`fixed top-4 right-4 z-[200] px-4 py-2 rounded-lg shadow-lg animate-fade-in ${
          toast.type === 'cart' ? 'bg-eco-green text-white' : 'bg-eco-yellow text-eco-green'
        }`}>
          {toast.message}
        </div>
      )}

      {/* Floating Checkout Icon */}
      {cart.length > 0 && (
        <button
          className="fixed z-[120] bg-eco-green text-white dark:bg-eco-yellow dark:text-gray-900 rounded-full shadow-2xl p-5 flex items-center gap-2 hover:bg-eco-yellow hover:text-eco-green dark:hover:bg-eco-green dark:hover:text-white transition text-2xl font-bold animate-fade-in border-4 border-white dark:border-gray-900 drop-shadow-2xl scale-100 opacity-95 hover:scale-105 hover:opacity-100"
          onClick={() => setCartModal(true)}
          aria-label="View cart and checkout"
          style={{ position: 'fixed', bottom: '3.5rem', right: '2.5rem' }}
        >
          <FaShoppingCart />
          <span className="absolute -top-2 -right-2 bg-eco-yellow text-eco-green rounded-full px-2 py-0.5 text-xs font-bold">{cart.length}</span>
        </button>
      )}

      {/* Cart Modal */}
      <CartModal isOpen={cartModal} onClose={() => setCartModal(false)} />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-eco-green via-eco-green/80 to-eco-green/60 dark:from-gray-900 dark:via-gray-900/90 dark:to-gray-900 min-h-[220px] flex items-center justify-center pt-20">
        <div className="absolute inset-0 bg-[url('/assets/gallery2.jpeg')] bg-cover bg-center opacity-20 mix-blend-multiply dark:opacity-30"></div>
        <div className="relative z-10 text-center py-10 px-4 max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold font-playfair text-white mb-3 drop-shadow-lg">Today's Food Deals</h1>
          <p className="text-lg text-white/90 mb-6">Save food, save money, and help the planet. Discover exclusive eco-friendly deals near you!</p>
          <div className="flex items-center bg-white/90 dark:bg-gray-800/80 rounded-lg shadow px-4 py-2 max-w-md mx-auto">
            <FaSearch className="text-eco-green dark:text-eco-yellow mr-2" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search for deals, e.g. bread, vegan..."
              className="flex-1 bg-transparent outline-none text-gray-700 dark:text-eco-yellow placeholder-gray-400 dark:placeholder-eco-yellow/60 py-2"
            />
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="max-w-5xl mx-auto px-4 py-6">
        <h2 className="text-xl font-bold text-eco-green dark:text-eco-yellow mb-3 font-playfair">Popular Categories</h2>
        <div className="flex flex-wrap gap-4">
          {categories.map(cat => (
            <button
              key={cat.name}
              onClick={() => setSelectedCategory(cat.name === selectedCategory ? '' : cat.name)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border transition shadow-sm hover:shadow-md ${selectedCategory === cat.name ? 'bg-eco-green text-white border-eco-green dark:bg-eco-yellow dark:text-gray-900 dark:border-eco-yellow' : 'bg-white text-eco-green border-eco-green/30 dark:bg-gray-800 dark:text-eco-yellow dark:border-eco-yellow/30'}`}
            >
              {cat.icon}
              <span className="font-semibold">{cat.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Filters Bar */}
      <section className="max-w-5xl mx-auto px-4 pb-2 flex flex-wrap gap-2 items-center">
        <span className="text-gray-500 dark:text-eco-yellow/70">Filter by tag:</span>
        {tags.map(tag => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag === selectedTag ? '' : tag)}
            className={`flex items-center gap-1 px-3 py-1 rounded-full border text-sm transition hover:bg-eco-yellow/30 dark:hover:bg-eco-yellow/40 ${selectedTag === tag ? 'bg-eco-yellow text-eco-green border-eco-yellow dark:bg-eco-yellow dark:text-gray-900 dark:border-eco-yellow' : 'bg-white text-eco-green border-eco-green/30 dark:bg-gray-800 dark:text-eco-yellow dark:border-eco-yellow/30'}`}
          >
            <FaTag className="mr-1" /> {tag}
          </button>
        ))}
        {(selectedCategory || selectedTag) && (
          <button onClick={() => { setSelectedCategory(''); setSelectedTag(''); }} className="ml-2 text-xs text-gray-400 dark:text-eco-yellow/60 underline">Clear filters</button>
        )}
      </section>

      {/* Featured Deal */}
      <section className="max-w-5xl mx-auto px-4 py-6">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg flex flex-col md:flex-row overflow-hidden hover:shadow-2xl transition group">
          {featuredDeal && featuredDeal.image ? (
            <img src={featuredDeal.image} alt={featuredDeal.name || ''} className="w-full md:w-1/3 h-56 object-cover group-hover:scale-105 transition-transform duration-300" />
          ) : (
            <div className="w-full md:w-1/3 h-56 bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-400">No Image</div>
          )}
          <div className="flex-1 p-6 flex flex-col justify-between">
            <div>
              <span className="inline-block bg-eco-yellow text-eco-green font-bold px-3 py-1 rounded-full text-sm mb-2 dark:bg-eco-yellow/80 dark:text-gray-900">Featured Deal</span>
              <h3 className="text-2xl font-bold font-playfair mb-2 text-eco-green dark:text-eco-yellow">{featuredDeal && featuredDeal.name}</h3>
              <p className="text-gray-600 dark:text-eco-yellow/80 mb-3">{featuredDeal && featuredDeal.description}</p>
              <div className="flex gap-2 mb-2">
                {(featuredDeal && featuredDeal.tags && Array.isArray(featuredDeal.tags)) && featuredDeal.tags.map((tag: string) => (
                  <span key={tag} className="bg-eco-green/10 text-eco-green px-2 py-1 rounded-full text-xs dark:bg-eco-yellow/20 dark:text-eco-yellow">{tag}</span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4 mt-2">
              {typeof featuredDeal.originalPrice === 'number' ? (
                <span className="text-xl font-bold text-gray-400 line-through">£{featuredDeal.originalPrice.toFixed(2)}</span>
              ) : null}
              {typeof featuredDeal.price === 'number' ? (
                <span className="text-2xl font-bold text-eco-green dark:text-eco-yellow">£{featuredDeal.price.toFixed(2)}</span>
              ) : null}
              {typeof featuredDeal.discountPercent === 'number' ? (
                <span className="bg-eco-yellow text-eco-green font-bold px-2 py-1 rounded-full text-xs ml-2">-{featuredDeal.discountPercent}%</span>
              ) : null}
              <button 
                onClick={() => handleAddToCart(featuredDeal)}
                className="bg-eco-green text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-eco-yellow hover:text-eco-green dark:bg-eco-yellow dark:text-gray-900 dark:hover:bg-eco-green dark:hover:text-white transition font-semibold"
              >
                <FaShoppingCart /> Add to Cart
              </button>
              <button 
                onClick={() => handleWishlist(featuredDeal)}
                className="bg-white border border-eco-green text-eco-green px-3 py-2 rounded-lg flex items-center gap-2 hover:bg-eco-green hover:text-white dark:bg-gray-800 dark:border-eco-yellow dark:text-eco-yellow dark:hover:bg-eco-yellow dark:hover:text-gray-900 transition"
              >
                <FaHeart /> Save
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Deals Grid */}
      {loadingDeals ? (
        <div className="text-center py-12 text-eco-green dark:text-eco-yellow text-xl">Loading deals...</div>
      ) : errorMsg ? (
        <div className="text-center py-12 text-red-600 dark:text-red-400 text-xl">{errorMsg}</div>
      ) : (
        <section className="max-w-5xl mx-auto px-4 pb-12">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDeals.map(deal => (
              <div key={deal.id} className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden flex flex-col hover:shadow-2xl transition group relative">
                {deal && deal.image ? (
                  <img src={deal.image} alt={deal.name || ''} className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <div className="w-full h-40 bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-400">No Image</div>
                )}
                <div className="absolute top-3 left-3 flex flex-col gap-1">
                  {typeof deal.price === 'number' ? (
                    <div className="bg-eco-yellow text-eco-green font-bold px-3 py-1 rounded-full text-xs shadow dark:bg-eco-yellow/80 dark:text-gray-900">£{deal.price.toFixed(2)}</div>
                  ) : null}
                  {typeof deal.originalPrice === 'number' ? (
                    <div className="text-xs text-gray-400 line-through">£{deal.originalPrice.toFixed(2)}</div>
                  ) : null}
                  {typeof deal.discountPercent === 'number' ? (
                    <div className="bg-red-500 text-white font-bold px-2 py-0.5 rounded-full text-xs">-{deal.discountPercent}%</div>
                  ) : null}
                </div>
                <div className="flex-1 p-5 flex flex-col justify-between">
                  <div>
                    <h4 className="text-lg font-bold font-playfair mb-1 text-eco-green dark:text-eco-yellow">{deal && deal.name}</h4>
                    <p className="text-gray-600 dark:text-eco-yellow/80 mb-2 text-sm line-clamp-2">{deal && deal.description}</p>
                    <div className="flex gap-1 mb-2 flex-wrap">
                      {(deal && deal.tags && Array.isArray(deal.tags)) && deal.tags.map((tag: string) => (
                        <span key={tag} className="bg-eco-green/10 text-eco-green px-2 py-1 rounded-full text-xs dark:bg-eco-yellow/20 dark:text-eco-yellow">{tag}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <button 
                      onClick={() => handleAddToCart(deal)}
                      className="bg-eco-green text-white px-3 py-2 rounded-lg flex-1 flex items-center justify-center gap-2 hover:bg-eco-yellow hover:text-eco-green dark:bg-eco-yellow dark:text-gray-900 dark:hover:bg-eco-green dark:hover:text-white transition font-semibold"
                    >
                      <FaShoppingCart /> Add
                    </button>
                    <button 
                      onClick={() => handleWishlist(deal)}
                      className="bg-white border border-eco-green text-eco-green px-3 py-2 rounded-lg flex items-center gap-2 hover:bg-eco-green hover:text-white dark:bg-gray-800 dark:border-eco-yellow dark:text-eco-yellow dark:hover:bg-eco-yellow dark:hover:text-gray-900 transition"
                    >
                      <FaHeart />
                    </button>
                    <button 
                      onClick={() => { setShowModal(true); setModalDeal(deal); }} 
                      className="ml-auto text-xs underline text-gray-400 dark:text-eco-yellow/60 hover:text-eco-green dark:hover:text-eco-yellow"
                    >
                      Quick View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {filteredDeals.length === 0 && (
            <div className="text-center text-gray-400 dark:text-eco-yellow/60 py-12">No deals found. Try a different search or filter.</div>
          )}
        </section>
      )}

      {/* How it Works Mini Section */}
      <section className="bg-eco-green/10 dark:bg-gray-900 py-10">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold font-playfair text-eco-green dark:text-eco-yellow mb-4">How It Works</h2>
          <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
            <div className="flex-1 flex flex-col items-center">
              <div className="bg-eco-yellow text-eco-green rounded-full w-12 h-12 flex items-center justify-center mb-2 dark:text-gray-900"><FaFire /></div>
              <div className="font-bold text-eco-green dark:text-eco-yellow">Browse Deals</div>
              <div className="text-gray-500 dark:text-eco-yellow/70 text-sm">Find surplus food and eco-friendly offers from local partners.</div>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <div className="bg-eco-yellow text-eco-green rounded-full w-12 h-12 flex items-center justify-center mb-2 dark:text-gray-900"><FaShoppingCart /></div>
              <div className="font-bold text-eco-green dark:text-eco-yellow">Add to Cart</div>
              <div className="text-gray-500 dark:text-eco-yellow/70 text-sm">Select your favorites and add them to your cart in one click.</div>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <div className="bg-eco-yellow text-eco-green rounded-full w-12 h-12 flex items-center justify-center mb-2 dark:text-gray-900"><FaLeaf /></div>
              <div className="font-bold text-eco-green dark:text-eco-yellow">Pick Up & Enjoy</div>
              <div className="text-gray-500 dark:text-eco-yellow/70 text-sm">Collect your order and help reduce food waste in your community.</div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick View Modal */}
      {showModal && modalDeal && (
        <div
          className="fixed inset-0 bg-black/40 dark:bg-black/80 z-50 flex items-center justify-center"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl max-w-md w-full p-6 relative animate-fade-in"
            onClick={e => e.stopPropagation()}
          >
            <button onClick={() => setShowModal(false)} className="absolute top-3 right-3 text-gray-400 hover:text-eco-green dark:text-eco-yellow dark:hover:text-eco-green text-xl">×</button>
            {modalDeal && modalDeal.image ? (
              <img src={modalDeal.image} alt={modalDeal.name || ''} className="w-full h-48 object-cover rounded-xl mb-4" />
            ) : (
              <div className="w-full h-48 bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-400 mb-4">No Image</div>
            )}
            <h3 className="text-2xl font-bold font-playfair text-eco-green dark:text-eco-yellow mb-2">{modalDeal && modalDeal.name}</h3>
            <div className="flex items-center gap-2 mb-2">
              {typeof modalDeal.originalPrice === 'number' ? (
                <span className="text-xl font-bold text-gray-400 line-through">£{modalDeal.originalPrice.toFixed(2)}</span>
              ) : null}
              {typeof modalDeal.price === 'number' ? (
                <span className="text-2xl font-bold text-eco-green dark:text-eco-yellow">£{modalDeal.price.toFixed(2)}</span>
              ) : null}
              {typeof modalDeal.discountPercent === 'number' ? (
                <span className="bg-eco-yellow text-eco-green font-bold px-2 py-1 rounded-full text-xs">-{modalDeal.discountPercent}%</span>
              ) : null}
            </div>
            <div className="flex gap-2 mb-2 flex-wrap">
              {(modalDeal && modalDeal.tags && Array.isArray(modalDeal.tags)) && modalDeal.tags.map((tag: string) => (
                <span key={tag} className="bg-eco-green/10 text-eco-green px-2 py-1 rounded-full text-xs dark:bg-eco-yellow/20 dark:text-eco-yellow">{tag}</span>
              ))}
            </div>
            <p className="text-gray-600 dark:text-eco-yellow/80 mb-4">{modalDeal && modalDeal.description}</p>
            <button 
              onClick={() => handleAddToCart(modalDeal)}
              className="w-full bg-eco-green text-white py-3 rounded-lg font-bold hover:bg-eco-yellow hover:text-eco-green dark:bg-eco-yellow dark:text-gray-900 dark:hover:bg-eco-green dark:hover:text-white transition flex items-center justify-center gap-2"
            >
              <FaShoppingCart /> Add to Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodDeals; 
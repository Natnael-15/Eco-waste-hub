import React, { useState, useRef, useEffect } from 'react';
import { FaSearch, FaHeart, FaShoppingCart, FaStar, FaTag, FaLeaf, FaAppleAlt, FaFish, FaCarrot, FaFire, FaStore, FaTruck, FaRecycle, FaUsers, FaBolt, FaMinus, FaPlus, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import demoProducts from '../data/demoProducts';
import { supabase, supabaseUrl, supabaseAnonKey } from '../lib/supabase';
import CartModal from '../components/CartModal';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';

const categories = [
  { name: 'All', icon: <FaStore className="text-eco-green" /> },
  { name: 'Vegetables', icon: <FaLeaf className="text-eco-green" /> },
  { name: 'Fruits', icon: <FaAppleAlt className="text-eco-yellow" /> },
  { name: 'Bakery', icon: <FaStar className="text-yellow-500" /> },
  { name: 'Dairy', icon: <FaFire className="text-red-400" /> },
  { name: 'Seafood', icon: <FaFish className="text-blue-400" /> },
  { name: 'Snacks', icon: <FaCarrot className="text-orange-400" /> },
  { name: 'Meals', icon: <FaFire className="text-red-400" /> },
];

const tags = ['organic', 'vegan', 'fresh', 'protein', 'snack', 'family'];

const partners = [
  {
    name: 'Green Farms',
    logo: 'https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg?auto=compress&w=96&q=80',
    tagline: 'Organic & Local Produce',
  },
  {
    name: 'Baker Bros',
    logo: 'https://images.pexels.com/photos/461382/pexels-photo-461382.jpeg?auto=compress&w=96&q=80',
    tagline: 'Fresh Artisan Bakery',
  },
  {
    name: 'Fruitful',
    logo: 'https://images.pexels.com/photos/1128678/pexels-photo-1128678.jpeg?auto=compress&w=96&q=80',
    tagline: 'Seasonal Fruit Experts',
  },
  {
    name: 'DairyBest',
    logo: 'https://images.pexels.com/photos/416656/pexels-photo-416656.jpeg?auto=compress&w=96&q=80',
    tagline: 'Quality Dairy Products',
  },
];

const brandToCategory = {
  'Green Farms': 'Vegetables',
  'Baker Bros': 'Bakery',
  'Fruitful': 'Fruits',
  'DairyBest': 'Dairy',
};

function getStars(rating) {
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
}

interface ShopProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const Shop: React.FC<ShopProps> = ({ darkMode, toggleDarkMode }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTag, setSelectedTag] = useState('');
  const [search, setSearch] = useState('');
  const [wishlist, setWishlist] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalProduct, setModalProduct] = useState(null);
  const [toast, setToast] = useState(null);
  const [brandModal, setBrandModal] = useState(null);
  const [cartModal, setCartModal] = useState(false);
  const productsGridRef = useRef(null);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const { cart, addToCart, cartSummary, cartTotal, updateQuantity, removeFromCart } = useCart();

  // Memoize filtered products to prevent unnecessary recalculations
  const filteredProducts = React.useMemo(() => {
    return products.filter(product => {
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const matchesTag = !selectedTag || product.tags.includes(selectedTag);
      const matchesSearch = !search || 
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.description.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesTag && matchesSearch;
    });
  }, [products, selectedCategory, selectedTag, search]);

  useEffect(() => {
    fetch('https://qtavtrnrevqvjytklpsb.supabase.co/rest/v1/products?select=*', {
      headers: {
        apikey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0YXZ0cm5yZXZxdmp5dGtscHNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY5MjM5OTcsImV4cCI6MjA2MjQ5OTk5N30.9PBunJ6CmoOKz_dufo3lq7rm6qBVn0_EljXI1VjpyQI',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0YXZ0cm5yZXZxdmp5dGtscHNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY5MjM5OTcsImV4cCI6MjA2MjQ5OTk5N30.9PBunJ6CmoOKz_dufo3lq7rm6qBVn0_EljXI1VjpyQI'
      }
    })
      .then(res => res.json())
      .then(data => {
        console.log('[Shop] Direct fetch data:', data);
        // Normalize data types
        const normalized = (data || []).map(product => ({
          ...product,
          price: product.price ? Number(product.price) : 0,
          rating: product.rating ? Number(product.rating) : 0,
          discountPercent: product.discount_percent !== undefined ? Number(product.discount_percent) : null,
          originalPrice: product.original_price !== undefined ? Number(product.original_price) : null,
          tags: Array.isArray(product.tags) ? product.tags : [],
        }));
        console.log('[Shop] Normalized products:', normalized);
        setProducts(normalized);
        setLoading(false);
      })
      .catch(err => {
        console.error('[Shop] Direct fetch error:', err);
        setLoading(false);
      });
  }, []);

  console.log('selectedCategory:', selectedCategory);
  console.log('selectedTag:', selectedTag);
  console.log('search:', search);
  console.log('Filtered products:', filteredProducts);

  const featuredProduct = products.find(p => p.featured) || products[0];
  const bestSellers = products.slice(0, 5);
  const recommended = products.slice(5, 15);

  const handleAddToCart = (product) => {
    addToCart(product);
    setToast({ type: 'cart', message: `${product.name} added to cart!` });
    setTimeout(() => setToast(null), 2000);
  };

  const handleWishlist = (product) => {
    setWishlist(prev => prev.some(p => p.id === product.id) ? prev.filter(p => p.id !== product.id) : [...prev, product]);
    setToast({ type: 'wishlist', message: wishlist.some(p => p.id === product.id) ? `${product.name} removed from wishlist` : `${product.name} added to wishlist!` });
    setTimeout(() => setToast(null), 2000);
  };

  // Brand modal custom styles
  const brandModalStyles = brandModal ? {
    'Green Farms': {
      bg: 'bg-green-50 dark:bg-green-900',
      accent: 'text-green-700 dark:text-green-200',
      border: 'border-green-200 dark:border-green-700',
    },
    'Baker Bros': {
      bg: 'bg-yellow-50 dark:bg-yellow-900',
      accent: 'text-yellow-700 dark:text-yellow-200',
      border: 'border-yellow-200 dark:border-yellow-700',
    },
    'Fruitful': {
      bg: 'bg-pink-50 dark:bg-pink-900',
      accent: 'text-pink-700 dark:text-pink-200',
      border: 'border-pink-200 dark:border-pink-700',
    },
    'DairyBest': {
      bg: 'bg-blue-50 dark:bg-blue-900',
      accent: 'text-blue-700 dark:text-blue-200',
      border: 'border-blue-200 dark:border-blue-700',
    },
  }[brandModal.name] : {};

  // Add category modal styles
  const categoryModalStyles = modalProduct ? {
    'Vegetables': {
      bg: 'bg-green-50 dark:bg-green-900',
      accent: 'text-green-700 dark:text-green-200',
      border: 'border-green-200 dark:border-green-700',
    },
    'Bakery': {
      bg: 'bg-yellow-50 dark:bg-yellow-900',
      accent: 'text-yellow-700 dark:text-yellow-200',
      border: 'border-yellow-200 dark:border-yellow-700',
    },
    'Fruits': {
      bg: 'bg-pink-50 dark:bg-pink-900',
      accent: 'text-pink-700 dark:text-pink-200',
      border: 'border-pink-200 dark:border-pink-700',
    },
    'Dairy': {
      bg: 'bg-blue-50 dark:bg-blue-900',
      accent: 'text-blue-700 dark:text-blue-200',
      border: 'border-blue-200 dark:border-blue-700',
    },
    'Snacks': {
      bg: 'bg-orange-50 dark:bg-orange-900',
      accent: 'text-orange-700 dark:text-orange-200',
      border: 'border-orange-200 dark:border-orange-700',
    },
    'Meals': {
      bg: 'bg-red-50 dark:bg-red-900',
      accent: 'text-red-700 dark:text-red-200',
      border: 'border-red-200 dark:border-red-700',
    },
    'Seafood': {
      bg: 'bg-blue-50 dark:bg-blue-900',
      accent: 'text-blue-700 dark:text-blue-200',
      border: 'border-blue-200 dark:border-blue-700',
    },
  }[modalProduct.category] : {};

  // Robust scroll lock: use document.body.style.overflow
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    if (brandModal || modalProduct || cartModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = originalOverflow || '';
    }
    return () => {
      document.body.style.overflow = originalOverflow || '';
    };
  }, [brandModal, modalProduct, cartModal]);

  const handleProceedToCheckout = () => {
    setCartModal(false);
    navigate('/checkout');
  };

  // Before rendering the products grid, log filteredProducts
  console.log('[Shop] Filtered products before render:', filteredProducts);

  return (
    <>
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-amber-50 to-emerald-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-300 pb-20">
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

      {/* Unique Hero Section */}
      <section className="relative flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto px-4 pt-24 pb-12 gap-8">
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-5xl font-extrabold font-playfair text-emerald-700 dark:text-eco-yellow mb-4 drop-shadow-lg">Discover, Shop, Save</h1>
          <p className="text-xl text-emerald-900 dark:text-eco-yellow/90 mb-6 max-w-lg">Your eco-marketplace for surplus food and sustainable groceries. Shop best sellers, new arrivals, and exclusive brands—all in one place.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <button
              className="bg-eco-green text-white px-6 py-3 rounded-full font-bold text-lg shadow hover:bg-eco-yellow hover:text-eco-green transition focus:outline-none focus:ring-2 focus:ring-eco-yellow dark:bg-eco-yellow dark:text-gray-900 dark:hover:bg-eco-green dark:hover:text-white dark:focus:ring-eco-green"
              onClick={() => {
                if (productsGridRef.current) {
                  productsGridRef.current.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              Shop Now
            </button>
            <button
              className="bg-white border-2 border-eco-green text-eco-green px-6 py-3 rounded-full font-bold text-lg shadow hover:bg-eco-green hover:text-white transition focus:outline-none focus:ring-2 focus:ring-eco-green dark:bg-gray-900 dark:border-eco-yellow dark:text-eco-yellow dark:hover:bg-eco-yellow dark:hover:text-gray-900 dark:focus:ring-eco-yellow"
                onClick={() => navigate('/about')}
            >
              Learn More
            </button>
          </div>
        </div>
        <div className="flex-1 flex justify-center md:justify-end">
          <img src="https://images.pexels.com/photos/4397920/pexels-photo-4397920.jpeg?auto=compress&w=400&q=80" alt="Shop Illustration" className="w-80 h-80 object-contain rounded-3xl shadow-2xl border-4 border-eco-yellow/40" />
        </div>
        {/* Cart Icon */}
        <div className="absolute top-6 right-8 z-20">
          <button className="relative bg-white/90 dark:bg-gray-800/80 rounded-full p-3 shadow-lg hover:bg-eco-yellow transition">
            <FaShoppingCart className="text-eco-green dark:text-eco-yellow text-2xl" />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-eco-yellow text-eco-green rounded-full px-2 py-0.5 text-xs font-bold">{cart.length}</span>
            )}
          </button>
        </div>
      </section>

      {/* Shop by Brand */}
      <section className="max-w-5xl mx-auto px-4 py-6">
        <h2 className="text-2xl font-bold text-emerald-700 dark:text-eco-yellow mb-4 font-playfair">Shop by Brand</h2>
        <div className="flex gap-8 overflow-x-auto pb-2">
          {partners.map(partner => (
            <div
              key={partner.name}
              className="flex flex-col items-center min-w-[140px] bg-white dark:bg-gray-900 rounded-2xl shadow hover:shadow-lg transition p-4 border border-emerald-100 dark:border-gray-800 hover:-translate-y-1 cursor-pointer"
              onClick={() => setBrandModal(partner)}
            >
              <img src={partner.logo} alt={partner.name} className="w-16 h-16 object-cover rounded-full mb-2 border-2 border-eco-yellow/60 shadow" />
              <span className="font-semibold text-eco-green dark:text-eco-yellow text-center">{partner.name}</span>
              <span className="text-xs text-gray-500 dark:text-eco-yellow/70 text-center mt-1">{partner.tagline}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Brand Modal */}
      {brandModal && (
        <div className="fixed inset-0 bg-black/40 dark:bg-black/80 z-50 flex items-center justify-center" onClick={() => setBrandModal(null)}>
          <div
            className={`rounded-2xl shadow-xl max-w-2xl w-full p-8 relative animate-fade-in border-4 ${brandModalStyles.bg} ${brandModalStyles.border} max-h-[70vh] overflow-y-auto`}
            onClick={e => e.stopPropagation()}
          >
            <button onClick={() => setBrandModal(null)} className="absolute top-3 right-3 text-gray-400 hover:text-eco-green dark:text-eco-yellow dark:hover:text-eco-green text-2xl">×</button>
            <div className="flex items-center gap-4 mb-6">
              <img src={brandModal.logo} alt={brandModal.name} className={`w-14 h-14 object-cover rounded-full border-2 shadow ${brandModalStyles.border}`} />
              <div>
                <div className={`font-bold text-xl ${brandModalStyles.accent}`}>{brandModal.name}</div>
                <div className="text-xs text-gray-500 dark:text-eco-yellow/70">{brandModal.tagline}</div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {products.filter(p => p.category === brandToCategory[brandModal.name]).length === 0 ? (
                <div className="col-span-2 text-center text-gray-400 dark:text-eco-yellow/60 py-8">No products found for this brand.</div>
              ) : (
                products.filter(p => p.category === brandToCategory[brandModal.name]).map(product => (
                  <div key={product.id} className={`rounded-xl shadow p-4 flex flex-col border-2 ${brandModalStyles.bg} ${brandModalStyles.border}`}>
                    <img src={product.image} alt={product.name} className="w-full h-32 object-cover rounded-lg mb-2" />
                    <div className={`font-bold mb-1 ${brandModalStyles.accent}`}>{product.name}</div>
                    <div className="text-gray-600 dark:text-eco-yellow/80 text-sm mb-1 line-clamp-2">{product.description}</div>
                    <div className="flex items-center gap-1 mb-1">{getStars(product.rating)}<span className="text-gray-400 text-xs">({product.rating})</span></div>
                    <div className="flex items-center gap-2 mt-auto">
                      <span className={`text-lg font-bold ${brandModalStyles.accent}`}>£{product.price.toFixed(2)}</span>
                      <button onClick={() => handleAddToCart(product)} className="bg-eco-green text-white px-3 py-1 rounded-lg flex-1 flex items-center justify-center gap-2 hover:bg-eco-yellow hover:text-eco-green dark:bg-eco-yellow dark:text-gray-900 dark:hover:bg-eco-green dark:hover:text-white transition font-semibold text-sm"><FaShoppingCart /> Add</button>
                      <button onClick={() => handleWishlist(product)} className={`bg-white border border-eco-green text-eco-green px-2 py-1 rounded-lg flex items-center gap-2 hover:bg-eco-green hover:text-white dark:bg-gray-900 dark:border-eco-yellow dark:text-eco-yellow dark:hover:bg-eco-yellow dark:hover:text-gray-900 transition text-sm ${wishlist.some(p => p.id === product.id) ? 'bg-eco-yellow/30' : ''}`}><FaHeart /></button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Best Sellers */}
      <section className="max-w-5xl mx-auto px-4 py-6">
        <h2 className="text-xl font-bold text-emerald-700 dark:text-eco-yellow mb-3 font-playfair">Best Sellers</h2>
        <div className="flex gap-6 overflow-x-auto pb-2">
          {bestSellers.map(product => (
            <div key={product.id} className="min-w-[260px] bg-white dark:bg-gray-900 rounded-2xl shadow-lg flex flex-col hover:shadow-2xl transition group relative border-2 border-emerald-100 dark:border-gray-800">
              <img src={product.image} alt={product.name} className="w-full h-36 object-cover rounded-t-2xl" />
              <div className="flex-1 p-4 flex flex-col justify-between">
                <div>
                  <h4 className="text-lg font-bold font-playfair mb-1 text-eco-green dark:text-eco-yellow">{product.name}</h4>
                  <div className="flex items-center gap-1 mb-1">{getStars(product.rating)}<span className="text-gray-400 text-xs">({product.rating})</span></div>
                  <span className="text-eco-green font-bold">£{product.price.toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <button onClick={() => handleAddToCart(product)} className="bg-eco-green text-white px-3 py-1 rounded-lg flex-1 flex items-center justify-center gap-2 hover:bg-eco-yellow hover:text-eco-green dark:bg-eco-yellow dark:text-gray-900 dark:hover:bg-eco-green dark:hover:text-white transition font-semibold text-sm"><FaShoppingCart /> Add</button>
                  <button onClick={() => handleWishlist(product)} className={`bg-white border border-eco-green text-eco-green px-2 py-1 rounded-lg flex items-center gap-2 hover:bg-eco-green hover:text-white dark:bg-gray-800 dark:border-eco-yellow dark:text-eco-yellow dark:hover:bg-eco-yellow dark:hover:text-gray-900 transition text-sm ${wishlist.some(p => p.id === product.id) ? 'bg-eco-yellow/30' : ''}`}><FaHeart /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Large Featured Product Banner */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        {loading ? (
          <div className="relative bg-gradient-to-r from-eco-yellow/80 via-amber-200 to-emerald-100 dark:from-eco-yellow/60 dark:via-gray-800 dark:to-gray-900 rounded-3xl shadow-2xl flex flex-col md:flex-row items-center overflow-hidden p-8">
            <div className="w-full md:w-1/3 h-64 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-t-3xl md:rounded-l-3xl md:rounded-t-none"></div>
            <div className="flex-1 p-8 flex flex-col justify-center items-center md:items-start">
              <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-full mb-2"></div>
              <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 animate-pulse rounded mb-2"></div>
              <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 animate-pulse rounded mb-3"></div>
              <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-full mb-4"></div>
            </div>
          </div>
        ) : featuredProduct ? (
          <div className="relative bg-gradient-to-r from-eco-yellow/80 via-amber-200 to-emerald-100 dark:from-eco-yellow/60 dark:via-gray-800 dark:to-gray-900 rounded-3xl shadow-2xl flex flex-col md:flex-row items-center overflow-hidden">
            <img src={featuredProduct.image} alt={featuredProduct.name} className="w-full md:w-1/3 h-64 object-cover rounded-t-3xl md:rounded-l-3xl md:rounded-t-none shadow-lg" />
            <div className="flex-1 p-8 flex flex-col justify-center items-center md:items-start">
              <span className="inline-block bg-eco-green text-white font-bold px-4 py-1 rounded-full text-sm mb-2">Featured</span>
              <h3 className="text-3xl font-extrabold font-playfair mb-2 text-emerald-800 dark:text-eco-yellow">{featuredProduct.name}</h3>
              <p className="text-gray-700 dark:text-eco-yellow/80 mb-3 max-w-lg">{featuredProduct.description}</p>
              <div className="flex gap-2 mb-2">
                {featuredProduct.tags?.map((tag) => (
                  <span key={tag} className="bg-eco-green/10 text-eco-green px-2 py-1 rounded-full text-xs dark:bg-eco-yellow/20 dark:text-eco-yellow">{tag}</span>
                ))}
              </div>
              <div className="flex items-center gap-2 mb-2">
                {getStars(featuredProduct.rating)}
                <span className="text-gray-400 text-xs">({featuredProduct.rating})</span>
              </div>
              <span className="text-2xl font-bold text-eco-green dark:text-eco-yellow mb-4">£{featuredProduct.price.toFixed(2)}</span>
              <button onClick={() => handleAddToCart(featuredProduct)} className="bg-eco-green text-white px-6 py-3 rounded-full font-bold text-lg shadow hover:bg-eco-yellow hover:text-eco-green dark:bg-eco-yellow dark:text-gray-900 dark:hover:bg-eco-green dark:hover:text-white transition flex items-center gap-2"><FaShoppingCart /> Add to Cart</button>
            </div>
          </div>
        ) : null}
      </section>

      {/* Why Shop With Us? */}
      <section className="max-w-5xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold text-emerald-700 dark:text-eco-yellow mb-6 font-playfair text-center">Why Shop With Us?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="flex flex-col items-center">
            <FaTruck className="text-4xl text-eco-green mb-2" />
            <div className="font-bold text-eco-green dark:text-eco-yellow">Fast Delivery</div>
            <div className="text-gray-500 dark:text-eco-yellow/70 text-sm">Get your surplus groceries delivered quickly and safely.</div>
          </div>
          <div className="flex flex-col items-center">
            <FaRecycle className="text-4xl text-eco-green mb-2" />
            <div className="font-bold text-eco-green dark:text-eco-yellow">Eco-Friendly</div>
            <div className="text-gray-500 dark:text-eco-yellow/70 text-sm">Every purchase helps reduce food waste and supports sustainability.</div>
          </div>
          <div className="flex flex-col items-center">
            <FaUsers className="text-4xl text-eco-green mb-2" />
            <div className="font-bold text-eco-green dark:text-eco-yellow">Community Impact</div>
            <div className="text-gray-500 dark:text-eco-yellow/70 text-sm">Join a growing community making a real difference.</div>
          </div>
          <div className="flex flex-col items-center">
            <FaBolt className="text-4xl text-eco-green mb-2" />
            <div className="font-bold text-eco-green dark:text-eco-yellow">Exclusive Deals</div>
            <div className="text-gray-500 dark:text-eco-yellow/70 text-sm">Access unique offers and best prices on surplus food.</div>
          </div>
        </div>
      </section>

      {/* Shop Stats / Impact */}
      <section className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-extrabold text-eco-green dark:text-eco-yellow">12,500kg</div>
            <div className="text-gray-600 dark:text-eco-yellow/80">Food Saved</div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-eco-green dark:text-eco-yellow">3,200+</div>
            <div className="text-gray-600 dark:text-eco-yellow/80">Happy Customers</div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-eco-green dark:text-eco-yellow">40+</div>
            <div className="text-gray-600 dark:text-eco-yellow/80">Partner Brands</div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-eco-green dark:text-eco-yellow">98%</div>
            <div className="text-gray-600 dark:text-eco-yellow/80">Satisfaction</div>
          </div>
        </div>
      </section>

      {/* Tags Filter */}
      <section className="max-w-5xl mx-auto px-4 pb-2 flex flex-wrap gap-2 items-center justify-center">
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
        {(selectedCategory !== 'All' || selectedTag) && (
          <button onClick={() => { setSelectedCategory('All'); setSelectedTag(''); setSearch(''); }} className="ml-2 text-xs text-gray-400 dark:text-eco-yellow/60 underline">Reset Filters</button>
        )}
      </section>

      {/* Categories */}
      <section className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex flex-wrap gap-4 justify-center">
          {categories.map(cat => (
            <button
              key={cat.name}
              onClick={() => setSelectedCategory(cat.name)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border transition shadow-sm hover:shadow-md font-semibold ${selectedCategory === cat.name ? 'bg-eco-green text-white border-eco-green dark:bg-eco-yellow dark:text-gray-900 dark:border-eco-yellow' : 'bg-white text-eco-green border-eco-green/30 dark:bg-gray-800 dark:text-eco-yellow dark:border-eco-yellow/30'}`}
            >
              {cat.icon}
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Products Grid - Unique Card Style */}
      {loading ? (
        <div className="text-center py-12 text-eco-green dark:text-eco-yellow text-xl">Loading products...</div>
      ) : errorMsg ? (
        <div className="text-center py-12 text-red-600 dark:text-red-400 text-xl">{errorMsg}</div>
      ) : (
      <section ref={productsGridRef} className="max-w-6xl mx-auto px-4 pb-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          {filteredProducts.map(product => (
            <div key={product.id} className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl overflow-hidden flex flex-col hover:scale-105 hover:shadow-2xl transition group relative border-2 border-emerald-100 dark:border-gray-800">
              <div className="relative">
                <img src={product.image} alt={product.name} className="w-full h-44 object-cover" />
                <span className="absolute top-3 left-3 flex flex-col gap-1">
                  <span className="bg-eco-yellow text-eco-green font-bold px-3 py-1 rounded-full text-xs shadow dark:bg-eco-yellow/80 dark:text-gray-900">£{product.price.toFixed(2)}</span>
                  {product.discountPercent && (
                    <span className="text-xs text-gray-400 line-through">£{product.originalPrice.toFixed(2)}</span>
                  )}
                  {product.discountPercent && (
                    <span className="bg-red-500 text-white font-bold px-2 py-0.5 rounded-full text-xs">-{product.discountPercent}%</span>
                  )}
                </span>
                <button onClick={() => handleWishlist(product)} className={`absolute top-3 right-3 bg-white/80 dark:bg-gray-800/80 rounded-full p-2 border border-eco-green dark:border-eco-yellow shadow hover:bg-eco-yellow hover:text-eco-green dark:hover:bg-eco-yellow dark:hover:text-gray-900 transition ${wishlist.some(p => p.id === product.id) ? 'bg-eco-yellow/60' : ''}`}><FaHeart /></button>
              </div>
              <div className="flex-1 p-5 flex flex-col justify-between">
                <div>
                  <h4 className="text-lg font-bold font-playfair mb-1 text-eco-green dark:text-eco-yellow">{product.name}</h4>
                  <p className="text-gray-600 dark:text-eco-yellow/80 mb-2 text-sm line-clamp-2">{product.description}</p>
                  <div className="flex gap-1 mb-2 flex-wrap">
                    {product.tags.map((tag) => (
                      <span key={tag} className="bg-eco-green/10 text-eco-green px-2 py-1 rounded-full text-xs dark:bg-eco-yellow/20 dark:text-eco-yellow">{tag}</span>
                    ))}
                  </div>
                  <div className="flex items-center gap-1 mb-2">
                    {getStars(product.rating)}
                    <span className="text-gray-400 text-xs">({product.rating})</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <button onClick={() => handleAddToCart(product)} className="bg-eco-green text-white px-3 py-2 rounded-lg flex-1 flex items-center justify-center gap-2 hover:bg-eco-yellow hover:text-eco-green dark:bg-eco-yellow dark:text-gray-900 dark:hover:bg-eco-green dark:hover:text-white transition font-semibold"><FaShoppingCart /> Add</button>
                  <button onClick={() => { setShowModal(true); setModalProduct(product); }} className="ml-auto text-xs underline text-gray-400 dark:text-eco-yellow/60 hover:text-eco-green dark:hover:text-eco-yellow">Quick View</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {filteredProducts.length === 0 && (
          <div className="text-center text-gray-400 dark:text-eco-yellow/60 py-12">No products found. Try a different search or filter.</div>
        )}
      </section>
      )}

      {/* Recommended for You */}
      <section className="max-w-5xl mx-auto px-4 py-10">
        <h2 className="text-xl font-bold text-emerald-700 dark:text-eco-yellow mb-3 font-playfair">Recommended for You</h2>
        <div className="flex gap-6 overflow-x-auto pb-2">
          {recommended.map(product => (
            <div key={product.id} className="min-w-[260px] bg-white dark:bg-gray-900 rounded-2xl shadow-lg flex flex-col hover:shadow-2xl transition group relative border-2 border-emerald-100 dark:border-gray-800">
              <img src={product.image} alt={product.name} className="w-full h-36 object-cover rounded-t-2xl" />
              <div className="flex-1 p-4 flex flex-col justify-between">
                <div>
                  <h4 className="text-lg font-bold font-playfair mb-1 text-eco-green dark:text-eco-yellow">{product.name}</h4>
                  <div className="flex items-center gap-1 mb-1">{getStars(product.rating)}<span className="text-gray-400 text-xs">({product.rating})</span></div>
                  <span className="text-eco-green font-bold">£{product.price.toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <button onClick={() => handleAddToCart(product)} className="bg-eco-green text-white px-3 py-1 rounded-lg flex-1 flex items-center justify-center gap-2 hover:bg-eco-yellow hover:text-eco-green dark:bg-eco-yellow dark:text-gray-900 dark:hover:bg-eco-green dark:hover:text-white transition font-semibold text-sm"><FaShoppingCart /> Add</button>
                  <button onClick={() => handleWishlist(product)} className={`bg-white border border-eco-green text-eco-green px-2 py-1 rounded-lg flex items-center gap-2 hover:bg-eco-green hover:text-white dark:bg-gray-800 dark:border-eco-yellow dark:text-eco-yellow dark:hover:bg-eco-yellow dark:hover:text-gray-900 transition text-sm ${wishlist.some(p => p.id === product.id) ? 'bg-eco-yellow/30' : ''}`}><FaHeart /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick View Modal */}
      {showModal && modalProduct && (
        <div
          className="fixed inset-0 bg-black/40 dark:bg-black/80 z-50 flex items-center justify-center"
          onClick={() => { setShowModal(false); setModalProduct(null); }}
        >
          <div
            className={`rounded-2xl shadow-xl max-w-md w-full p-6 relative animate-fade-in border-4 ${categoryModalStyles.bg} ${categoryModalStyles.border}`}
            onClick={e => e.stopPropagation()}
          >
            <button onClick={() => { setShowModal(false); setModalProduct(null); }} className="absolute top-3 right-3 text-gray-400 hover:text-eco-green dark:text-eco-yellow dark:hover:text-eco-green text-xl">×</button>
            <img src={modalProduct.image} alt={modalProduct.name} className="w-full h-48 object-cover rounded-xl mb-4" />
            <h3 className={`text-2xl font-bold font-playfair mb-2 ${categoryModalStyles.accent}`}>{modalProduct.name}</h3>
            <div className="text-lg text-eco-green dark:text-eco-yellow font-bold mb-2">£{modalProduct.price.toFixed(2)}</div>
            <div className="flex gap-2 mb-2 flex-wrap">
              {modalProduct.tags.map((tag) => (
                <span key={tag} className="bg-eco-green/10 text-eco-green px-2 py-1 rounded-full text-xs dark:bg-eco-yellow/20 dark:text-eco-yellow">{tag}</span>
              ))}
            </div>
            <div className="flex items-center gap-2 mb-2">
              {getStars(modalProduct.rating)}
              <span className="text-gray-400 text-xs">({modalProduct.rating})</span>
            </div>
            <p className="text-gray-600 dark:text-eco-yellow/80 mb-4">{modalProduct.description}</p>
            <button onClick={() => handleAddToCart(modalProduct)} className="w-full bg-eco-green text-white py-3 rounded-lg font-bold hover:bg-eco-yellow hover:text-eco-green dark:bg-eco-yellow dark:text-gray-900 dark:hover:bg-eco-green dark:hover:text-white transition flex items-center justify-center gap-2"><FaShoppingCart /> Add to Cart</button>
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
    </div>
    </>
  );
};

export default Shop; 
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaMoon, FaSun, FaRecycle, FaLeaf, FaChartLine, FaTrophy, FaUserCircle, FaShoppingBasket } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import GoodbyeModal from './GoodbyeModal';
import { ShoppingCart, User, Menu, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Navbar: React.FC = () => {
  const [showGoodbye, setShowGoodbye] = React.useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = !!user;
  const { darkMode, toggleDarkMode } = useTheme();

  // Hide Navbar on admin routes, but NOT on /admin-login
  if (location.pathname.startsWith('/admin') && location.pathname !== '/admin-login') {
    return null;
  }

  // Hide Navbar on replica social media pages
  if (["/instagram", "/facebook", "/twitter"].includes(location.pathname)) {
    return null;
  }

  const handleSignOut = async () => {
    try {
      setShowGoodbye(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      await logout();
      // Clear any remaining state
      localStorage.removeItem('cart');
      sessionStorage.clear();
      // Force a hard reload to clear any remaining state
      window.location.href = '/login';
    } catch (error) {
      console.error('Error signing out:', error);
      setShowGoodbye(false);
      alert('Failed to log out. Please try again.');
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <header className="fixed w-full z-50 bg-eco-green/90 dark:bg-gray-900 backdrop-blur-md border-b border-white/10 dark:border-gray-700 shadow-lg transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-2">
          {/* Logo Centered on Mobile, Left on Desktop */}
          <div className="flex-1 flex items-center justify-center lg:justify-start">
            <Link to="/" className="text-2xl font-bold font-playfair text-white dark:text-eco-yellow tracking-tight drop-shadow">Eco Waste Hub</Link>
          </div>
          {/* Nav Links Centered, Single Row, Even Spacing */}
          <nav className="hidden lg:flex flex-1 justify-center items-center gap-x-10 whitespace-nowrap text-lg font-semibold">
            <Link
              to="/"
              className={`text-white dark:text-eco-yellow drop-shadow hover:text-eco-yellow dark:hover:text-white transition ${isActive('/') ? '' : ''}`}
            >
              Home
            </Link>
            <Link
              to="/how-it-works"
              className={`text-white dark:text-eco-yellow drop-shadow hover:text-eco-yellow dark:hover:text-white transition ${isActive('/how-it-works') ? '' : ''}`}
            >
              How It Works
            </Link>
            <Link
              to="/shop"
              className={`text-white dark:text-eco-yellow drop-shadow hover:text-eco-yellow dark:hover:text-white transition ${isActive('/shop') ? '' : ''}`}
            >
              Shop
            </Link>
            <Link
              to="/food-deals"
              className={`text-white dark:text-eco-yellow drop-shadow hover:text-eco-yellow dark:hover:text-white transition ${isActive('/food-deals') ? '' : ''}`}
            >
              Food Deals
            </Link>
            <Link
              to="/contact"
              className={`text-white dark:text-eco-yellow drop-shadow hover:text-eco-yellow dark:hover:text-white transition ${isActive('/contact') ? '' : ''}`}
            >
              Contact
            </Link>
          </nav>
          {/* CTA Buttons Right */}
          <div className="flex-1 flex items-center justify-end space-x-3">
            {/* User Icon for Account/Profile */}
            {isLoggedIn && (
              <span className="inline-flex items-center">
                <Link to="/account" aria-label="Account" className="text-white dark:text-eco-yellow text-2xl hover:text-eco-yellow dark:hover:text-white transition p-1 rounded-full">
                  <FaUserCircle />
                </Link>
              </span>
            )}
            {/* Wishlist Icon */}
            {isLoggedIn && (
              <span className="inline-flex items-center ml-2">
                <Link to="/wishlist" aria-label="Wishlist" className="text-white dark:text-eco-yellow text-2xl hover:text-eco-yellow dark:hover:text-white transition p-1 rounded-full">
                  <FaShoppingBasket />
                </Link>
              </span>
            )}
            {!isLoggedIn ? (
              <>
                <Link
                  to="/login"
                  className={`px-4 py-2 rounded-full text-white dark:text-eco-yellow font-semibold hover:bg-white/10 dark:hover:bg-gray-800 transition ${isActive('/login') ? '' : ''}`}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 rounded-full bg-eco-yellow text-eco-green font-bold shadow hover:bg-yellow-300 transition"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <Link
                to="/dashboard"
                className={`text-white dark:text-eco-yellow drop-shadow hover:text-eco-yellow dark:hover:text-white transition ${isActive('/dashboard') ? '' : ''}`}
              >
                Dashboard
              </Link>
            )}
            <Link to="/donate" className="px-5 py-2 rounded-full bg-white/20 dark:bg-gray-800 border border-eco-yellow text-eco-yellow font-bold shadow hover:bg-eco-yellow hover:text-eco-green dark:hover:bg-eco-yellow dark:hover:text-eco-green transition">Donate</Link>
            <button
              aria-label="Toggle theme"
              onClick={toggleDarkMode}
              className="ml-4 p-2 rounded-full bg-white/10 dark:bg-gray-800 hover:bg-white/20 dark:hover:bg-gray-700 text-white dark:text-eco-yellow text-xl transition border border-eco-yellow"
            >
              {darkMode ? <FaSun /> : <FaMoon />}
            </button>
          </div>
        </div>
      </header>
      <GoodbyeModal isOpen={showGoodbye} userEmail={user?.email || ''} />
    </>
  );
};

export default Navbar; 
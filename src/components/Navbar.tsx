import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { FaMoon, FaSun, FaRecycle, FaLeaf, FaChartLine, FaTrophy, FaUserCircle } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import GoodbyeModal from './GoodbyeModal';

const Navbar = ({ darkMode, toggleDarkMode }: { darkMode?: boolean; toggleDarkMode?: () => void }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showGoodbye, setShowGoodbye] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = !!user;

  // Hide Navbar on admin and admin-login routes
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  const handleLogout = async () => {
    try {
      setShowGoodbye(true);
      // Wait for the animation to complete before logging out
      setTimeout(async () => {
        await logout();
        navigate('/login', { replace: true });
      }, 2000);
    } catch (error) {
      console.error('Error during logout:', error);
      setShowGoodbye(false);
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
              className={`text-white dark:text-eco-yellow drop-shadow hover:text-eco-yellow dark:hover:text-white transition ${
                isActive('/') ? '' : ''
              }`}
            >
              Home
            </Link>
            <Link
              to="/how-it-works"
              className={`text-white dark:text-eco-yellow drop-shadow hover:text-eco-yellow dark:hover:text-white transition ${
                isActive('/how-it-works') ? '' : ''
              }`}
            >
              How It Works
            </Link>
            <Link
              to="/shop"
              className={`text-white dark:text-eco-yellow drop-shadow hover:text-eco-yellow dark:hover:text-white transition ${
                isActive('/shop') ? '' : ''
              }`}
            >
              Shop
            </Link>
            <Link
              to="/food-deals"
              className={`text-white dark:text-eco-yellow drop-shadow hover:text-eco-yellow dark:hover:text-white transition ${
                isActive('/food-deals') ? '' : ''
              }`}
            >
              Food Deals
            </Link>
            <Link
              to="/contact"
              className={`text-white dark:text-eco-yellow drop-shadow hover:text-eco-yellow dark:hover:text-white transition ${
                isActive('/contact') ? '' : ''
              }`}
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
            {!isLoggedIn ? (
              <>
                <Link
                  to="/login"
                  className={`px-4 py-2 rounded-full text-white dark:text-eco-yellow font-semibold hover:bg-white/10 dark:hover:bg-gray-800 transition ${
                    isActive('/login') ? '' : ''
                  }`}
                >
                  Login
                </Link>
                <Link
                  to="/join-us"
                  className="px-4 py-2 rounded-full bg-eco-yellow text-eco-green font-bold shadow hover:bg-yellow-300 transition"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <Link
                to="/dashboard"
                className={`text-white dark:text-eco-yellow drop-shadow hover:text-eco-yellow dark:hover:text-white transition ${
                  isActive('/dashboard') ? '' : ''
                }`}
              >
                Dashboard
              </Link>
            )}
            <Link to="/donate" className="px-5 py-2 rounded-full bg-white/20 dark:bg-gray-800 border border-eco-yellow text-eco-yellow font-bold shadow hover:bg-eco-yellow hover:text-eco-green dark:hover:bg-eco-yellow dark:hover:text-eco-green transition">Donate</Link>
            <button
              aria-label="Toggle dark mode"
              onClick={toggleDarkMode}
              className="ml-8 p-2 rounded-full bg-white/10 dark:bg-gray-800 hover:bg-white/20 dark:hover:bg-gray-700 text-white dark:text-eco-yellow text-xl transition border border-eco-yellow"
            >
              {darkMode ? <FaSun /> : <FaMoon />}
            </button>
            <button className="lg:hidden text-3xl text-white ml-2" onClick={() => setMenuOpen(!menuOpen)}>
              ☰
            </button>
          </div>
        </div>
        {/* Mobile menu */}
        {menuOpen && (
          <nav className="lg:hidden bg-eco-green dark:bg-gray-900 text-white dark:text-eco-yellow font-semibold text-lg px-4 py-4 rounded-b-xl shadow space-y-2 animate-fade-in">
            <Link
              to="/"
              className={`block py-2 px-2 rounded hover:text-eco-yellow dark:hover:text-white ${
                isActive('/') ? '' : ''
              }`}
            >
              Home
            </Link>
            <Link
              to="/how-it-works"
              className={`block py-2 px-2 rounded hover:text-eco-yellow dark:hover:text-white ${
                isActive('/how-it-works') ? '' : ''
              }`}
            >
              How It Works
            </Link>
            <Link
              to="/shop"
              className={`block py-2 px-2 rounded hover:text-eco-yellow dark:hover:text-white ${
                isActive('/shop') ? '' : ''
              }`}
            >
              Shop
            </Link>
            <Link
              to="/food-deals"
              className={`block py-2 px-2 rounded hover:text-eco-yellow dark:hover:text-white ${
                isActive('/food-deals') ? '' : ''
              }`}
            >
              Food Deals
            </Link>
            <Link
              to="/contact"
              className={`block py-2 px-2 rounded hover:text-eco-yellow dark:hover:text-white ${
                isActive('/contact') ? '' : ''
              }`}
            >
              Contact
            </Link>
            <div className="pt-2 border-t border-white/10 dark:border-gray-700 mt-2 space-y-2">
              {!isLoggedIn ? (
                <>
                  <Link
                    to="/login"
                    className={`block py-2 px-2 rounded hover:bg-white/10 dark:hover:bg-gray-800 transition ${
                      isActive('/login') ? '' : ''
                    }`}
                  >
                    Login
                  </Link>
                  <Link
                    to="/join-us"
                    className="block py-2 px-2 rounded-full bg-eco-yellow text-eco-green font-bold text-center hover:bg-yellow-300 transition"
                  >
                    Sign Up
                  </Link>
                </>
              ) : (
                <Link
                  to="/dashboard"
                  className={`block py-2 px-2 rounded hover:bg-white/10 dark:hover:bg-gray-800 transition ${
                    isActive('/dashboard') ? '' : ''
                  }`}
                >
                  Dashboard
                </Link>
              )}
              <Link to="/donate" className="block py-2 px-2 rounded-full bg-white/20 dark:bg-gray-800 border border-eco-yellow text-eco-yellow font-bold text-center hover:bg-eco-yellow hover:text-eco-green dark:hover:bg-eco-yellow dark:hover:text-eco-green transition">Donate</Link>
            </div>
          </nav>
        )}
      </header>
      <GoodbyeModal isOpen={showGoodbye} userEmail={user?.email || ''} />
    </>
  );
};

export default Navbar; 
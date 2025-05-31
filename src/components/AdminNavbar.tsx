import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaMoon, FaSun, FaUserShield, FaUsers, FaShoppingBag, FaHandHoldingHeart, FaCog, FaChartLine } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import GoodbyeModal from './GoodbyeModal';
import { useTheme } from '../context/ThemeContext';

const navLinks = [
  { to: '/admin', label: 'Dashboard', icon: null },
  { to: '/admin/orders', label: 'Orders', icon: <FaShoppingBag className="inline mr-1" /> },
  { to: '/admin/donations', label: 'Donations', icon: <FaHandHoldingHeart className="inline mr-1" /> },
  { to: '/admin/users', label: 'Users', icon: <FaUsers className="inline mr-1" /> },
  { to: '/admin/ad-revenue', label: 'AD Revenue', icon: <FaChartLine className="inline mr-1" /> },
];

const AdminNavbar: React.FC = () => {
  const [showGoodbye, setShowGoodbye] = React.useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { darkMode, toggleDarkMode } = useTheme();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    try {
      setShowGoodbye(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      await logout();
      navigate('/admin-login', { replace: true });
    } catch (error) {
      console.error('Error logging out:', error);
      setShowGoodbye(false);
      alert('Failed to log out. Please try again.');
    }
  };

  return (
    <>
      <header
        className={`fixed w-full z-50 shadow-lg transition-colors
          ${darkMode ? 'bg-gray-950 border-b border-gray-800' : 'bg-eco-green/95 border-b border-eco-green/30'}
          backdrop-blur-md
        `}
        style={{ minHeight: 72 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex-1 flex items-center justify-start">
              <Link
                to="/admin"
                className={`text-2xl font-bold font-playfair tracking-tight drop-shadow flex items-center gap-2
                  ${darkMode ? 'text-eco-yellow' : 'text-white'}
                `}
                style={{ letterSpacing: '0.01em' }}
              >
                <FaUserShield className={darkMode ? 'text-eco-yellow' : 'text-white'} /> Admin Panel
              </Link>
            </div>
            {/* Admin Nav Links */}
            <nav className="flex flex-1 justify-center items-center gap-x-6 whitespace-nowrap text-lg">
              {navLinks.map(link => {
                const active = isActive(link.to);
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={
                      "relative px-4 py-2 transition-all font-medium flex items-center " +
                      (active
                        ? (darkMode
                            ? "font-bold text-gray-900 bg-eco-yellow rounded-full shadow-md"
                            : "font-bold text-eco-green bg-white rounded-full shadow-md")
                        : (darkMode
                            ? "text-eco-yellow hover:bg-eco-yellow/10 hover:text-eco-yellow"
                            : "text-white hover:bg-eco-yellow/10 hover:text-eco-yellow"))
                    }
                    style={{ minWidth: 44, minHeight: 44, justifyContent: "center" }}
                  >
                    {link.icon} {link.label}
                    {active && (
                      <span
                        className={
                          "absolute -bottom-1 left-1/2 -translate-x-1/2 w-2/3 h-1 rounded-full " +
                          (darkMode ? "bg-eco-yellow/80" : "bg-eco-green/80")
                        }
                      ></span>
                    )}
                  </Link>
                );
              })}
            </nav>
            {/* Right side buttons */}
            <div className="flex items-center gap-3 ml-4">
              <button
                onClick={toggleDarkMode}
                className={`w-11 h-11 flex items-center justify-center rounded-full border transition
                  ${darkMode
                    ? 'bg-gray-900 border-eco-yellow text-eco-yellow hover:bg-eco-yellow/10'
                    : 'bg-white border-eco-green text-eco-green hover:bg-eco-green/10'}
                  shadow-sm focus:outline-none focus:ring-2 focus:ring-eco-yellow/40 dark:focus:ring-eco-yellow/40
                `}
                aria-label="Toggle theme"
              >
                {darkMode ? <FaSun /> : <FaMoon />}
              </button>
              <Link
                to="/admin/settings"
                className={`w-11 h-11 flex items-center justify-center rounded-full border transition
                  ${darkMode
                    ? 'bg-gray-900 border-eco-yellow text-eco-yellow hover:bg-eco-yellow/10'
                    : 'bg-white border-eco-green text-eco-green hover:bg-eco-green/10'}
                  shadow-sm focus:outline-none focus:ring-2 focus:ring-eco-yellow/40 dark:focus:ring-eco-yellow/40
                `}
                aria-label="Settings"
              >
                <FaCog />
              </Link>
              <button
                onClick={handleLogout}
                className={`ml-2 px-5 py-2 rounded-full font-semibold border-2 transition shadow-sm
                  ${darkMode
                    ? 'bg-eco-yellow text-gray-900 border-eco-yellow hover:bg-yellow-300'
                    : 'bg-white text-eco-green border-eco-green hover:bg-eco-green/10'}
                `}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>
      <GoodbyeModal isOpen={showGoodbye} userEmail={user?.email || ''} />
    </>
  );
};

export default AdminNavbar; 
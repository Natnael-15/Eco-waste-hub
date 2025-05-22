import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import HowItWorks from './pages/HowItWorks';
import Donate from './pages/Donate';
import FoodDeals from './pages/FoodDeals';
import Contact from './pages/Contact';
import JoinUs from './pages/JoinUs';
import Login from './pages/Login';
import BecomePartner from './pages/BecomePartner';
import SignUp from './pages/SignUp';
import Checkout from './pages/Checkout';
import About from './pages/About';
import FAQ from './pages/FAQ';
import Terms from './pages/Terms';
import Policy from './pages/Policy';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import Account from './pages/Account';
import AdminLogin from './pages/AdminLogin';
import AdminOrders from './pages/AdminOrders';
import AdminDonations from './pages/AdminDonations';
import InstagramPage from './pages/InstagramPage';
import TwitterPage from './pages/TwitterPage';
import FacebookPage from './pages/FacebookPage';
import GameArcade from './pages/GameArcade';
import AdminUsers from './pages/AdminUsers';
import AdminSettings from './pages/AdminSettings';
import AdminAdRevenue from './pages/AdminAdRevenue';
import './App.css';
import { supabase } from './lib/supabase';

const BackButton: React.FC = () => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(-1)}
      className="fixed top-4 left-4 z-50 bg-eco-green text-white dark:bg-eco-yellow dark:text-gray-900 rounded-full shadow-lg px-4 py-2 text-lg font-bold hover:bg-eco-yellow hover:text-eco-green dark:hover:bg-eco-green dark:hover:text-white transition border-2 border-white dark:border-gray-900"
      aria-label="Go back"
    >
      ← Back
    </button>
  );
};

const AppRoutes: React.FC<{ darkMode: boolean, toggleDarkMode: () => void }> = ({ darkMode, toggleDarkMode }) => {
  const location = useLocation();
  const hideNavAndFooter = location.pathname === '/login' || location.pathname === '/signup';
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isGameArcade = location.pathname === '/game-arcade';
  return (
    <div className="flex flex-col min-h-screen">
      {!hideNavAndFooter && !isGameArcade && <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />}
      {isGameArcade && <BackButton />}
      <main className="flex-grow">
        {isAdminRoute ? (
          <Routes>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/donations" element={<AdminDonations />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            <Route path="/admin/ad-revenue" element={<AdminAdRevenue />} />
          </Routes>
        ) : (
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/donate" element={<Donate />} />
            <Route path="/food-deals" element={<FoodDeals />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/join-us" element={<JoinUs />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/about" element={<About />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/policy" element={<Policy />} />
            <Route path="/become-partner" element={<BecomePartner />} />
            <Route path="/instagram" element={<InstagramPage />} />
            <Route path="/twitter" element={<TwitterPage />} />
            <Route path="/facebook" element={<FacebookPage />} />
            <Route path="/game-arcade" element={<GameArcade />} />
            <Route path="/dashboard" element={<UserDashboard darkMode={darkMode} toggleDarkMode={toggleDarkMode} />} />
            <Route path="/account" element={<Account darkMode={darkMode} toggleDarkMode={toggleDarkMode} />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="*" element={
              <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-green-900 mb-4">404</h1>
                  <p className="text-xl text-gray-600 mb-6">Page not found</p>
                  <a href="/" className="text-green-600 hover:text-green-700 underline">
                    Return to Home
                  </a>
                </div>
              </div>
            } />
          </Routes>
        )}
      </main>
      {!(location.pathname.startsWith('/admin')) && !hideNavAndFooter && !isGameArcade && <Footer darkMode={darkMode} />}
    </div>
  );
};

const AppContent: React.FC = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  return (
    <>
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <AppRoutes darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <Footer darkMode={darkMode} />
    </>
  );
};

const App: React.FC = () => {
  const [darkMode, setDarkMode] = React.useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved === 'dark' || saved === 'light') return saved === 'dark';
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) return true;
    }
    return false;
  });

  React.useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Listen for system theme changes
  React.useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (!localStorage.getItem('theme')) {
        setDarkMode(media.matches);
      }
    };
    media.addEventListener('change', handleChange);
    return () => media.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    supabase
      .from('products')
      .select('*')
      .then(res => {
        console.log('Test Supabase query result:', res);
      })
      .catch(err => {
        console.error('Test Supabase query error:', err);
      });
  }, []);

  const toggleDarkMode = () => setDarkMode(dm => !dm);

  return (
    <ThemeProvider>
      <Router>
        <AuthProvider>
          <CartProvider>
            <AppContent />
          </CartProvider>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
};

export default App; 
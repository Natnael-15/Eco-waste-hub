import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
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
import LearnMore from './pages/LearnMore';
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
import './App.css';
import { supabase } from './services/supabase';

const AppRoutes: React.FC<{ darkMode: boolean, toggleDarkMode: () => void }> = ({ darkMode, toggleDarkMode }) => {
  const location = useLocation();
  return (
    <div className={`flex flex-col min-h-screen ${darkMode ? 'dark' : ''}`}>
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="/food-deals" element={<FoodDeals />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/join-us" element={<JoinUs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/learn-more" element={<LearnMore />} />
          <Route path="/become-partner" element={<BecomePartner />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/policy" element={<Policy />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/account" element={<Account />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/donations" element={<AdminDonations />} />
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
      </main>
      {!(location.pathname.startsWith('/admin')) && <Footer />}
    </div>
  );
};

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(() => {
    // Try to load from localStorage
    return localStorage.getItem('darkMode') === 'true';
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

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
    <Router>
      <AuthProvider>
        <CartProvider>
          <AppRoutes darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
};

export default App; 
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { FaLeaf, FaBuilding, FaEnvelope, FaPhone, FaMapMarkerAlt, FaRegEdit, FaHandshake } from 'react-icons/fa';

const PARTNERS_JOINED = 128; // Example stat

const BecomePartner: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    businessName: '',
    businessType: '',
    email: '',
    phone: '',
    address: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  // Autofill function for demo/testing
  const autofill = () => {
    const businessNames = [
      'GreenLeaf Cafe',
      'Eco Eats Bakery',
      'Fresh Market Grocery',
      'Sunrise Restaurant',
      "Nature's Table"
    ];
    const types = ['restaurant', 'cafe', 'grocery', 'bakery', 'other'];
    const emails = ['info@greenleaf.com', 'hello@ecoeats.com', 'contact@freshmarket.com', 'team@sunrise.com', 'support@natures.com'];
    const phones = ['020 1234 5678', '012 3456 7890', '07700 900123', '0161 234 5678', '07911 123456'];
    const addresses = [
      '12 Green Lane, London',
      '45 Eco Street, Manchester',
      '88 Market Road, Bristol',
      '23 Sunrise Ave, Birmingham',
      '7 Nature Close, Leeds'
    ];
    const descriptions = [
      'A sustainable cafe serving plant-based meals.',
      'Bakery focused on zero-waste and organic ingredients.',
      'Local grocery store supporting food rescue.',
      'Family restaurant with a passion for eco-friendly practices.',
      'Community table for healthy, sustainable food.'
    ];
    const i = Math.floor(Math.random() * 5);
    setFormData({
      businessName: businessNames[i],
      businessType: types[i],
      email: emails[i],
      phone: phones[i],
      address: addresses[i],
      description: descriptions[i],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    if (!user) {
      setRedirecting(true);
      setTimeout(() => navigate('/sign-up'), 1200);
      setLoading(false);
      return;
    }
    try {
      // TODO: Implement partner registration logic
      console.log('Partner registration:', formData);
      setSubmitted(true);
      setTimeout(() => navigate('/'), 2500);
    } catch (err) {
      setError('Failed to register as partner. Please try again.');
      console.error('Partner registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-eco-green/10 via-eco-yellow/10 to-white dark:from-gray-900 dark:via-eco-green/80 dark:to-gray-900 flex flex-col items-center justify-center py-16 px-4 relative overflow-hidden">
        {/* Floating Leaf/Globe Icon */}
        <motion.div
          initial={{ y: -40, opacity: 0, rotate: 0 }}
          animate={{ y: 0, opacity: 1, rotate: [0, 10, -10, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'easeInOut',
            type: 'tween'
          }}
          className="absolute left-8 top-8 z-10 text-eco-green dark:text-eco-yellow opacity-60"
        >
          <FaLeaf size={64} className="drop-shadow-xl animate-spin-slow" />
        </motion.div>
        {/* Glass Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="w-full max-w-2xl bg-white/80 dark:bg-gray-900/80 rounded-3xl shadow-2xl p-10 border border-eco-green/20 dark:border-eco-yellow/20 backdrop-blur-xl relative z-20"
        >
          <div className="flex flex-col items-center mb-8">
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="bg-eco-green/10 dark:bg-eco-yellow/10 rounded-full p-4 mb-3 shadow"
            >
              <FaHandshake className="text-eco-green dark:text-eco-yellow text-4xl" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl sm:text-4xl font-extrabold text-eco-green dark:text-eco-yellow mb-2 text-center"
            >
          Become a Partner
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-gray-700 dark:text-gray-200 text-center max-w-xl"
            >
              Join our network of eco-conscious businesses and help reduce waste while growing your business. We&apos;re looking for partners who share our vision of a sustainable future.
            </motion.p>
          </div>
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-semibold text-eco-green dark:text-eco-yellow">Partners Joined</span>
              <span className="text-xs text-gray-500 dark:text-gray-300">{PARTNERS_JOINED}+</span>
            </div>
            <div className="w-full bg-eco-green/10 dark:bg-eco-yellow/10 rounded-full h-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(PARTNERS_JOINED, 200) / 2}%` }}
                transition={{ duration: 1.2, delay: 0.2 }}
                className="bg-eco-green dark:bg-eco-yellow h-3 rounded-full shadow"
              />
            </div>
          </div>
          {/* Autofill Button */}
          <div className="flex justify-end mb-2">
            <button
              type="button"
              onClick={autofill}
              className="px-3 py-1 text-xs rounded-full bg-eco-green/10 dark:bg-eco-yellow/10 text-eco-green dark:text-eco-yellow font-semibold hover:bg-eco-green/20 dark:hover:bg-eco-yellow/20 transition border border-eco-green/20 dark:border-eco-yellow/20 shadow"
            >
              Autofill Example
            </button>
          </div>
          {/* Form or Confirmation */}
          <AnimatePresence>
            {!user ? (
              <motion.div
                key="login-cta"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col items-center justify-center py-12"
              >
                <FaHandshake className="text-eco-green dark:text-eco-yellow text-5xl mb-4 animate-bounce" />
                <h2 className="text-2xl font-bold text-eco-green dark:text-eco-yellow mb-2">Sign up or log in to continue</h2>
                <p className="text-gray-700 dark:text-gray-200 text-center mb-4">You need an account to become a partner and access this form.</p>
                <div className="flex gap-4">
                  <button
                    onClick={() => navigate('/sign-up')}
                    className="px-5 py-2 rounded-full bg-eco-green text-white font-bold shadow hover:bg-eco-yellow hover:text-eco-green dark:bg-eco-yellow dark:text-eco-green dark:hover:bg-eco-green dark:hover:text-eco-yellow transition"
                  >
                    Sign Up
                  </button>
                  <button
                    onClick={() => navigate('/login')}
                    className="px-5 py-2 rounded-full bg-white text-eco-green font-bold shadow border border-eco-green hover:bg-eco-green hover:text-white dark:bg-gray-900 dark:text-eco-yellow dark:border-eco-yellow dark:hover:bg-eco-yellow dark:hover:text-eco-green transition"
                  >
                    Log In
                  </button>
                </div>
              </motion.div>
            ) : redirecting ? (
              <motion.div
                key="redirecting"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col items-center justify-center py-12"
              >
                <FaHandshake className="text-eco-green dark:text-eco-yellow text-5xl mb-4 animate-bounce" />
                <h2 className="text-2xl font-bold text-eco-green dark:text-eco-yellow mb-2">Please sign up to continue</h2>
                <p className="text-gray-700 dark:text-gray-200 text-center mb-2">You need an account to become a partner.<br />Redirecting to sign up...</p>
              </motion.div>
            ) : submitted ? (
              <motion.div
                key="confirmation"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col items-center justify-center py-12"
              >
                <FaHandshake className="text-eco-green dark:text-eco-yellow text-5xl mb-4 animate-bounce" />
                <h2 className="text-2xl font-bold text-eco-green dark:text-eco-yellow mb-2">Thank you for applying!</h2>
                <p className="text-gray-700 dark:text-gray-200 text-center mb-2">We appreciate your interest in partnering with Eco Waste Hub.<br />Our team will be in contact with you soon.</p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                {/* Business Name */}
                <div className="relative">
                  <FaBuilding className="absolute left-3 top-1/2 -translate-y-1/2 text-eco-green dark:text-eco-yellow text-lg" />
              <input
                type="text"
                id="businessName"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                required
                    className="peer w-full pl-10 p-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-eco-green focus:ring-2 focus:ring-eco-green/20 transition placeholder-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-eco-yellow"
                    placeholder="Business Name"
              />
                  <label htmlFor="businessName" className="absolute left-10 top-3 text-gray-500 dark:text-eco-yellow pointer-events-none transition-all duration-200 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:-top-4 peer-focus:text-xs peer-focus:text-eco-green bg-white dark:bg-gray-800 px-1">Business Name</label>
            </div>
                {/* Business Type */}
                <div className="relative">
                  <FaRegEdit className="absolute left-3 top-1/2 -translate-y-1/2 text-eco-green dark:text-eco-yellow text-lg" />
              <select
                id="businessType"
                name="businessType"
                value={formData.businessType}
                onChange={handleChange}
                required
                    className="peer w-full pl-10 p-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-eco-green focus:ring-2 focus:ring-eco-green/20 transition bg-white dark:bg-gray-800 text-gray-900 dark:text-eco-yellow"
              >
                    <option value="" disabled>Select a type</option>
                <option value="restaurant">Restaurant</option>
                <option value="cafe">Café</option>
                <option value="grocery">Grocery Store</option>
                <option value="bakery">Bakery</option>
                <option value="other">Other</option>
              </select>
                  <label htmlFor="businessType" className="absolute left-10 top-3 text-gray-500 dark:text-eco-yellow pointer-events-none transition-all duration-200 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-eco-green bg-white dark:bg-gray-800 px-1">Business Type</label>
            </div>
                {/* Email */}
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-eco-green dark:text-eco-yellow text-lg" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                    className="peer w-full pl-10 p-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-eco-green focus:ring-2 focus:ring-eco-green/20 transition placeholder-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-eco-yellow"
                    placeholder="Email"
              />
                  <label htmlFor="email" className="absolute left-10 top-3 text-gray-500 dark:text-eco-yellow pointer-events-none transition-all duration-200 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:-top-4 peer-focus:text-xs peer-focus:text-eco-green bg-white dark:bg-gray-800 px-1">Email</label>
            </div>
                {/* Phone */}
                <div className="relative">
                  <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-eco-green dark:text-eco-yellow text-lg" />
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                    className="peer w-full pl-10 p-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-eco-green focus:ring-2 focus:ring-eco-green/20 transition placeholder-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-eco-yellow"
                    placeholder="Phone Number"
              />
                  <label htmlFor="phone" className="absolute left-10 top-3 text-gray-500 dark:text-eco-yellow pointer-events-none transition-all duration-200 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:-top-4 peer-focus:text-xs peer-focus:text-eco-green bg-white dark:bg-gray-800 px-1">Phone Number</label>
            </div>
                {/* Address */}
                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-eco-green dark:text-eco-yellow text-lg" />
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                    className="peer w-full pl-10 p-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-eco-green focus:ring-2 focus:ring-eco-green/20 transition placeholder-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-eco-yellow"
                    placeholder="Business Address"
              />
                  <label htmlFor="address" className="absolute left-10 top-3 text-gray-500 dark:text-eco-yellow pointer-events-none transition-all duration-200 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:-top-4 peer-focus:text-xs peer-focus:text-eco-green bg-white dark:bg-gray-800 px-1">Business Address</label>
            </div>
                {/* Description */}
                <div className="relative">
                  <FaRegEdit className="absolute left-3 top-4 text-eco-green dark:text-eco-yellow text-lg" />
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                required
                    className="peer w-full pl-10 p-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-eco-green focus:ring-2 focus:ring-eco-green/20 transition placeholder-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-eco-yellow resize-none"
                    placeholder="Business Description"
              />
                  <label htmlFor="description" className="absolute left-10 top-3 text-gray-500 dark:text-eco-yellow pointer-events-none transition-all duration-200 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:-top-4 peer-focus:text-xs peer-focus:text-eco-green bg-white dark:bg-gray-800 px-1">Business Description</label>
            </div>
            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}
            <button
              type="submit"
              disabled={loading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-base font-bold text-white bg-eco-green hover:bg-eco-yellow hover:text-eco-green dark:bg-eco-yellow dark:text-eco-green dark:hover:bg-eco-green dark:hover:text-eco-yellow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-eco-green dark:focus:ring-eco-yellow disabled:opacity-50 transition"
            >
              {loading ? 'Submitting...' : 'Submit Application'}
            </button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </>
  );
};

export default BecomePartner; 
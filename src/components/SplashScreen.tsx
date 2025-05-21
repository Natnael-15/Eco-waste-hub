import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaLeaf, FaGlobeAmericas, FaHandHoldingHeart } from 'react-icons/fa';

const SplashScreen = ({ onFinish }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 6000);
    return () => clearTimeout(timer);
  }, []);

  // Call onFinish after exit animation
  useEffect(() => {
    if (!visible) {
      const exitTimer = setTimeout(onFinish, 600); // match exit duration
      return () => clearTimeout(exitTimer);
    }
  }, [visible, onFinish]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-eco-green via-eco-yellow to-white dark:from-gray-900 dark:via-eco-green/80 dark:to-gray-900"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            initial={{ scale: 0.7, rotate: -20 }}
            animate={{ scale: 1.1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 120, damping: 10 }}
            className="mb-6"
          >
            <div className="relative w-24 h-24 flex items-center justify-center">
              <FaGlobeAmericas className="absolute text-eco-green dark:text-eco-yellow text-6xl animate-spin-slow" style={{ animationDuration: '2.5s' }} />
              <FaLeaf className="absolute text-eco-yellow dark:text-eco-green text-4xl animate-float-slow" style={{ left: 0, top: 0 }} />
              <FaHandHoldingHeart className="absolute text-eco-green dark:text-eco-yellow text-3xl animate-float-medium" style={{ right: 0, bottom: 0 }} />
            </div>
          </motion.div>
          <motion.h1
            className="text-4xl font-bold text-eco-green dark:text-eco-yellow mb-2 font-playfair"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Welcome to Eco Waste Hub
          </motion.h1>
          <motion.p
            className="text-lg text-eco-green dark:text-eco-yellow/80"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            Let's reduce food waste together!
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen; 
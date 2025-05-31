import React from 'react';
import { motion } from 'framer-motion';
// You can use a confetti package or a simple animated SVG for confetti

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
  isNewUser?: boolean;
  displayName?: string;
}

const Confetti = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="absolute inset-0 pointer-events-none z-0"
  >
    {/* Simple confetti SVG or animated eco icons */}
    <svg width="100%" height="100%" viewBox="0 0 400 200" className="w-full h-full">
      <g>
        <circle cx="50" cy="40" r="8" fill="#E3B505" />
        <circle cx="120" cy="80" r="6" fill="#1A3C34" />
        <circle cx="200" cy="30" r="10" fill="#4ADE80" />
        <circle cx="300" cy="100" r="7" fill="#FBBF24" />
        <circle cx="350" cy="60" r="5" fill="#22D3EE" />
        <circle cx="80" cy="150" r="7" fill="#A3E635" />
        <circle cx="250" cy="170" r="6" fill="#F472B6" />
        {/* Add more for effect */}
      </g>
    </svg>
  </motion.div>
);

const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, onClose, userEmail, isNewUser, displayName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full mx-4 overflow-hidden"
      >
        <Confetti />
        <h2 className="text-3xl font-extrabold text-eco-green dark:text-eco-yellow mb-4 text-center">
          {isNewUser ? `Welcome to Eco Waste Hub, ${displayName || userEmail || 'Eco Hero'}!` : `Welcome back, ${displayName || userEmail || 'Eco Hero'}!`}
        </h2>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center gap-4 mb-6"
        >
          <span className="text-6xl animate-bounce">🌱</span>
          <span className="text-4xl animate-spin-slow">♻️</span>
        </motion.div>
        <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">
          {isNewUser
            ? "We're excited to have you join our community of eco-conscious individuals. Together, we can make a difference!"
            : "Great to see you again! Keep up the great work in making our planet greener."}
        </p>
        <button
          onClick={onClose}
          className="mt-6 w-full bg-eco-green text-white py-2 px-4 rounded-md hover:bg-eco-yellow hover:text-eco-green focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-eco-green text-lg font-bold transition"
        >
          {isNewUser ? 'Start Exploring' : 'Continue'}
        </button>
      </motion.div>
    </div>
  );
};

export default WelcomeModal; 
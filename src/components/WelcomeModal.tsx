import React from 'react';
import { motion } from 'framer-motion';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, onClose, userEmail }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full mx-4"
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Welcome to Eco Waste Hub!
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          We&apos;re excited to have you join our community of eco-conscious individuals.
          Together, we can make a difference in reducing waste and promoting sustainability.
        </p>
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg
                className="h-6 w-6 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <p className="ml-3 text-gray-600 dark:text-gray-300">
              Browse our selection of eco-friendly products
            </p>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg
                className="h-6 w-6 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <p className="ml-3 text-gray-600 dark:text-gray-300">
              Find great deals on surplus food items
            </p>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg
                className="h-6 w-6 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <p className="ml-3 text-gray-600 dark:text-gray-300">
              Track your environmental impact
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="mt-6 w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Get Started
        </button>
      </motion.div>
    </div>
  );
};

export default WelcomeModal; 
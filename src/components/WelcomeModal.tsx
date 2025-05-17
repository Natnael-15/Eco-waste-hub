import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface WelcomeModalProps {
  isOpen: boolean;
  userEmail: string;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, userEmail }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.8 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          />
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl max-w-sm w-full mx-4 relative overflow-hidden"
            initial={{ rotate: 5 }}
            animate={{ rotate: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="absolute -top-10 -right-10 w-40 h-40 bg-eco-yellow/20 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.div
              className="absolute -bottom-10 -left-10 w-40 h-40 bg-eco-green/20 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            />
            <div className="relative z-10 text-center">
              <motion.h2
                className="text-3xl font-bold text-eco-green dark:text-eco-yellow mb-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Welcome Back!
              </motion.h2>
              <motion.p
                className="text-gray-600 dark:text-gray-300 mb-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Great to see you again, {userEmail?.split('@')[0]}! Let's continue making the world a better place together.
              </motion.p>
              <motion.div
                className="flex justify-center"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className="w-16 h-16 bg-eco-yellow/20 rounded-full flex items-center justify-center">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, 10, -10, 0]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    🌱
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WelcomeModal; 
import React from 'react';
import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  subtitle?: string;
  progress?: {
    current: number;
    total: number;
  };
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, subtitle, progress }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 dark:text-gray-400">{title}</p>
          <h3 className="text-2xl font-bold text-eco-green dark:text-eco-yellow">{value}</h3>
        </div>
        {icon}
      </div>
      {progress && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-eco-green dark:bg-eco-yellow h-2 rounded-full"
              style={{ width: `${(progress.current / progress.total) * 100}%` }}
            />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            {progress.total - progress.current} points to next milestone
          </p>
        </div>
      )}
      {subtitle && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
};

export default StatCard; 
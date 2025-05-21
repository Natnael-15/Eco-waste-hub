import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';

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

const AnimatedCounter: React.FC<{ end: number | string }> = ({ end }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (typeof end === 'number') {
      let start = 0;
      const duration = 1200;
      const increment = end / (duration / 16);
      let frame: number;
      const animate = () => {
        start += increment;
        if (start < end) {
          setCount(Math.floor(start));
          frame = requestAnimationFrame(animate);
        } else {
          setCount(end);
        }
      };
      animate();
      return () => cancelAnimationFrame(frame);
    } else {
      setCount(end);
    }
  }, [end]);
  return <span>{typeof end === 'number' ? count.toLocaleString() : end}</span>;
};

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, subtitle, progress }) => {
  const iconControls = useAnimation();
  useEffect(() => {
    iconControls.start({ scale: [1, 1.12, 1], rotate: [0, 8, -8, 0] });
  }, [iconControls]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      whileHover={{ scale: 1.04, boxShadow: '0 8px 32px 0 #eab30833' }}
      className="bg-white/70 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-eco-yellow/20 relative overflow-visible group transition-all duration-300"
    >
      {/* Glow */}
      <div className="absolute -inset-1 rounded-2xl pointer-events-none z-0" style={{ boxShadow: '0 0 32px 0 #eab30822' }} />
      <div className="flex items-center justify-between relative z-10">
        <div>
          <p className="text-gray-500 dark:text-gray-400 font-semibold mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-eco-green dark:text-eco-yellow animate-fade-in">
            <AnimatedCounter end={typeof value === 'string' && !/^[\d,.]+$/.test(value) ? value : Number(value)} />
          </h3>
        </div>
        <motion.div animate={iconControls} transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }} className="ml-2">
          {icon}
        </motion.div>
      </div>
      {progress && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
            <motion.div
              className="bg-eco-green dark:bg-eco-yellow h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(progress.current / progress.total) * 100}%` }}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
            />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            {progress.total - progress.current} points to next milestone
          </p>
        </div>
      )}
      {subtitle && (
        <div className="mt-4">
          <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:underline cursor-help" title={subtitle}>{subtitle}</span>
        </div>
      )}
    </motion.div>
  );
};

export default StatCard; 
import React from 'react';
import { FaUserShield, FaLeaf } from 'react-icons/fa';

const AdminFooter = () => (
  <footer className="fixed bottom-0 left-0 w-full bg-eco-green dark:bg-gray-900 text-white dark:text-eco-yellow py-4 border-t border-eco-yellow/40 dark:border-eco-green/40 z-50 shadow-lg flex items-center justify-between px-8">
    <div className="flex items-center gap-2">
      <FaLeaf className="text-eco-yellow text-xl" />
      <span className="font-playfair font-bold text-lg">Eco Waste Hub Admin</span>
    </div>
    <div className="flex items-center gap-2 text-xs opacity-80">
      <FaUserShield className="text-eco-yellow" />
      <span>Admin Panel &copy; {new Date().getFullYear()}</span>
    </div>
  </footer>
);

export default AdminFooter; 
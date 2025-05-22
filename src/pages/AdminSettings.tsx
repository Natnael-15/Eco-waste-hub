import React, { useState } from 'react';
import { FaCog, FaBell, FaMoon, FaSun } from 'react-icons/fa';
import AdminNavbar from '../components/AdminNavbar';
import AdminFooter from '../components/AdminFooter';
import { useTheme } from '../context/ThemeContext';

const AdminSettings: React.FC = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  const [notifications, setNotifications] = useState(true);

  return (
    <>
      <AdminNavbar />
      <div className="min-h-screen bg-gradient-to-br from-eco-green via-amber-50 to-emerald-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 py-12 px-4 pb-32 pt-24">
        <div className="max-w-3xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border-4 border-eco-green dark:border-eco-yellow p-8">
          <h1 className="text-3xl font-bold text-eco-green dark:text-eco-yellow font-playfair flex items-center gap-2 mb-8">
            <FaCog className="text-eco-green dark:text-eco-yellow" /> Admin Settings
          </h1>
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FaMoon className="text-eco-green dark:text-eco-yellow" />
                <span className="text-lg font-semibold text-gray-800 dark:text-eco-yellow">Dark Mode</span>
              </div>
              <button
                onClick={toggleDarkMode}
                className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors duration-300 ${darkMode ? 'bg-eco-green' : 'bg-gray-300'}`}
              >
                <span
                  className={`h-6 w-6 bg-white rounded-full shadow transform transition-transform duration-300 ${darkMode ? 'translate-x-6' : ''}`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FaBell className="text-eco-green dark:text-eco-yellow" />
                <span className="text-lg font-semibold text-gray-800 dark:text-eco-yellow">Notifications</span>
              </div>
              <button
                onClick={() => setNotifications(n => !n)}
                className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors duration-300 ${notifications ? 'bg-eco-green' : 'bg-gray-300'}`}
              >
                <span
                  className={`h-6 w-6 bg-white rounded-full shadow transform transition-transform duration-300 ${notifications ? 'translate-x-6' : ''}`}
                />
              </button>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-lg font-semibold text-gray-800 dark:text-eco-yellow mb-2">Other Settings</span>
              <button className="px-4 py-2 rounded-lg bg-eco-green dark:bg-eco-yellow text-white dark:text-eco-green font-bold shadow hover:bg-eco-yellow hover:text-eco-green dark:hover:bg-eco-green dark:hover:text-eco-yellow transition w-fit">Reset Data</button>
              <button className="px-4 py-2 rounded-lg bg-red-500 text-white font-bold shadow hover:bg-red-600 transition w-fit">Delete Admin Account</button>
            </div>
          </div>
        </div>
      </div>
      <AdminFooter />
    </>
  );
};

export default AdminSettings; 
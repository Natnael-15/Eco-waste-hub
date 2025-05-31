import React from 'react';
import { Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

interface JoinUsProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const JoinUs: React.FC<JoinUsProps> = ({ darkMode, toggleDarkMode }) => (
  <>
    <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 py-16 px-4 flex flex-col items-center">
      <Navigate to="/signup" replace />
    </div>
  </>
);

export default JoinUs; 
import React from 'react';

const Terms = () => (
  <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-amber-50 to-emerald-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-300 py-16 px-4 flex flex-col items-center">
    <div className="max-w-2xl w-full bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 border-4 border-eco-yellow dark:border-eco-green mb-10">
      <h1 className="text-4xl font-bold font-playfair text-eco-green dark:text-eco-yellow mb-8">Terms of Service</h1>
      <h2 className="text-xl font-bold text-eco-green dark:text-eco-yellow mb-2 mt-6">1. Introduction</h2>
      <p className="mb-4 text-gray-700 dark:text-eco-yellow/80">Welcome to Eco Waste Hub. By using our website, you agree to these terms. Please read them carefully.</p>
      <h2 className="text-xl font-bold text-eco-green dark:text-eco-yellow mb-2 mt-6">2. User Responsibilities</h2>
      <p className="mb-4 text-gray-700 dark:text-eco-yellow/80">You agree to use Eco Waste Hub for lawful purposes only and to provide accurate information when creating an account or placing an order.</p>
      <h2 className="text-xl font-bold text-eco-green dark:text-eco-yellow mb-2 mt-6">3. Orders & Payments</h2>
      <p className="mb-4 text-gray-700 dark:text-eco-yellow/80">All orders are subject to availability. Prices and product details may change. Payments are processed securely, and you agree to pay the total amount at checkout.</p>
      <h2 className="text-xl font-bold text-eco-green dark:text-eco-yellow mb-2 mt-6">4. Privacy</h2>
      <p className="mb-4 text-gray-700 dark:text-eco-yellow/80">Your privacy is important to us. Please review our Privacy Policy to understand how we collect and use your information.</p>
      <h2 className="text-xl font-bold text-eco-green dark:text-eco-yellow mb-2 mt-6">5. Contact</h2>
      <p className="mb-4 text-gray-700 dark:text-eco-yellow/80">If you have any questions about these terms, please contact us at info@ecowastehub.com.</p>
    </div>
  </div>
);

export default Terms; 
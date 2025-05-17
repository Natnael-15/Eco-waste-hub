import React from 'react';

const Policy = () => (
  <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-amber-50 to-emerald-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-300 py-16 px-4 flex flex-col items-center">
    <div className="max-w-2xl w-full bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 border-4 border-eco-yellow dark:border-eco-green mb-10">
      <h1 className="text-4xl font-bold font-playfair text-eco-green dark:text-eco-yellow mb-8">Privacy Policy</h1>
      <h2 className="text-xl font-bold text-eco-green dark:text-eco-yellow mb-2 mt-6">1. Data Collection</h2>
      <p className="mb-4 text-gray-700 dark:text-eco-yellow/80">We collect information you provide when you create an account, place an order, or contact us. This may include your name, email, address, and order details.</p>
      <h2 className="text-xl font-bold text-eco-green dark:text-eco-yellow mb-2 mt-6">2. Use of Data</h2>
      <p className="mb-4 text-gray-700 dark:text-eco-yellow/80">Your data is used to process orders, improve our services, and communicate with you. We do not sell your personal information to third parties.</p>
      <h2 className="text-xl font-bold text-eco-green dark:text-eco-yellow mb-2 mt-6">3. Cookies</h2>
      <p className="mb-4 text-gray-700 dark:text-eco-yellow/80">We use cookies to enhance your experience on our site. You can disable cookies in your browser settings, but some features may not work as intended.</p>
      <h2 className="text-xl font-bold text-eco-green dark:text-eco-yellow mb-2 mt-6">4. Third-Party Services</h2>
      <p className="mb-4 text-gray-700 dark:text-eco-yellow/80">We may use third-party services for payments, analytics, or communication. These providers have their own privacy policies.</p>
      <h2 className="text-xl font-bold text-eco-green dark:text-eco-yellow mb-2 mt-6">5. Contact</h2>
      <p className="mb-4 text-gray-700 dark:text-eco-yellow/80">For questions about this policy, contact us at info@ecowastehub.com.</p>
    </div>
  </div>
);

export default Policy; 
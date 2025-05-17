import React from 'react';

const About = () => (
  <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-amber-50 to-emerald-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-300 py-16 px-4 flex flex-col items-center">
    <div className="max-w-3xl w-full bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 border-4 border-eco-yellow dark:border-eco-green mb-10">
      <h1 className="text-4xl font-bold font-playfair text-eco-green dark:text-eco-yellow mb-4">About Eco Waste Hub</h1>
      <p className="text-lg text-gray-700 dark:text-eco-yellow/80 mb-6">Eco Waste Hub is your eco-marketplace for surplus food and sustainable groceries. Our mission is to reduce food waste, support local communities, and make sustainable living accessible to everyone.</p>
      <h2 className="text-2xl font-bold text-eco-green dark:text-eco-yellow mb-2 mt-8">Our Story</h2>
      <p className="mb-4 text-gray-600 dark:text-eco-yellow/70">Founded in 2024, Eco Waste Hub was born out of a passion for sustainability and a desire to tackle the global issue of food waste. We partner with local farms, bakeries, and producers to rescue surplus food and offer it to you at affordable prices.</p>
      <h2 className="text-2xl font-bold text-eco-green dark:text-eco-yellow mb-2 mt-8">What Makes Us Unique?</h2>
      <ul className="list-disc pl-6 text-gray-700 dark:text-eco-yellow/80 space-y-2">
        <li>Curated selection of surplus and sustainable groceries</li>
        <li>Direct partnerships with local producers and brands</li>
        <li>Community-driven impact and transparent reporting</li>
        <li>Easy, enjoyable shopping experience for everyone</li>
      </ul>
      <div className="mt-8 text-center">
        <span className="inline-block bg-eco-green text-white font-bold px-6 py-2 rounded-full text-lg">Join us in making a difference!</span>
      </div>
    </div>
  </div>
);

export default About; 
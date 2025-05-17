import React from 'react';

const faqs = [
  {
    q: 'What is Eco Waste Hub?',
    a: 'Eco Waste Hub is an online marketplace for surplus food and sustainable groceries, helping reduce food waste and support local communities.'
  },
  {
    q: 'How does shopping here help the environment?',
    a: 'By buying surplus food, you help prevent perfectly good food from going to waste, reducing landfill and supporting a circular economy.'
  },
  {
    q: 'Where do the products come from?',
    a: 'We partner with local farms, bakeries, and producers to rescue surplus and sustainable products.'
  },
  {
    q: 'Is the food safe to eat?',
    a: 'Absolutely! All products are checked for quality and safety, and many are simply surplus or near their best-before date.'
  },
  {
    q: 'How can I contact support?',
    a: 'You can reach us anytime via our Contact page or by emailing info@ecowastehub.com.'
  }
];

const FAQ = () => (
  <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-amber-50 to-emerald-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-300 py-16 px-4 flex flex-col items-center">
    <div className="max-w-2xl w-full bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 border-4 border-eco-yellow dark:border-eco-green mb-10">
      <h1 className="text-4xl font-bold font-playfair text-eco-green dark:text-eco-yellow mb-8">Frequently Asked Questions</h1>
      <div className="space-y-6">
        {faqs.map((faq, i) => (
          <div key={i}>
            <h2 className="text-lg font-bold text-eco-green dark:text-eco-yellow mb-2">{faq.q}</h2>
            <p className="text-gray-700 dark:text-eco-yellow/80">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default FAQ; 
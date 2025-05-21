import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';

const steps = [
  {
    title: 'Browse Deals',
    description: 'Explore our selection of discounted food items from local businesses.',
    icon: (
      <svg
        className="h-12 w-12 text-green-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    ),
  },
  {
    title: 'Place Order',
    description: 'Select your items and complete your purchase securely online.',
    icon: (
      <svg
        className="h-12 w-12 text-green-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
  },
  {
    title: 'Pick Up',
    description: 'Collect your order from the store at your convenience.',
    icon: (
      <svg
        className="h-12 w-12 text-green-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
        />
      </svg>
    ),
  },
];

const partners = [
  { icon: '/assets/images/farm-icon.svg', name: 'Farms' },
  { icon: '/assets/images/grocery-icon.svg', name: 'Groceries' },
  { icon: '/assets/images/restaurant-icon.svg', name: 'Restaurants' },
  { icon: '/assets/images/volunteer-icon.svg', name: 'Charities' },
];

const testimonials = [
  {
    quote: 'Eco Waste Hub made it easy for us to donate surplus food and help our community.',
    name: 'Maria L.',
    role: 'Grocery Partner',
    icon: '/assets/gallery1-thumb.jpeg'
  },
  {
    quote: 'I volunteer every week and see the real impact on families. Highly recommend!',
    name: 'Samir P.',
    role: 'Volunteer',
    icon: '/assets/gallery2-thumb.jpeg'
  },
  {
    quote: 'We receive fresh food for our center thanks to this amazing initiative.',
    name: 'Helen T.',
    role: 'Community Center',
    icon: '/assets/gallery3-thumb.jpeg'
  }
];

const involvement = [
  {
    icon: '👐',
    title: 'Volunteer',
    desc: 'Help with food collection, packing, or delivery. Every hand counts!',
    cta: '/join-us',
    ctaText: 'Sign Up'
  },
  {
    icon: '💸',
    title: 'Donate',
    desc: 'Support our mission financially. Every pound helps us rescue more food.',
    cta: '/donate',
    ctaText: 'Donate'
  },
  {
    icon: '🤝',
    title: 'Partner',
    desc: 'Are you a business or charity? Join our network and make an impact.',
    cta: '/become-partner',
    ctaText: 'Become a Partner'
  },
  {
    icon: '📢',
    title: 'Spread the Word',
    desc: 'Share our mission with friends, family, and on social media.',
    cta: '/about',
    ctaText: 'Learn More'
  }
];

interface HowItWorksProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const HowItWorks: React.FC<HowItWorksProps> = ({ darkMode, toggleDarkMode }) => {
  const { user } = useAuth();

  return (
    <>
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-20">
      {/* Hero Section */}
        <section className="bg-eco-green dark:bg-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl font-bold text-white mb-6"
            >
            How It Works
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl text-white/90 max-w-3xl mx-auto"
            >
            We&apos;re making it easy to reduce food waste and save money. Here&apos;s how our platform works.
            </motion.p>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
                <motion.div
                key={step.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-center justify-center mb-4">
                    <div className="text-eco-yellow">
                  {step.icon}
                </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-eco-yellow mb-2 text-center">
                  {index + 1}. {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-center">
                  {step.description}
                </p>
                </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
        <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold text-eco-green dark:text-white mb-12 text-center"
            >
            Benefits of Using Eco Waste Hub
            </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: 'Save Money',
                  description: 'Get great deals on quality food items while helping reduce waste in your community.'
                },
                {
                  title: 'Reduce Waste',
                  description: 'Help prevent food waste by connecting with local businesses and making sustainable choices.'
                },
                {
                  title: 'Support Local',
                  description: 'Support local businesses while contributing to a more sustainable future.'
                }
              ].map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 hover:shadow-lg transition-shadow duration-300"
                >
                  <h3 className="text-xl font-semibold text-eco-green dark:text-eco-yellow mb-2">
                    {benefit.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                    {benefit.description}
              </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-gray-50 dark:bg-gray-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold text-eco-green dark:text-white mb-12 text-center"
            >
              What Our Community Says
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-lg"
                >
                  <div className="flex items-center mb-4">
                    <img
                      src={testimonial.icon}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover mr-4 border-2 border-eco-yellow"
                    />
                    <div>
                      <h4 className="text-lg font-semibold text-eco-green dark:text-eco-yellow">
                        {testimonial.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {testimonial.role}
                  </p>
                </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 italic">
                    "{testimonial.quote}"
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Get Involved Section */}
        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold text-eco-green dark:text-white mb-12 text-center"
            >
              Get Involved
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {involvement
                .filter(item => !(item.title === 'Volunteer' && user))
                .map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-center"
                >
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <h3 className="text-xl font-semibold text-eco-green dark:text-eco-yellow mb-2">
                    {item.title}
              </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {item.desc}
                  </p>
                  <Link
                    to={item.cta}
                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-eco-green hover:bg-eco-green/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-eco-green"
                  >
                    {item.ctaText}
                  </Link>
                </motion.div>
              ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
        <section className="py-20 bg-eco-green dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold text-white mb-8"
            >
            Ready to Get Started?
            </motion.h2>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col sm:flex-row justify-center gap-4"
            >
            <Link
                to={user ? "/shop" : "/signup"}
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-eco-green bg-eco-yellow hover:bg-eco-yellow/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-eco-yellow"
            >
                {user ? "Start Shopping" : "Sign Up Now"}
            </Link>
            <Link
              to="/contact"
                className="inline-flex items-center justify-center px-6 py-3 border border-eco-yellow text-base font-medium rounded-md text-eco-yellow hover:bg-eco-yellow/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-eco-yellow"
            >
              Contact Us
            </Link>
            </motion.div>
        </div>
      </section>
    </div>
    </>
  );
};

export default HowItWorks; 
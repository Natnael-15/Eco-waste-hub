import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const steps = [
  {
    icon: '/assets/images/farm-icon.svg',
    title: 'Source',
    desc: 'We partner with local farms and producers to identify surplus food.'
  },
  {
    icon: '/assets/images/grocery-icon.svg',
    title: 'Collect',
    desc: 'Our team collects surplus from groceries, restaurants, and partners.'
  },
  {
    icon: '/assets/images/restaurant-icon.svg',
    title: 'Distribute',
    desc: 'We sort and distribute food to communities and through our shop.'
  },
  {
    icon: '/assets/images/volunteer-icon.svg',
    title: 'Impact',
    desc: 'Volunteers and partners help us reduce waste and feed people.'
  }
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
    cta: '/join-us',
    ctaText: 'Become a Partner'
  },
  {
    icon: '📢',
    title: 'Spread the Word',
    desc: 'Share our mission with friends, family, and on social media.',
    cta: '/learn-more',
    ctaText: 'Learn More'
  }
];

const HowItWorks: React.FC = () => {
  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Stat Hero Section */}
      <section className="relative flex items-center justify-center min-h-[40vh] bg-gradient-to-br from-eco-green via-eco-green/80 to-eco-green/60 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
        <div className="absolute inset-0 bg-[url('/assets/gallery2.jpeg')] bg-cover bg-center opacity-40 mix-blend-multiply"></div>
        <div className="relative z-10 max-w-2xl mx-auto text-center py-16 px-4">
          <div className="text-6xl md:text-7xl font-bold text-eco-yellow mb-2 font-playfair drop-shadow">1/3</div>
          <div className="text-xl md:text-2xl text-white dark:text-eco-yellow font-bold mb-4">of all food produced is wasted</div>
          <p className="text-lg text-white/90 dark:text-eco-yellow/90 mb-6">Millions of tonnes of food are lost every year while many go hungry. Eco Waste Hub is changing that—one meal at a time.</p>
          <Link to="/donate" className="bg-eco-yellow text-eco-green font-bold px-8 py-3 rounded-full shadow hover:bg-yellow-300 transition">Help Us Change This</Link>
        </div>
      </section>

      {/* Visual Stepper/Timeline */}
      <section className="py-14 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold font-playfair text-eco-green dark:text-eco-yellow text-center mb-10">How It Works</h2>
          <div className="flex flex-row justify-center items-stretch gap-6 overflow-x-auto pb-4">
            {steps.map((step, idx) => (
              <div key={step.title} className="flex-1 min-w-[220px] flex flex-col items-center text-center px-2 md:px-6 relative">
                <div className="w-16 h-16 flex items-center justify-center bg-eco-green/10 dark:bg-eco-yellow/20 border border-eco-green/30 dark:border-eco-yellow/60 rounded-full mb-2">
                  <img src={step.icon} alt={step.title} className="w-10 h-10 dark:invert dark:brightness-150" />
                </div>
                <div className="text-lg font-bold text-eco-green dark:text-eco-yellow mb-1">{step.title}</div>
                <div className="text-gray-600 dark:text-gray-200 text-sm mb-2">{step.desc}</div>
                {idx < steps.length - 1 && (
                  <div className="hidden md:block absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-12 h-1 bg-eco-green/20 dark:bg-gray-700/40"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-12 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold font-playfair text-eco-green dark:text-eco-yellow mb-6">See the Journey</h2>
          <div className="relative w-full max-w-2xl mx-auto">
            <video controls poster="/assets/gallery2-thumb.jpeg" className="w-full rounded-xl shadow-lg">
              <source src="/assets/videos/how-does-it-work.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-14 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold font-playfair text-eco-green dark:text-eco-yellow text-center mb-8">Our Partners</h2>
          <div className="flex flex-wrap justify-center gap-8">
            {partners.map((p) => (
              <div key={p.name} className="flex flex-col items-center">
                <div className="w-16 h-16 flex items-center justify-center bg-eco-green/10 dark:bg-eco-yellow/20 border border-eco-green/30 dark:border-eco-yellow/60 rounded-full mb-2">
                  <img src={p.icon} alt={p.name} className="w-10 h-10 dark:invert dark:brightness-150" />
                </div>
                <div className="text-lg font-semibold text-eco-green dark:text-eco-yellow">{p.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-14 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold font-playfair text-eco-green dark:text-eco-yellow text-center mb-8">What People Are Saying</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white dark:bg-gray-900 rounded-xl shadow p-6 flex flex-col items-center text-center">
                <img src={t.icon} alt={t.name} className="w-16 h-16 object-cover rounded-full mb-2" />
                <div className="italic text-gray-700 dark:text-gray-200 mb-3">"{t.quote}"</div>
                <div className="font-bold text-eco-green dark:text-eco-yellow">{t.name}</div>
                <div className="text-sm text-gray-500 dark:text-gray-300">{t.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Get Involved Section */}
      {!user && (
        <section className="py-14 bg-white dark:bg-gray-900 transition-colors duration-300">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold font-playfair text-eco-green dark:text-eco-yellow text-center mb-8">Get Involved</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              {involvement.map((item) => (
                <div key={item.title} className="bg-gray-50 dark:bg-gray-800 rounded-xl shadow p-6 flex flex-col items-center text-center hover:shadow-lg transition">
                  <div className="text-4xl mb-3">{item.icon}</div>
                  <div className="text-lg font-bold text-eco-green dark:text-eco-yellow mb-1">{item.title}</div>
                  <div className="text-gray-600 dark:text-gray-200 mb-2">{item.desc}</div>
                  <Link to={item.cta} className="mt-2 inline-block bg-eco-yellow text-eco-green font-bold px-4 py-2 rounded-full shadow hover:bg-yellow-300 transition text-sm">{item.ctaText}</Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Final CTA Section */}
      <section className="py-16 bg-eco-green dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold font-playfair text-white dark:text-eco-yellow mb-6">Ready to Make a Difference?</h2>
          <p className="text-lg text-white/90 dark:text-eco-yellow/90 mb-8">Join Eco Waste Hub and help us rescue food, support communities, and build a more sustainable future.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!user && (
              <Link to="/join-us" className="bg-eco-yellow text-eco-green font-bold px-8 py-3 rounded-full shadow hover:bg-yellow-300 transition">Join Us</Link>
            )}
            <Link to="/donate" className="bg-white/80 dark:bg-gray-800 text-eco-green dark:text-eco-yellow font-bold px-8 py-3 rounded-full shadow hover:bg-white dark:hover:bg-gray-700 transition border border-eco-green">Donate</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks; 
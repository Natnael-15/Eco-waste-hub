import React, { useState } from 'react';
import { FaHandHoldingHeart, FaLeaf, FaLock, FaRegSmile, FaRedo } from 'react-icons/fa';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';

const impactStats = [
  { icon: <FaLeaf className="text-eco-green dark:text-eco-yellow text-4xl" />, label: 'Meals Saved', value: 2500 },
  { icon: <FaHandHoldingHeart className="text-eco-yellow dark:text-eco-yellow text-4xl" />, label: 'Families Helped', value: 800 },
  { icon: <FaRegSmile className="text-eco-green dark:text-eco-yellow text-4xl" />, label: 'Volunteers', value: 120 },
];

const partners = [
  { name: 'FoodShare', logo: 'https://cdn-icons-png.flaticon.com/512/1046/1046857.png' },
  { name: 'EcoTrust', logo: 'https://cdn-icons-png.flaticon.com/512/2917/2917242.png' },
  { name: 'GreenAid', logo: 'https://cdn-icons-png.flaticon.com/512/616/616494.png' },
];

const presetAmounts = [5, 10, 20];

const partnerDetails = {
  FoodShare: {
    description: 'FoodShare is a leading food rescue organization dedicated to redistributing surplus food to families in need. Their mission is to fight hunger and reduce food waste by connecting local businesses with community organizations.',
    website: 'https://foodshare.org',
  },
  EcoTrust: {
    description: 'EcoTrust empowers communities to build a sustainable future through innovative food recovery programs and environmental education. They partner with local farms and markets to ensure no good food goes to waste.',
    website: 'https://ecotrust.org',
  },
  GreenAid: {
    description: 'GreenAid supports eco-friendly initiatives and food security projects, helping to create greener, healthier communities. Their volunteers work tirelessly to rescue food and provide support to vulnerable families.',
    website: 'https://greenaid.org',
  },
};

const PartnerModal = ({ open, onClose, partner }) => {
  if (!open || !partner) return null;
  const details = partnerDetails[partner.name];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 max-w-md w-full relative border-2 border-eco-green/30 dark:border-eco-yellow/30">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-eco-green dark:hover:text-eco-yellow text-2xl font-bold">&times;</button>
        <div className="flex flex-col items-center">
          <div className="bg-white dark:bg-gray-800 rounded-full p-4 shadow mb-4 border-2 border-eco-green/20 dark:border-eco-yellow/20">
            <img src={partner.logo} alt={partner.name} className="h-16 w-16 object-contain" />
          </div>
          <h3 className="text-xl font-bold text-eco-green dark:text-eco-yellow mb-2">{partner.name}</h3>
          <p className="text-gray-700 dark:text-gray-200 mb-4 text-center">{details?.description}</p>
          {details?.website && (
            <a href={details.website} target="_blank" rel="noopener noreferrer" className="inline-block px-4 py-2 bg-eco-green dark:bg-eco-yellow text-white dark:text-eco-green rounded-full font-semibold hover:bg-eco-yellow hover:text-eco-green dark:hover:bg-eco-green dark:hover:text-white transition">Visit Website</a>
          )}
        </div>
      </div>
    </div>
  );
};

interface DonateProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

// Animated number component
const AnimatedNumber = ({ value, suffix = '', className = '' }) => {
  const [display, setDisplay] = useState(0);
  React.useEffect(() => {
    let start = display;
    let end = value;
    if (start === end) return;
    let step = Math.ceil(Math.abs(end - start) / 20) * Math.sign(end - start);
    const interval = setInterval(() => {
      setDisplay(d => {
        if ((step > 0 && d + step >= end) || (step < 0 && d + step <= end)) {
          clearInterval(interval);
          return end;
        }
        return d + step;
      });
    }, 20);
    return () => clearInterval(interval);
  }, [value]);
  return <span className={className}>{display.toLocaleString()}{suffix}</span>;
};

const Donate: React.FC<DonateProps> = ({ darkMode, toggleDarkMode }) => {
  const [amount, setAmount] = useState<number | ''>('');
  const [customAmount, setCustomAmount] = useState('');
  const [recurring, setRecurring] = useState(false);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const [openPartner, setOpenPartner] = useState(null);

  const handleAmountClick = (amt: number) => {
    setAmount(amt);
    setCustomAmount('');
  };

  const handleCustomAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomAmount(e.target.value);
    setAmount(Number(e.target.value) || '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!amount || amount < 1) {
      setError('Please enter a valid donation amount.');
      return;
    }
    // Store donation in localStorage
    const donation = {
      id: 'DON-' + Date.now(),
      user_id: user ? user.id : null,
      amount: Number(amount),
      name: name || null,
      message: message || null,
      recurring,
      created_at: new Date().toISOString(),
    };
    const existingDonations = JSON.parse(localStorage.getItem('donations') || '[]');
    existingDonations.unshift(donation); // Most recent first
    localStorage.setItem('donations', JSON.stringify(existingDonations));
    setSubmitted(true);
  };

  return (
    <>
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <div className="min-h-screen bg-gradient-to-br from-eco-green/10 via-eco-yellow/10 to-eco-green/5 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-300 pt-20">
      {/* Hero Section */}
      <section className="relative min-h-[40vh] flex items-center justify-center bg-gradient-to-br from-eco-green via-eco-green/80 to-eco-green/60 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 pt-20">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/6646910/pexels-photo-6646910.jpeg?auto=compress&w=1200&q=80')] bg-cover bg-center opacity-30 mix-blend-multiply"></div>
        <div className="relative z-10 max-w-2xl mx-auto text-center py-12 px-4 flex flex-col items-center">
          <h1 className="text-4xl md:text-5xl font-bold font-playfair text-white mb-3 drop-shadow-lg">Make a Difference Today</h1>
          <p className="text-lg text-white/90 mb-4">Your donation helps us rescue food, support families, and build a greener future. Every pound counts!</p>
          <a href="#donate-form" className="bg-eco-yellow text-eco-green font-bold px-8 py-3 rounded-lg shadow hover:bg-yellow-300 transition text-lg">Donate Now</a>
        </div>
      </section>

      {/* Impact Highlights */}
      <section className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8 py-10 px-4">
        {impactStats.map(stat => (
          <motion.div
            key={stat.label}
            className="bg-white/70 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl p-10 flex flex-col items-center gap-4 border border-eco-green/10 dark:border-eco-yellow/10 hover:shadow-eco-green/20 dark:hover:shadow-eco-yellow/20 transition-all duration-300 group"
            whileHover={{ scale: 1.06, rotate: 1 }}
          >
            <div className="text-5xl mb-2 group-hover:scale-110 transition-transform duration-300">{stat.icon}</div>
            <AnimatedNumber value={stat.value} suffix="+" className="text-4xl font-extrabold text-eco-green dark:text-eco-yellow" />
            <div className="text-gray-700 dark:text-gray-200 text-lg font-semibold">{stat.label}</div>
          </motion.div>
        ))}
      </section>

      {/* Donation Form Modern Redesign */}
      <section id="donate-form" className="max-w-5xl mx-auto px-4 py-10 flex flex-col md:flex-row gap-10 items-start">
        <motion.div
          className="flex-1 bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl rounded-3xl shadow-2xl p-10 border border-eco-green/20 dark:border-eco-yellow/20 relative overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Animated floating icons */}
          <FaHandHoldingHeart className="absolute -top-8 -left-8 text-eco-yellow/30 text-7xl animate-float-slow" />
          <FaLeaf className="absolute -bottom-8 -right-8 text-eco-green/20 text-7xl animate-float-slower" />
          <h2 className="text-3xl font-bold text-eco-green dark:text-eco-yellow mb-6 font-playfair">Donate</h2>
          {submitted ? (
            <div className="text-green-700 dark:text-green-400 text-center py-8">
              <div className="text-4xl mb-2">🎉</div>
              <div className="text-xl font-bold mb-2">Thank you for your generosity!</div>
              <div>Your donation of <span className="font-bold">£{amount}</span> will make a real impact.</div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 dark:text-eco-yellow font-semibold mb-2">Donation Amount</label>
                <div className="flex gap-3 mb-3 flex-wrap">
                  {presetAmounts.map(amt => (
                    <button
                      type="button"
                      key={amt}
                      onClick={() => handleAmountClick(amt)}
                      className={`px-5 py-2 rounded-full font-bold border transition ${amount === amt ? 'bg-eco-green text-white border-eco-green shadow-lg scale-105' : 'bg-gray-100 dark:bg-gray-800 text-eco-green border-eco-green/30 hover:bg-eco-yellow/30'}`}
                    >
                      £{amt}
                    </button>
                  ))}
                  <div className="relative">
                    <input
                      type="number"
                      min={1}
                      placeholder="Custom"
                      value={customAmount}
                      onChange={handleCustomAmount}
                      className="w-24 px-3 py-2 rounded-full border border-eco-green/30 focus:border-eco-green focus:ring-2 focus:ring-eco-green/20 transition text-eco-green font-bold bg-gray-100 dark:bg-gray-800 outline-none pl-8"
                    />
                    <FaLeaf className="absolute left-2 top-1/2 -translate-y-1/2 text-eco-green/40 text-lg pointer-events-none" />
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  {/* Toggle switch for recurring donation */}
                  <button
                    type="button"
                    aria-pressed={recurring}
                    onClick={() => setRecurring(r => !r)}
                    className={`w-12 h-7 flex items-center rounded-full p-1 transition-colors duration-300 ${recurring ? 'bg-eco-green' : 'bg-gray-300 dark:bg-gray-700'}`}
                  >
                    <span className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-300 ${recurring ? 'translate-x-5' : ''}`}></span>
                  </button>
                  <span className="text-eco-green dark:text-eco-yellow font-semibold flex items-center gap-1 cursor-pointer select-none">
                    <FaRedo className="inline-block text-eco-green dark:text-eco-yellow" /> Monthly donation
                  </span>
                </div>
              </div>
              <div className="relative">
                <FaRegSmile className="absolute left-3 top-1/2 -translate-y-1/2 text-eco-green/40 text-lg pointer-events-none" />
                <input
                  type="text"
                  name="name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="peer w-full p-3 pl-10 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-eco-green focus:ring-2 focus:ring-eco-green/20 transition placeholder-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-eco-yellow"
                  placeholder="Your Name (optional)"
                />
                <label className="absolute left-10 top-3 text-gray-500 dark:text-eco-yellow pointer-events-none transition-all duration-200 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:-top-4 peer-focus:text-xs peer-focus:text-eco-green bg-white dark:bg-gray-800 px-1">Your Name (optional)</label>
              </div>
              <div className="relative">
                <FaHandHoldingHeart className="absolute left-3 top-1/2 -translate-y-1/2 text-eco-yellow/40 text-lg pointer-events-none" />
                <input
                  type="text"
                  name="message"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  className="peer w-full p-3 pl-10 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-eco-green focus:ring-2 focus:ring-eco-green/20 transition placeholder-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-eco-yellow"
                  placeholder="Message (optional)"
                />
                <label className="absolute left-10 top-3 text-gray-500 dark:text-eco-yellow pointer-events-none transition-all duration-200 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:-top-4 peer-focus:text-xs peer-focus:text-eco-green bg-white dark:bg-gray-800 px-1">Message (optional)</label>
              </div>
              {error && <div className="text-red-600 dark:text-red-400 text-sm mb-2">{error}</div>}
              <button type="submit" className="w-full bg-eco-yellow text-eco-green font-bold py-3 rounded-lg hover:bg-yellow-300 transition text-lg flex items-center justify-center gap-2 shadow-lg">
                <FaHandHoldingHeart className="text-eco-green dark:text-eco-yellow" /> Donate
              </button>
            </form>
          )}
        </motion.div>
        {/* Why Donate Sidebar */}
        <aside className="hidden md:block w-full max-w-xs">
          <div className="sticky top-32 bg-white/90 dark:bg-gray-900/90 rounded-3xl shadow-xl p-8 border border-eco-green/10 dark:border-eco-yellow/10 flex flex-col gap-6 animate-fade-in">
            <h3 className="text-xl font-bold text-eco-green dark:text-eco-yellow mb-2 flex items-center gap-2"><FaLeaf className="text-eco-green dark:text-eco-yellow" /> Why Donate?</h3>
            <ul className="space-y-3 text-gray-700 dark:text-gray-200 text-base">
              <li className="flex items-center gap-2"><FaHandHoldingHeart className="text-eco-yellow" /> Rescue surplus food from going to waste</li>
              <li className="flex items-center gap-2"><FaRegSmile className="text-eco-green" /> Support families in need in your community</li>
              <li className="flex items-center gap-2"><FaLeaf className="text-eco-green" /> Help build a greener, more sustainable future</li>
              <li className="flex items-center gap-2"><FaLock className="text-eco-green" /> 100% secure and transparent donations</li>
            </ul>
          </div>
        </aside>
      </section>

      {/* Trust & Partners Section Modernized */}
      <section className="max-w-5xl mx-auto px-4 pb-12">
        <div className="flex flex-col items-center mb-6">
          <span className="inline-block px-4 py-1 bg-eco-green/20 dark:bg-eco-yellow/20 rounded-full text-eco-green dark:text-eco-yellow font-semibold tracking-wide text-sm uppercase shadow-sm border border-eco-green/30 dark:border-eco-yellow/30 mb-2">Trusted by</span>
        </div>
        <div className="bg-white/90 dark:bg-gray-900/90 rounded-xl shadow-lg p-8 flex flex-col md:flex-row items-center gap-8 justify-between border border-eco-green/10 dark:border-eco-yellow/10">
          <div className="flex-1 flex flex-col gap-3 mb-6 md:mb-0">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-eco-green/10 dark:bg-eco-yellow/10 rounded-full font-bold text-eco-green dark:text-eco-yellow">
              <FaLock className="text-eco-green dark:text-eco-yellow" /> 100% Secure Payment
            </span>
            <div className="text-gray-500 dark:text-gray-300 text-sm">Your donation is protected and encrypted.</div>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="flex gap-8 items-end justify-center">
              {partners.map(partner => (
                <button key={partner.name} type="button" onClick={() => setOpenPartner(partner)} className="focus:outline-none">
                  <div className="flex flex-col items-center group">
                    <div className="bg-white dark:bg-gray-800 rounded-full p-3 shadow-md border-2 border-eco-green/20 dark:border-eco-yellow/20 mb-2 transition-transform group-hover:scale-105">
                      <img src={partner.logo} alt={partner.name} className="h-12 w-12 object-contain grayscale hover:grayscale-0 transition" />
                    </div>
                    <span className="text-xs font-bold text-eco-green dark:text-eco-yellow mt-1 tracking-wide uppercase opacity-80">{partner.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
        <PartnerModal open={!!openPartner} onClose={() => setOpenPartner(null)} partner={openPartner} />
      </section>
    </div>
    </>
  );
};

export default Donate; 
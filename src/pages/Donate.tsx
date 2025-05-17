import React, { useState } from 'react';
import { FaHandHoldingHeart, FaLeaf, FaLock, FaRegSmile, FaRedo } from 'react-icons/fa';
import { supabase } from '../services/supabase';
import { useAuth } from '../context/AuthContext';

const impactStats = [
  { icon: <FaLeaf className="text-eco-green dark:text-eco-yellow text-2xl" />, label: 'Meals Saved', value: '2,500+' },
  { icon: <FaHandHoldingHeart className="text-eco-yellow dark:text-eco-yellow text-2xl" />, label: 'Families Helped', value: '800+' },
  { icon: <FaRegSmile className="text-eco-green dark:text-eco-yellow text-2xl" />, label: 'Volunteers', value: '120+' },
];

const partners = [
  { name: 'FoodShare', logo: 'https://cdn-icons-png.flaticon.com/512/1046/1046857.png' },
  { name: 'EcoTrust', logo: 'https://cdn-icons-png.flaticon.com/512/2917/2917242.png' },
  { name: 'GreenAid', logo: 'https://cdn-icons-png.flaticon.com/512/616/616494.png' },
];

const presetAmounts = [5, 10, 20];

const Donate: React.FC = () => {
  const [amount, setAmount] = useState<number | ''>('');
  const [customAmount, setCustomAmount] = useState('');
  const [recurring, setRecurring] = useState(false);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative min-h-[40vh] flex items-center justify-center bg-gradient-to-br from-eco-green via-eco-green/80 to-eco-green/60 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 pt-20">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/6646910/pexels-photo-6646910.jpeg?auto=compress&w=1200&q=80')] bg-cover bg-center opacity-30 mix-blend-multiply"></div>
        <div className="relative z-10 max-w-2xl mx-auto text-center py-12 px-4 flex flex-col items-center">
          <div className="bg-eco-yellow/90 rounded-full w-16 h-16 flex items-center justify-center mb-4 shadow-lg">
            <FaHandHoldingHeart className="text-eco-green dark:text-eco-yellow text-3xl" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-playfair text-white mb-3 drop-shadow-lg">Make a Difference Today</h1>
          <p className="text-lg text-white/90 mb-4">Your donation helps us rescue food, support families, and build a greener future. Every pound counts!</p>
          <a href="#donate-form" className="bg-eco-yellow text-eco-green font-bold px-8 py-3 rounded-lg shadow hover:bg-yellow-300 transition text-lg">Donate Now</a>
        </div>
      </section>

      {/* Impact Highlights */}
      <section className="max-w-4xl mx-auto px-4 py-10 grid md:grid-cols-3 gap-8 text-center">
        {impactStats.map(stat => (
          <div key={stat.label} className="bg-white dark:bg-gray-900 rounded-xl shadow p-6 flex flex-col items-center gap-2">
            {stat.icon}
            <div className="text-2xl font-bold text-eco-green font-playfair">{stat.value}</div>
            <div className="text-gray-500 dark:text-gray-300 text-sm">{stat.label}</div>
          </div>
        ))}
      </section>

      {/* Donation Form */}
      <section id="donate-form" className="max-w-2xl mx-auto px-4 py-10">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-eco-green mb-6 font-playfair">Donate</h2>
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
                <div className="flex gap-3 mb-3">
                  {presetAmounts.map(amt => (
                    <button
                      type="button"
                      key={amt}
                      onClick={() => handleAmountClick(amt)}
                      className={`px-5 py-2 rounded-full font-bold border transition ${amount === amt ? 'bg-eco-green text-white border-eco-green' : 'bg-gray-100 dark:bg-gray-800 text-eco-green border-eco-green/30 hover:bg-eco-yellow/30'}`}
                    >
                      £{amt}
                    </button>
                  ))}
                  <input
                    type="number"
                    min={1}
                    placeholder="Custom"
                    value={customAmount}
                    onChange={handleCustomAmount}
                    className="w-24 px-3 py-2 rounded-full border border-eco-green/30 focus:border-eco-green focus:ring-2 focus:ring-eco-green/20 transition text-eco-green font-bold bg-gray-100 dark:bg-gray-800 outline-none"
                  />
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <input
                    type="checkbox"
                    id="recurring"
                    checked={recurring}
                    onChange={() => setRecurring(r => !r)}
                    className="accent-eco-green w-5 h-5"
                  />
                  <label htmlFor="recurring" className="text-eco-green dark:text-eco-yellow font-semibold flex items-center gap-1 cursor-pointer">
                    <FaRedo className="inline-block text-eco-green dark:text-eco-yellow" /> Make this a monthly donation
                  </label>
                </div>
              </div>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="peer w-full p-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-eco-green focus:ring-2 focus:ring-eco-green/20 transition placeholder-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-eco-yellow"
                  placeholder="Your Name (optional)"
                />
                <label className="absolute left-3 top-3 text-gray-500 dark:text-eco-yellow pointer-events-none transition-all duration-200 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:-top-4 peer-focus:text-xs peer-focus:text-eco-green bg-white dark:bg-gray-800 px-1">Your Name (optional)</label>
              </div>
              <div className="relative">
                <input
                  type="text"
                  name="message"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  className="peer w-full p-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-eco-green focus:ring-2 focus:ring-eco-green/20 transition placeholder-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-eco-yellow"
                  placeholder="Message (optional)"
                />
                <label className="absolute left-3 top-3 text-gray-500 dark:text-eco-yellow pointer-events-none transition-all duration-200 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:-top-4 peer-focus:text-xs peer-focus:text-eco-green bg-white dark:bg-gray-800 px-1">Message (optional)</label>
              </div>
              {error && <div className="text-red-600 dark:text-red-400 text-sm mb-2">{error}</div>}
              <button type="submit" className="w-full bg-eco-yellow text-eco-green font-bold py-3 rounded-lg hover:bg-yellow-300 transition text-lg flex items-center justify-center gap-2">
                <FaHandHoldingHeart className="text-eco-green dark:text-eco-yellow" /> Donate
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Trust & Security Section */}
      <section className="max-w-4xl mx-auto px-4 pb-12">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-8 flex flex-col md:flex-row items-center gap-8 justify-between">
          <div className="flex-1 flex flex-col gap-3 mb-6 md:mb-0">
            <div className="flex items-center gap-2 text-eco-green dark:text-eco-yellow font-bold"><FaLock className="text-eco-green dark:text-eco-yellow" /> 100% Secure Payment</div>
            <div className="text-gray-500 dark:text-gray-300 text-sm">Your donation is protected and encrypted.</div>
          </div>
          <div className="flex-1 flex flex-wrap gap-6 items-center justify-center">
            {partners.map(partner => (
              <img key={partner.name} src={partner.logo} alt={partner.name} className="h-10 object-contain transition" />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Donate; 
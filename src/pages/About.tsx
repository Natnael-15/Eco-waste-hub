import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import InteractiveWorldMap from '../components/InteractiveWorldMap';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Example data for new features
const ecoTips = [
  'Store fruits and veggies properly to make them last longer.',
  'Plan your meals to reduce food waste and save money.',
  'Compost food scraps to enrich soil and reduce landfill waste.',
  'Support local farmers and food rescue initiatives.',
  'Use leftovers creatively for new meals!',
  'Freeze surplus food before it spoils.',
  'Share extra food with neighbors or local charities.',
  'Check your fridge before shopping.',
  'Understand food date labels.',
  'Try plant-based recipes to lower your carbon footprint.'
];
const partnerLogos = [
  'https://upload.wikimedia.org/wikipedia/commons/4/44/Google-flutter-logo.svg',
  'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg',
  'https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg',
  'https://upload.wikimedia.org/wikipedia/commons/6/6f/Logo_of_Twitter.svg',
  'https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png',
];
const recipes = [
  { name: 'Veggie Stir Fry', img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80', desc: 'Use leftover veggies for a quick, healthy meal.', details: 'Ingredients: Mixed veggies, soy sauce, garlic, ginger.\nInstructions: Stir fry veggies in a hot pan with garlic and ginger, add soy sauce, cook until tender.' },
  { name: 'Bread Pudding', img: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80', desc: 'Turn stale bread into a delicious dessert.', details: 'Ingredients: Stale bread, milk, eggs, sugar, cinnamon.\nInstructions: Soak bread in milk, mix with eggs and sugar, bake until golden.' },
  { name: 'Fruit Smoothie', img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80', desc: 'Blend ripe fruits for a refreshing drink.', details: 'Ingredients: Ripe fruits, yogurt or juice, ice.\nInstructions: Blend all ingredients until smooth, serve chilled.' },
];
const faqs = [
  { q: 'What is food waste?', a: 'Food waste is food that is discarded or not eaten.' },
  { q: 'How can I reduce food waste?', a: 'Plan meals, store food properly, and use leftovers.' },
  { q: 'How does Eco Waste Hub help?', a: 'We connect surplus food to people who need it.' },
];
const testimonials = [
  { name: 'Olivia R.', quote: 'Joining Eco Waste Hub was the best decision for our business and our community. We see the impact every day!', img: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=80&q=80' },
  { name: 'James K.', quote: 'I love volunteering here. The team is amazing and the impact is real!', img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=80&q=80' },
];

const About: React.FC = () => {
  const { user } = useAuth();
  // Live counter example
  const [foodSaved, setFoodSaved] = useState(1000000);
  useEffect(() => {
    const interval = setInterval(() => setFoodSaved(f => f + Math.floor(Math.random() * 10)), 100);
    return () => clearInterval(interval);
  }, []);
  // Eco tip rotator
  const [tipIdx, setTipIdx] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setTipIdx(i => (i + 1) % ecoTips.length), 5000);
    return () => clearInterval(interval);
  }, []);
  // FAQ accordion
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  // Impact Calculator state
  const [monthlyKg, setMonthlyKg] = useState(10);
  const [yearlyImpact, setYearlyImpact] = useState(120);
  const [inputError, setInputError] = useState('');
  const [displayImpact, setDisplayImpact] = useState(120);
  const maxYearly = 12000;
  // Eco Quiz state
  const quizQuestions = [
    {
      question: 'How often do you compost food scraps?',
      options: [
        { label: 'Always', score: 10 },
        { label: 'Sometimes', score: 7 },
        { label: 'Never', score: 3 },
      ],
    },
    {
      question: 'How do you usually shop for groceries?',
      options: [
        { label: 'Local/farmers market', score: 10 },
        { label: 'Supermarket', score: 7 },
        { label: 'Takeout/fast food', score: 4 },
      ],
    },
    {
      question: 'What do you do with leftovers?',
      options: [
        { label: 'Eat or repurpose them', score: 10 },
        { label: 'Sometimes throw away', score: 5 },
        { label: 'Usually throw away', score: 2 },
      ],
    },
    {
      question: 'How often do you check food expiry dates?',
      options: [
        { label: 'Always', score: 10 },
        { label: 'Sometimes', score: 6 },
        { label: 'Rarely', score: 2 },
      ],
    },
    {
      question: 'Do you bring your own bags when shopping?',
      options: [
        { label: 'Always', score: 10 },
        { label: 'Sometimes', score: 6 },
        { label: 'Never', score: 2 },
      ],
    },
  ];
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [quizComplete, setQuizComplete] = useState(false);
  const totalQuizScore = quizAnswers.reduce((a, b) => a + b, 0);
  const maxQuizScore = quizQuestions.length * 10;
  const getQuizFeedback = (score: number) => {
    const percent = (score / maxQuizScore) * 100;
    if (percent >= 90) return '🌟 Eco Hero! You are making a huge difference!';
    if (percent >= 70) return '💚 Great job! Keep up the eco-friendly habits.';
    if (percent >= 50) return '👍 Good start! Try a few more eco tips.';
    return '🌱 Every step counts. Try some new eco habits!';
  };
  const handleQuizAnswer = (score: number) => {
    if (quizStep < quizQuestions.length - 1) {
      setQuizAnswers([...quizAnswers, score]);
      setQuizStep(quizStep + 1);
    } else {
      setQuizAnswers([...quizAnswers, score]);
      setQuizComplete(true);
    }
  };
  const handleQuizRestart = () => {
    setQuizStep(0);
    setQuizAnswers([]);
    setQuizComplete(false);
  };

  // Animate the yearly impact number
  useEffect(() => {
    if (yearlyImpact !== displayImpact) {
      const diff = yearlyImpact - displayImpact;
      const step = Math.ceil(Math.abs(diff) / 10) * Math.sign(diff);
      const timeout = setTimeout(() => setDisplayImpact(d => d + step), 20);
      return () => clearTimeout(timeout);
    }
  }, [yearlyImpact, displayImpact]);

  const handleImpactCalc = () => {
    if (isNaN(monthlyKg) || monthlyKg < 1 || monthlyKg > 1000) {
      setInputError('Please enter a value between 1 and 1000.');
      return;
    }
    setInputError('');
    setYearlyImpact(monthlyKg * 12);
  };

  // Recipe modal state
  const [openRecipe, setOpenRecipe] = useState(null);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Animated Hero Section */}
        <section className="bg-gray-50 dark:bg-gray-900 py-20 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="text-4xl font-bold text-eco-green dark:text-eco-yellow mb-6">Learn More About Food Waste</motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="text-xl text-gray-700 dark:text-gray-200 max-w-3xl mx-auto">Understanding the impact of food waste and how we can work together to reduce it.</motion.p>
            {/* Animated eco icons */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="absolute left-10 top-10 animate-float-slow text-6xl text-eco-yellow opacity-40">🌱</motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="absolute right-16 top-24 animate-float-fast text-5xl text-eco-yellow opacity-30">🍏</motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} className="absolute left-1/4 bottom-10 animate-float-medium text-5xl text-eco-yellow opacity-30">🥕</motion.div>
          </div>
        </section>

        {/* Live Food Waste Counter */}
        <section className="py-12 bg-white dark:bg-gray-800 text-center">
          <h2 className="text-2xl font-bold mb-2 text-eco-green dark:text-eco-yellow">Live Food Saved Counter</h2>
          <div className="text-4xl md:text-6xl font-extrabold text-eco-green dark:text-eco-yellow mb-2 animate-pulse">{foodSaved.toLocaleString()} kg</div>
          <p className="text-gray-600 dark:text-gray-300">and counting! Every kilogram rescued makes a difference.</p>
        </section>

        {/* Interactive World Map (now functional) */}
        <section className="py-12 bg-gray-50 dark:bg-gray-900 text-center">
          <h2 className="text-2xl font-bold mb-6 text-eco-green dark:text-eco-yellow">Global Food Waste Impact</h2>
          <div className="w-full flex justify-center">
            <div className="w-full max-w-2xl">
              <InteractiveWorldMap />
            </div>
          </div>
        </section>

        {/* Timeline of Food Rescue */}
        <section className="py-12 bg-white dark:bg-gray-800">
          <h2 className="text-2xl font-bold mb-8 text-eco-green dark:text-eco-yellow text-center">How Food Rescue Works</h2>
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8 items-center justify-center">
            <div className="flex-1 flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <span className="text-3xl">🤝</span>
                <span className="font-semibold text-lg">Partner with local food businesses</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-3xl">🚚</span>
                <span className="font-semibold text-lg">Rescue surplus food before it goes to waste</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-3xl">🛒</span>
                <span className="font-semibold text-lg">Offer rescued food to the community</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-3xl">💚</span>
                <span className="font-semibold text-lg">Track impact and celebrate together</span>
              </div>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <img src="/assets/earth-blue-marble.jpg" alt="Earth" className="w-64 h-64 rounded-full shadow-lg object-cover border-4 border-eco-green" />
            </div>
          </div>
        </section>

        {/* Impact Calculator */}
        <section className="py-16 bg-gray-50 dark:bg-gray-900 text-center">
          <div className="max-w-lg mx-auto relative">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
              className="relative z-10 -mt-12 flex justify-center">
              <span className="text-6xl md:text-7xl animate-bounce drop-shadow-lg select-none">🌱</span>
            </motion.div>
            <div className="backdrop-blur-lg bg-white/70 dark:bg-gray-800/70 border border-eco-green dark:border-eco-yellow rounded-3xl shadow-2xl px-8 py-10 flex flex-col items-center gap-4">
              <h2 className="text-3xl font-extrabold text-eco-green dark:text-eco-yellow mb-2 tracking-tight">Your Potential Impact</h2>
              <label className="block mb-1 text-lg text-gray-700 dark:text-gray-200 font-semibold">How many kg of food could you save per month?</label>
              <div className="flex w-full gap-2 items-center justify-center">
                <input
                  type="number"
                  min={1}
                  max={1000}
                  value={monthlyKg}
                  onChange={e => setMonthlyKg(Number(e.target.value))}
                  className="flex-1 px-6 py-3 rounded-2xl border-2 border-eco-green dark:border-eco-yellow text-lg font-bold text-eco-green dark:text-eco-yellow bg-white/80 dark:bg-gray-900/80 focus:outline-none focus:ring-2 focus:ring-eco-green dark:focus:ring-eco-yellow transition"
                />
                <span className="text-lg font-semibold text-gray-500 dark:text-gray-300">kg</span>
              </div>
              <button
                className="w-full mt-2 bg-eco-green dark:bg-eco-yellow text-white dark:text-eco-green font-bold py-3 rounded-2xl text-lg shadow hover:bg-eco-green/90 dark:hover:bg-yellow-300 transition"
                onClick={handleImpactCalc}
              >
                Calculate Impact
              </button>
              {inputError && <div className="mt-1 text-red-500 text-sm">{inputError}</div>}
              <div className="w-full mt-4">
                <div className="text-lg text-gray-700 dark:text-gray-200 mb-1">You could save up to</div>
                <motion.div key={displayImpact} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.4 }}
                  className="text-5xl md:text-6xl font-extrabold text-eco-green dark:text-eco-yellow drop-shadow mb-2">
                  {displayImpact.toLocaleString()} <span className="text-2xl">kg</span>
                </motion.div>
                <div className="text-base text-eco-green dark:text-eco-yellow font-semibold mb-2">of food per year!</div>
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden mb-2">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, (displayImpact / maxYearly) * 100)}%` }} transition={{ duration: 1.2, ease: 'easeInOut' }}
                    className="bg-eco-green dark:bg-eco-yellow h-4 rounded-full" />
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">That's {((displayImpact / maxYearly) * 100).toFixed(1)}% of our community goal!</div>
                <div className="mt-2 text-eco-green dark:text-eco-yellow font-bold text-lg">Every kilogram counts. Thank you for making a difference! 💚</div>
              </div>
            </div>
          </div>
        </section>

        {/* Success Stories Carousel */}
        <section className="py-12 bg-white dark:bg-gray-800">
          <h2 className="text-2xl font-bold mb-8 text-eco-green dark:text-eco-yellow text-center">Success Stories</h2>
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8 items-center justify-center">
            <div className="flex-1 flex flex-col gap-6">
              <div className="bg-eco-green/10 dark:bg-eco-yellow/10 rounded-xl p-6 shadow flex flex-col items-center">
                <img src="https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=80&q=80" alt="Olivia R." className="w-16 h-16 rounded-full mb-2" />
                <div className="font-bold text-eco-green dark:text-eco-yellow">Olivia R.</div>
                <div className="italic text-gray-700 dark:text-gray-200">"Joining Eco Waste Hub was the best decision for our business and our community. We see the impact every day!"</div>
              </div>
              <div className="bg-eco-green/10 dark:bg-eco-yellow/10 rounded-xl p-6 shadow flex flex-col items-center">
                <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=80&q=80" alt="James K." className="w-16 h-16 rounded-full mb-2" />
                <div className="font-bold text-eco-green dark:text-eco-yellow">James K.</div>
                <div className="italic text-gray-700 dark:text-gray-200">"I love volunteering here. The team is amazing and the impact is real!"</div>
              </div>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <img src="/assets/gallery2-thumb.jpeg" alt="Success" className="w-64 h-64 rounded-xl shadow-lg object-cover border-4 border-eco-yellow" />
            </div>
          </div>
        </section>

        {/* Infographic Cards */}
        <section className="py-12 bg-gray-50 dark:bg-gray-900">
          <h2 className="text-2xl font-bold mb-8 text-eco-green dark:text-eco-yellow text-center">Eco Facts & Tips</h2>
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            {ecoTips.slice(0, 6).map((tip, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col items-center text-center">
                <span className="text-3xl mb-2">🌱</span>
                <div className="font-semibold text-gray-700 dark:text-gray-200 mb-2">Eco Tip #{i + 1}</div>
                <div className="text-gray-500 dark:text-gray-400">{tip}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Video Explainer */}
        <section className="py-12 bg-white dark:bg-gray-800 text-center">
          <h2 className="text-2xl font-bold mb-4 text-eco-green dark:text-eco-yellow">Watch: Why Food Waste Matters</h2>
          <div className="flex justify-center">
            <div className="w-full max-w-2xl aspect-video relative rounded-xl shadow-lg overflow-hidden bg-gray-200 dark:bg-gray-700">
              <iframe
                src="https://www.youtube.com/embed/6RlxySFrkIM"
                title="Why Food Waste Matters - YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute top-0 left-0 w-full h-full rounded-xl"
                style={{ border: 0 }}
              ></iframe>
              <noscript>
                <div className="flex items-center justify-center h-full text-gray-600 dark:text-gray-300 text-lg p-4">
                  Video unavailable. Please enable JavaScript or <a href="https://www.youtube.com/watch?v=IoCVrkcaH6Q" target="_blank" rel="noopener noreferrer" className="underline ml-1">watch on YouTube</a>.
                </div>
              </noscript>
            </div>
          </div>
        </section>

        {/* Eco Quiz */}
        <section className="py-16 bg-gray-50 dark:bg-gray-900 text-center">
          <div className="max-w-lg mx-auto relative">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
              className="relative z-10 -mt-12 flex justify-center">
              <span className="text-6xl md:text-7xl animate-bounce drop-shadow-lg select-none">🍃</span>
            </motion.div>
            <div className="backdrop-blur-lg bg-white/70 dark:bg-gray-800/70 border border-eco-green dark:border-eco-yellow rounded-3xl shadow-2xl px-8 py-10 flex flex-col items-center gap-4">
              <h2 className="text-3xl font-extrabold text-eco-green dark:text-eco-yellow mb-2 tracking-tight">Eco Quiz: How Eco Are You?</h2>
              {!quizComplete ? (
                <>
                  <div className="mb-2 text-lg text-gray-700 dark:text-gray-200 font-semibold">
                    {quizQuestions[quizStep].question}
                  </div>
                  <div className="flex flex-col gap-3 w-full mb-4">
                    {quizQuestions[quizStep].options.map(opt => (
                      <button
                        key={opt.label}
                        onClick={() => handleQuizAnswer(opt.score)}
                        className={`px-6 py-3 rounded-2xl font-bold text-lg transition border-2 focus:outline-none
                          bg-white/80 dark:bg-gray-900/80 text-eco-green dark:text-eco-yellow border-eco-green/40 dark:border-eco-yellow/40 hover:bg-eco-green/10 dark:hover:bg-eco-yellow/10
                        `}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Question {quizStep + 1} of {quizQuestions.length}</div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden mb-2">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${((quizStep + 1) / quizQuestions.length) * 100}%` }} transition={{ duration: 0.7, ease: 'easeInOut' }}
                      className="bg-eco-green dark:bg-eco-yellow h-3 rounded-full" />
                  </div>
                </>
              ) : (
                <>
                  <motion.div key={totalQuizScore} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.4 }}
                    className="text-5xl md:text-6xl font-extrabold text-eco-green dark:text-eco-yellow drop-shadow mb-2">
                    {totalQuizScore} <span className="text-2xl">/ {maxQuizScore}</span>
                  </motion.div>
                  <motion.div key={getQuizFeedback(totalQuizScore)} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                    className="text-lg text-eco-green dark:text-eco-yellow font-semibold mb-4">
                    {getQuizFeedback(totalQuizScore)}
                  </motion.div>
                  <button
                    onClick={handleQuizRestart}
                    className="mt-2 px-6 py-3 rounded-2xl font-bold text-lg bg-eco-green dark:bg-eco-yellow text-white dark:text-eco-green border-2 border-eco-green dark:border-eco-yellow shadow hover:bg-eco-green/90 dark:hover:bg-yellow-300 transition"
                  >
                    Retake Quiz
                  </button>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Leaderboard */}
        <section className="py-12 bg-white dark:bg-gray-800 text-center">
          <h2 className="text-2xl font-bold mb-4 text-eco-green dark:text-eco-yellow">Top Eco Heroes</h2>
          <div className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-eco-green/10 dark:bg-eco-yellow/10 rounded-xl p-6 shadow flex flex-col items-center">
              <div className="text-3xl mb-2">🥇</div>
              <div className="font-bold text-eco-green dark:text-eco-yellow">Sarah</div>
              <div className="text-gray-500 dark:text-gray-400">1200 kg saved</div>
            </div>
            <div className="bg-eco-green/10 dark:bg-eco-yellow/10 rounded-xl p-6 shadow flex flex-col items-center">
              <div className="text-3xl mb-2">🥈</div>
              <div className="font-bold text-eco-green dark:text-eco-yellow">Green Bakery</div>
              <div className="text-gray-500 dark:text-gray-400">950 kg saved</div>
            </div>
            <div className="bg-eco-green/10 dark:bg-eco-yellow/10 rounded-xl p-6 shadow flex flex-col items-center">
              <div className="text-3xl mb-2">🥉</div>
              <div className="font-bold text-eco-green dark:text-eco-yellow">Hope Shelter</div>
              <div className="text-gray-500 dark:text-gray-400">800 kg saved</div>
            </div>
          </div>
        </section>

        {/* Animated Progress Bars */}
        <section className="py-12 bg-gray-50 dark:bg-gray-900 text-center">
          <h2 className="text-2xl font-bold mb-4 text-eco-green dark:text-eco-yellow">Community Goals</h2>
          <div className="max-w-2xl mx-auto flex flex-col gap-6">
            <div>
              <div className="flex justify-between mb-1 text-sm font-semibold text-gray-700 dark:text-gray-200">
                <span>Meals Rescued</span>
                <span>8,500 / 10,000</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: '85%' }} transition={{ duration: 1.2, ease: 'easeInOut' }} className="bg-eco-green dark:bg-eco-yellow h-4 rounded-full" />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1 text-sm font-semibold text-gray-700 dark:text-gray-200">
                <span>Volunteers</span>
                <span>320 / 500</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: '64%' }} transition={{ duration: 1.2, delay: 0.5, ease: 'easeInOut' }} className="bg-eco-green dark:bg-eco-yellow h-4 rounded-full" />
      </div>
    </div>
  </div>
        </section>

        {/* Eco Tips Rotator */}
        <section className="py-12 bg-white dark:bg-gray-800 text-center">
          <h2 className="text-2xl font-bold mb-4 text-eco-green dark:text-eco-yellow">Eco Tip of the Moment</h2>
          <div className="max-w-xl mx-auto bg-eco-yellow/90 text-eco-green rounded-xl shadow p-6 flex items-center gap-3 text-lg font-semibold animate-fade-in">
            <span className="text-2xl">🌱</span>
            <span>{ecoTips[tipIdx]}</span>
          </div>
        </section>

        {/* FAQ Accordion */}
        <section className="py-12 bg-gray-50 dark:bg-gray-900">
          <h2 className="text-2xl font-bold mb-8 text-eco-green dark:text-eco-yellow text-center">Frequently Asked Questions</h2>
          <div className="max-w-2xl mx-auto space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 cursor-pointer" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-700 dark:text-gray-200">{faq.q}</span>
                  <span className="text-eco-green dark:text-eco-yellow text-xl">{openFaq === i ? '-' : '+'}</span>
                </div>
                {openFaq === i && <div className="mt-4 text-gray-500 dark:text-gray-400">{faq.a}</div>}
              </div>
            ))}
          </div>
        </section>

        {/* Sustainable Recipes */}
        <section className="py-12 bg-white dark:bg-gray-800">
          <h2 className="text-2xl font-bold mb-8 text-eco-green dark:text-eco-yellow text-center">Sustainable Recipes</h2>
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            {recipes.map((r, i) => (
              <div key={i} className="bg-gray-50 dark:bg-gray-700 rounded-xl shadow-lg p-6 flex flex-col items-center text-center">
                <img src={r.img} alt={r.name} className="w-32 h-24 object-cover rounded mb-3" />
                <div className="font-bold text-eco-green dark:text-eco-yellow mb-1">{r.name}</div>
                <div className="text-gray-600 dark:text-gray-300 mb-2">{r.desc}</div>
                <button className="bg-eco-green dark:bg-eco-yellow text-white dark:text-eco-green px-4 py-2 rounded-full font-semibold hover:bg-eco-green/80 dark:hover:bg-yellow-300 transition" onClick={() => setOpenRecipe(r)}>
                  View Recipe
                </button>
              </div>
            ))}
          </div>
          {/* Recipe Modal */}
          {openRecipe && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/80 animate-fade-in" onClick={() => setOpenRecipe(null)}>
              <div className="rounded-2xl shadow-xl max-w-md w-full p-8 relative bg-white/80 dark:bg-gray-900/90 border-4 border-eco-green dark:border-eco-yellow backdrop-blur-lg" onClick={e => e.stopPropagation()}>
                <button onClick={() => setOpenRecipe(null)} className="absolute top-3 right-3 text-gray-400 hover:text-eco-green dark:text-eco-yellow dark:hover:text-eco-green text-2xl">×</button>
                <img src={openRecipe.img} alt={openRecipe.name} className="w-32 h-24 object-cover rounded mb-3 mx-auto" />
                <div className="text-2xl font-bold text-eco-green dark:text-eco-yellow mb-2 text-center">{openRecipe.name}</div>
                <div className="text-gray-700 dark:text-gray-200 mb-2 text-center">{openRecipe.desc}</div>
                <pre className="bg-gray-100 dark:bg-gray-800 rounded p-4 text-sm text-gray-800 dark:text-gray-100 whitespace-pre-wrap mb-2">{openRecipe.details}</pre>
              </div>
            </div>
          )}
        </section>

        {/* Volunteer Signup CTA */}
        {!user && (
          <section className="py-12 bg-eco-green dark:bg-eco-yellow text-center">
            <h2 className="text-2xl font-bold mb-4 text-white dark:text-eco-green">Become a Volunteer</h2>
            <p className="text-white dark:text-eco-green mb-6">Join our team and help rescue food, support communities, and make a real impact.</p>
            <button className="bg-white dark:bg-eco-green text-eco-green dark:text-eco-yellow font-bold px-8 py-3 rounded-full shadow hover:bg-gray-100 dark:hover:bg-eco-yellow hover:text-eco-green transition text-lg">Sign Up to Volunteer</button>
          </section>
        )}

        {/* Testimonial Quotes */}
        <section className="py-12 bg-white dark:bg-gray-800 text-center">
          <h2 className="text-2xl font-bold mb-8 text-eco-green dark:text-eco-yellow">What People Are Saying</h2>
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8 items-center justify-center">
            {testimonials.map((t, i) => (
              <div key={i} className="flex-1 flex flex-col items-center bg-eco-green/10 dark:bg-eco-yellow/10 rounded-xl p-6 shadow">
                <img src={t.img} alt={t.name} className="w-16 h-16 rounded-full mb-2" />
                <div className="font-bold text-eco-green dark:text-eco-yellow">{t.name}</div>
                <div className="italic text-gray-700 dark:text-gray-200">"{t.quote}"</div>
              </div>
            ))}
          </div>
        </section>

        {/* Carbon Footprint Widget (placeholder) */}
        <section className="py-12 bg-gray-50 dark:bg-gray-900 text-center">
          <h2 className="text-2xl font-bold mb-4 text-eco-green dark:text-eco-yellow">Your Carbon Footprint</h2>
          <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="text-gray-700 dark:text-gray-200 mb-2">Calculate your carbon footprint and see how food waste reduction helps the planet.</div>
            <div className="bg-eco-green/10 dark:bg-eco-yellow/10 rounded-xl p-6 text-4xl text-eco-green dark:text-eco-yellow font-bold">[Widget Coming Soon]</div>
          </div>
        </section>

        {/* Downloadable Resources */}
        <section className="py-12 bg-white dark:bg-gray-800 text-center">
          <h2 className="text-2xl font-bold mb-4 text-eco-green dark:text-eco-yellow">Downloadable Resources</h2>
          <div className="max-w-2xl mx-auto flex flex-col md:flex-row gap-6 items-center justify-center">
            <a href="/assets/eco-guide.pdf" download className="bg-eco-green dark:bg-eco-yellow text-white dark:text-eco-green font-bold px-6 py-3 rounded-xl shadow hover:bg-eco-green/80 dark:hover:bg-yellow-300 transition">Eco Guide (PDF)</a>
            <a href="/assets/food-waste-tips.pdf" download className="bg-eco-green dark:bg-eco-yellow text-white dark:text-eco-green font-bold px-6 py-3 rounded-xl shadow hover:bg-eco-green/80 dark:hover:bg-yellow-300 transition">Food Waste Tips (PDF)</a>
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="py-12 bg-gray-50 dark:bg-gray-900 text-center">
          <h2 className="text-2xl font-bold mb-4 text-eco-green dark:text-eco-yellow">Stay in the Loop</h2>
          <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <label className="block mb-2 text-gray-700 dark:text-gray-200 font-semibold">Sign up for our newsletter</label>
            <input type="email" placeholder="Your email address" className="w-full px-4 py-2 rounded border border-eco-green dark:border-eco-yellow mb-4" />
            <button className="w-full bg-eco-green dark:bg-eco-yellow text-white dark:text-eco-green font-bold py-2 rounded hover:bg-eco-green/80 dark:hover:bg-yellow-300 transition">Subscribe</button>
            <div className="mt-4 text-gray-500 dark:text-gray-400 text-sm">Get the latest news, tips, and offers from Eco Waste Hub.</div>
          </div>
        </section>
      </div>
    </>
  );
};

export default About; 
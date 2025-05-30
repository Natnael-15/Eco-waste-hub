import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaLeaf, FaAppleAlt, FaCarrot, FaHandHoldingHeart } from 'react-icons/fa';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { ASSETS } from '../constants/images';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';

const socialProof = [
  { name: 'Sarah', type: 'Volunteer', img: ASSETS.USER_ICON },
  { name: 'Green Bakery', type: 'Partner', img: ASSETS.GALLERY.IMAGE2_THUMB },
  { name: 'Hope Shelter', type: 'Charity', img: ASSETS.GALLERY.IMAGE3_THUMB },
  { name: 'James', type: 'Volunteer', img: ASSETS.USER_ICON },
  { name: 'Fresh Farms', type: 'Partner', img: ASSETS.GALLERY.IMAGE1_THUMB },
];

const featuredProducts = [
  {
    name: 'Organic Veg Box',
    price: 15.99,
    image: ASSETS.DEALS.DEAL1,
    desc: 'Fresh, rescued organic vegetables.'
  },
  {
    name: 'Bakery Bundle',
    price: 8.99,
    image: ASSETS.DEALS.DEAL2,
    desc: 'Assorted bread and pastries.'
  },
  {
    name: 'Fruit Rescue',
    price: 12.99,
    image: ASSETS.DEALS.DEAL3,
    desc: 'Seasonal fruits, perfectly ripe.'
  }
];

const galleryImages = [
  { src: ASSETS.GALLERY.IMAGE1, thumb: ASSETS.GALLERY.IMAGE1_THUMB, alt: 'Community event 1' },
  { src: ASSETS.GALLERY.IMAGE2, thumb: ASSETS.GALLERY.IMAGE2_THUMB, alt: 'Community event 2' },
  { src: ASSETS.GALLERY.IMAGE3, thumb: ASSETS.GALLERY.IMAGE3_THUMB, alt: 'Community event 3' },
];

const steps = [
  {
    icon: '🤝',
    title: 'Partner',
    desc: 'We team up with local food businesses.'
  },
  {
    icon: '🚚',
    title: 'Rescue',
    desc: 'We collect surplus food before it goes to waste.'
  },
  {
    icon: '🛒',
    title: 'Shop',
    desc: 'You buy quality food at a discount.'
  },
  {
    icon: '💚',
    title: 'Impact',
    desc: 'Communities benefit, waste is reduced.'
  }
];

const impactStats = [
  { icon: '🍽️', value: '10,000+', label: 'Meals Provided' },
  { icon: '🤝', value: '500', label: 'Partners' },
  { icon: '🙋‍♂️', value: '1,000', label: 'Volunteers' },
  { icon: '🥕', value: '5,000', label: 'Pounds Rescued' },
];

const testimonials = [
  {
    quote: '“Joining Eco Waste Hub was the best decision for our business and our community. We see the impact every day!”',
    name: 'Olivia R.',
    role: 'Local Partner',
    image: ASSETS.GALLERY.IMAGE2_THUMB,
  },
  {
    quote: '“I love volunteering here. The team is amazing and the impact is real!”',
    name: 'James K.',
    role: 'Volunteer',
    image: ASSETS.GALLERY.IMAGE1_THUMB,
  },
  {
    quote: "“We've received fresh food for our center thanks to this initiative.”",
    name: 'Helen T.',
    role: 'Community Center',
    image: ASSETS.GALLERY.IMAGE3_THUMB,
  },
];

const liveFeed = [
  { time: 'Just now', text: 'Rescued 50kg of bread from Green Bakery.' },
  { time: '2 min ago', text: 'Donated 30 meal kits to Hope Shelter.' },
  { time: '5 min ago', text: 'Volunteer Sarah joined the team!' },
  { time: '10 min ago', text: 'Partnered with Fresh Farms for weekly pickups.' },
  { time: '15 min ago', text: 'Rescued 100kg of produce from City Market.' },
];

// Mock map data
const mapMarkers = [
  { position: [51.5074, -0.1278], label: 'Green Bakery', desc: '50kg bread rescued' },
  { position: [51.515, -0.13], label: 'Hope Shelter', desc: '30 meal kits donated' },
  { position: [51.51, -0.12], label: 'Fresh Farms', desc: 'New partner' },
  { position: [51.505, -0.09], label: 'City Market', desc: '100kg produce rescued' },
];

// Animated Counter component
const Counter: React.FC<{ end: number; duration?: number; prefix?: string; suffix?: string }> = ({ end, duration = 1500, prefix = '', suffix = '' }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current || hasAnimated) return;
      const rect = ref.current.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        setHasAnimated(true);
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasAnimated]);

  useEffect(() => {
    if (!hasAnimated) return;
    let start = 0;
    const increment = end / (duration / 16);
    let frame: number;
    const animate = () => {
      start += increment;
      if (start < end) {
        setCount(Math.floor(start));
        frame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };
    animate();
    return () => cancelAnimationFrame(frame);
  }, [end, duration, hasAnimated]);

  return (
    <div ref={ref} className="text-3xl font-bold text-eco-yellow mb-1 font-playfair">
      {prefix}{count.toLocaleString()}{suffix}
    </div>
  );
};

// Testimonial Carousel
const TestimonialCarousel: React.FC = () => {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setIndex(i => (i + 1) % testimonials.length), 5000);
    return () => clearInterval(timer);
  }, []);
  const t = testimonials[index];
  return (
    <div className="flex flex-col items-center justify-center mt-8 animate-fade-in">
      <img src={t.image} alt={t.name} className="w-16 h-16 object-cover rounded-full mx-auto mb-2 border-4 border-eco-yellow" />
      <div className="italic text-white/90 mb-1 transition-all duration-500">{t.quote}</div>
      <div className="font-bold text-eco-yellow">{t.name}</div>
      <div className="text-sm text-white/70">{t.role}</div>
      <div className="flex gap-2 mt-2">
        {testimonials.map((_, i) => (
          <button key={i} onClick={() => setIndex(i)} className={`w-2 h-2 rounded-full ${i === index ? 'bg-eco-yellow' : 'bg-white/40'} transition`} />
        ))}
      </div>
    </div>
  );
};

// Live Feed Ticker
const LiveFeed: React.FC = () => {
  const [feedIndex, setFeedIndex] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setFeedIndex(i => (i + 1) % liveFeed.length), 3500);
    return () => clearInterval(timer);
  }, []);
  return (
    <div className="w-full bg-eco-green/90 text-white rounded-xl shadow p-3 flex items-center gap-3 overflow-hidden animate-fade-in mb-8">
      <span className="bg-eco-yellow text-eco-green font-bold px-3 py-1 rounded-full text-xs">Live Feed</span>
      <span className="whitespace-nowrap animate-slide-up text-sm">{liveFeed[feedIndex].time} — {liveFeed[feedIndex].text}</span>
    </div>
  );
};

// Animated Eco Particles for Hero
const EcoParticles: React.FC = () => (
  <>
    <FaLeaf className="text-eco-yellow opacity-60 absolute left-10 top-10 animate-float-slow text-4xl" />
    <FaAppleAlt className="text-white opacity-40 absolute right-16 top-24 animate-float-fast text-3xl" />
    <FaCarrot className="text-eco-yellow opacity-50 absolute left-1/4 bottom-10 animate-float-medium text-3xl" />
    <FaHandHoldingHeart className="text-white opacity-30 absolute right-1/4 bottom-20 animate-float-slow text-5xl" />
  </>
);

// Progress bar/goal tracker data
const goal = 10000;
const current = 7500;

const spotlights = [
  {
    name: 'Sarah M.',
    role: 'Volunteer',
    image: ASSETS.GALLERY.IMAGE1_THUMB,
    quote: '“Volunteering here has been so rewarding. I love seeing the smiles we bring!”',
  },
  {
    name: 'Green Bakery',
    role: 'Partner',
    image: ASSETS.GALLERY.IMAGE2_THUMB,
    quote: "“We're proud to donate our surplus and help the community.”",
  },
  {
    name: 'Hope Shelter',
    role: 'Charity Partner',
    image: ASSETS.GALLERY.IMAGE3_THUMB,
    quote: '“The fresh food we receive makes a real difference for our guests.”',
  },
];

const ecoTips = [
  'Store fruits and veggies properly to make them last longer.',
  'Plan your meals to reduce food waste and save money.',
  'Compost food scraps to enrich soil and reduce landfill waste.',
  'Support local farmers and food rescue initiatives.',
  'Use leftovers creatively for new meals!',
];

const SpotlightCard: React.FC = () => {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setIndex(i => (i + 1) % spotlights.length), 6000);
    return () => clearInterval(timer);
  }, []);
  const s = spotlights[index];
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center text-center max-w-md mx-auto animate-fade-in">
      <img src={s.image} alt={s.name} className="w-20 h-20 object-cover rounded-full mb-3 border-4 border-eco-yellow" />
      <div className="text-xl font-bold text-eco-green mb-1 font-playfair">{s.name}</div>
      <div className="text-sm text-gray-500 mb-2">{s.role}</div>
      <div className="italic text-gray-700 mb-2">{s.quote}</div>
      <div className="flex gap-2 mt-2">
        {spotlights.map((_, i) => (
          <button key={i} onClick={() => setIndex(i)} className={`w-2 h-2 rounded-full ${i === index ? 'bg-eco-yellow' : 'bg-eco-green/30'} transition`} />
        ))}
      </div>
    </div>
  );
};

const EcoTip: React.FC = () => {
  const [tip, setTip] = useState(ecoTips[Math.floor(Math.random() * ecoTips.length)]);
  useEffect(() => {
    const timer = setInterval(() => {
      setTip(ecoTips[Math.floor(Math.random() * ecoTips.length)]);
    }, 10000);
    return () => clearInterval(timer);
  }, []);
  return (
    <div className="bg-eco-yellow/90 text-eco-green rounded-xl shadow p-4 flex items-center gap-3 max-w-xl mx-auto mt-10 animate-fade-in">
      <span className="text-2xl">🌱</span>
      <span className="font-semibold">Eco Tip:</span>
      <span>{tip}</span>
    </div>
  );
};

// Social Proof Bar with animation and tooltips
const SocialProofBar: React.FC = () => {
  const [offset, setOffset] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  // Duplicate the list for seamless looping
  const items = [...socialProof, ...socialProof];
  useEffect(() => {
    const interval = setInterval(() => {
      setOffset(prev => {
        const width = scrollRef.current?.scrollWidth || 0;
        const containerWidth = scrollRef.current?.offsetWidth || 1;
        // Reset when scrolled past half (since we doubled the list)
        if (prev >= width / 2) return 0;
        return prev + 1;
      });
    }, 16); // ~60fps
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="fixed top-0 left-0 w-screen z-30 bg-transparent overflow-x-hidden" style={{ height: 56 }}>
      {/* Animated gradient background */}
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-eco-green/80 via-eco-yellow/20 to-eco-green/80 animate-gradient-x" />
      <div
        ref={scrollRef}
        className="flex items-center gap-8 h-14 relative z-10 whitespace-nowrap"
        style={{
          transform: `translateX(-${offset}px)`,
          transition: 'transform 0.1s linear',
          willChange: 'transform',
        }}
      >
        <span className="text-eco-green dark:text-eco-yellow font-semibold text-sm mr-2 whitespace-nowrap">Just joined:</span>
        {items.map((p, i) => (
          <div
            key={i}
            className="flex flex-col items-center mx-2 group cursor-pointer transition-transform duration-300 hover:scale-110"
          >
            <div className="relative">
              <img
                src={p.img}
                alt={p.name}
                className="w-8 h-8 rounded-full border-2 border-eco-yellow object-cover shadow-lg animate-pulse group-hover:animate-none"
                style={{ animationDelay: `${(i % socialProof.length) * 0.2}s` }}
              />
              {/* Tooltip */}
              <div className="absolute left-1/2 -translate-x-1/2 top-10 bg-gray-900 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-20 shadow-lg">
                {p.name} <span className="text-eco-yellow">– {p.type}</span>
              </div>
            </div>
            <span className="text-xs text-eco-green dark:text-eco-yellow font-bold mt-1 animate-fade-in" style={{ animationDelay: `${(i % socialProof.length) * 0.2}s` }}>{p.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

interface HomeProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const Home: React.FC<HomeProps> = ({ darkMode, toggleDarkMode }) => {
  const { user } = useAuth();
  return (
    <>
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 pt-20">
        {/* Social Proof Bar */}
        <SocialProofBar />
      {/* Hero Section with Gallery Image */}
      <section className="relative min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-eco-green via-eco-green/80 to-eco-green/60 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
        <div className="absolute inset-0 bg-[url('/assets/gallery1.jpeg')] bg-cover bg-center opacity-40 mix-blend-multiply"></div>
        {/* Animated Eco Particles */}
        <EcoParticles />
        <div className="relative z-10 max-w-2xl mx-auto text-center py-20 px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-5xl md:text-6xl font-bold font-playfair text-white mb-6 drop-shadow-lg"
          >
            Reduce Waste, Save Money
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl md:text-2xl text-white/90 mb-8 font-medium drop-shadow"
          >
            Join our community of eco-conscious individuals and businesses working together to reduce food waste and promote sustainability.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/shop"
              className="bg-eco-yellow text-eco-green font-bold px-8 py-3 rounded-full shadow hover:bg-yellow-300 transition animate-pulse"
            >
              Shop Now
            </Link>
            <Link
              to="/about"
              className="bg-white/80 dark:bg-gray-800 text-eco-green font-bold px-8 py-3 rounded-full shadow hover:bg-white dark:hover:bg-gray-700 transition border border-eco-green"
            >
              Learn More
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Live Feed Section */}
      <div className="max-w-5xl mx-auto px-4">
        <LiveFeed />
      </div>

      {/* Gallery Section */}
      <section className="py-12 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold font-playfair text-eco-green dark:text-eco-yellow text-center mb-2">Our Community in Action</h2>
          <p className="text-center text-gray-600 dark:text-gray-200 mb-8">Snapshots from our food rescue events, volunteers, and happy recipients. <span className="font-semibold text-eco-green dark:text-eco-yellow">Be part of the story!</span></p>
          <div className="flex flex-wrap justify-center gap-6 animate-fade-in">
            {galleryImages.map(img => (
              <a key={img.src} href={img.src} target="_blank" rel="noopener noreferrer" className="block group relative">
                <img src={img.thumb} alt={img.alt} className="w-40 h-28 object-cover rounded-lg shadow group-hover:scale-105 transition" />
                <div className="absolute inset-0 bg-eco-green/60 dark:bg-gray-800/80 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-lg transition">
                  <span className="text-white font-bold">View</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Map Preview Section */}
      <section className="py-10 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold font-playfair text-eco-green dark:text-eco-yellow text-center mb-4">Where We Make an Impact</h2>
          <p className="text-center text-gray-600 dark:text-gray-200 mb-6">See some of our recent rescues and partners on the map.</p>
          <div className="rounded-2xl shadow-xl overflow-hidden border border-eco-green/20 dark:border-gray-700">
            <MapContainer center={[51.5074, -0.1278]} zoom={12} scrollWheelZoom={false} style={{ height: 320, width: '100%' }}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {mapMarkers.map((m, i) => (
                <Marker key={i} position={m.position}>
                  <Popup>
                    <b>{m.label}</b><br />{m.desc}
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>
      </section>

      {/* Goal Tracker Section */}
      <section className="py-8 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-eco-green/90 dark:bg-gray-800 rounded-2xl shadow-xl p-8 flex flex-col items-center text-center">
            <h2 className="text-2xl font-bold text-white dark:text-eco-yellow mb-2 font-playfair">This Month's Meals Rescued</h2>
            <div className="text-3xl font-bold text-eco-yellow mb-2">{current.toLocaleString()}<span className="text-white dark:text-eco-yellow text-lg font-normal"> / {goal.toLocaleString()}</span></div>
            <div className="w-full bg-white/30 dark:bg-gray-700 rounded-full h-5 mb-2 overflow-hidden">
              <div
                className="bg-eco-yellow h-5 rounded-full transition-all duration-1000"
                style={{ width: `${Math.min((current / goal) * 100, 100)}%` }}
              ></div>
            </div>
            <div className="text-white dark:text-eco-yellow text-sm">Goal: {goal.toLocaleString()} meals</div>
          </div>
        </div>
      </section>

      {/* Spotlight Section */}
      <section className="py-8 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-eco-green dark:text-eco-yellow text-center mb-6 font-playfair">Spotlight</h2>
          <SpotlightCard />
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-16 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold font-playfair text-eco-green dark:text-eco-yellow text-center mb-2">Our Impact</h2>
          <p className="text-center text-gray-600 dark:text-gray-200 mb-8">Every meal, every pound rescued, every partner and volunteer makes a difference. <span className="font-semibold text-eco-green dark:text-eco-yellow">Here's what we've achieved together:</span></p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {impactStats.map(stat => (
              <div key={stat.label} className="bg-eco-green/90 dark:bg-gray-800 text-white dark:text-eco-yellow rounded-xl p-6 text-center shadow hover:scale-105 transition-transform duration-300 flex flex-col items-center">
                <div className="text-3xl mb-2">{stat.icon}</div>
                <Counter end={Number(stat.value.replace(/[^\d]/g, ''))} suffix={stat.value.match(/\D+$/)?.[0] || ''} />
                <div className="text-lg font-semibold mb-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <EcoTip />

      {/* Shop Preview Section */}
      <section className="py-16 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
            <h2 className="text-3xl md:text-4xl font-bold font-playfair text-eco-green dark:text-eco-yellow">Featured Food Deals</h2>
            <Link to="/shop" className="bg-eco-yellow text-eco-green font-bold px-6 py-2 rounded-full shadow hover:bg-yellow-300 transition text-center">View All</Link>
          </div>
          <div className="flex overflow-x-auto gap-8 pb-2 md:grid md:grid-cols-3 md:gap-8 md:overflow-visible">
            {featuredProducts.map((prod, i) => (
              <div key={prod.name} className="bg-gray-50 dark:bg-gray-800 min-w-[260px] md:min-w-0 rounded-xl shadow p-6 flex flex-col items-center text-center hover:shadow-lg transition relative">
                <span className="absolute top-4 left-4 bg-eco-yellow text-eco-green text-xs font-bold px-3 py-1 rounded-full shadow">Featured</span>
                <img src={prod.image} alt={prod.name} className="w-32 h-24 object-cover rounded mb-3" />
                <div className="text-xl font-bold text-eco-green dark:text-eco-yellow mb-1 font-playfair">{prod.name}</div>
                <div className="text-gray-600 dark:text-gray-200 mb-2">{prod.desc}</div>
                <div className="text-lg font-bold text-eco-yellow mb-3">£{prod.price.toFixed(2)}</div>
                <div className="flex gap-2">
                  <Link to="/shop" className="bg-white dark:bg-gray-900 border border-eco-green text-eco-green dark:text-eco-yellow px-4 py-2 rounded-full font-semibold hover:bg-eco-green hover:text-white dark:hover:bg-eco-yellow dark:hover:text-eco-green transition">View Details</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-eco-green dark:bg-gray-900 relative overflow-hidden transition-colors duration-300">
        <div className="absolute inset-0 bg-[url('/assets/pattern.svg')] opacity-10 pointer-events-none"></div>
        <div className="max-w-3xl mx-auto text-center px-4 relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold font-playfair text-white dark:text-eco-yellow mb-6">Ready to Make a Difference?</h2>
          <p className="text-lg text-white/90 dark:text-eco-yellow/90 mb-8">Join Eco Waste Hub and help us rescue food, support communities, and build a more sustainable future.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            {!user && (
              <Link to="/join-us" className="bg-eco-yellow text-eco-green font-bold px-8 py-3 rounded-full shadow hover:bg-yellow-300 transition">Join Us</Link>
            )}
            <Link to="/donate" className="bg-white/80 dark:bg-gray-800 text-eco-green dark:text-eco-yellow font-bold px-8 py-3 rounded-full shadow hover:bg-white dark:hover:bg-gray-700 transition border border-eco-green">Donate</Link>
          </div>
          <TestimonialCarousel />
        </div>
      </section>
    </div>
    </>
  );
};

export default Home; 
import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Navbar from '../components/Navbar';

const LONDON_COORDS = [51.5074, -0.1278];

const socialLinks = [
  { icon: '/assets/instagram-icon.png', alt: 'Instagram', href: 'https://instagram.com/' },
  { icon: '/assets/twitter-icon.png', alt: 'Twitter', href: 'https://twitter.com/' },
  { icon: '/assets/facebook-icon.png', alt: 'Facebook', href: 'https://facebook.com/' },
];

interface ContactProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const Contact: React.FC<ContactProps> = ({ darkMode, toggleDarkMode }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // TODO: Implement contact form submission
      console.log('Contact form submission:', formData);
      setSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setError('Failed to send message. Please try again.');
      console.error('Contact form error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <>
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 py-24 px-4 flex flex-col items-center pt-24">
      {/* Hero Section */}
        <section className="relative min-h-[35vh] flex items-center justify-center bg-gradient-to-br from-eco-green via-eco-green/80 to-eco-green/60 dark:from-gray-900 dark:via-gray-900/90 dark:to-gray-900 transition-colors duration-300 mb-12 rounded-3xl shadow-xl w-full max-w-7xl mx-auto">
        <div className="absolute inset-0 bg-[url('/assets/gallery1.jpeg')] bg-cover bg-center opacity-30 mix-blend-multiply dark:opacity-40"></div>
        <div className="relative z-10 max-w-2xl mx-auto text-center py-10 px-4 flex flex-col items-center">
          <div className="bg-eco-yellow/90 rounded-full w-16 h-16 flex items-center justify-center mb-4 shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-eco-green" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10.5a8.38 8.38 0 01-.9 3.8c-.6 1.2-1.5 2.3-2.6 3.2-1.1.9-2.4 1.5-3.8 1.5s-2.7-.6-3.8-1.5c-1.1-.9-2-2-2.6-3.2A8.38 8.38 0 013 10.5C3 6.4 6.4 3 10.5 3S18 6.4 18 10.5z" /></svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-playfair text-white dark:text-eco-yellow mb-3 drop-shadow-lg">Contact Us</h1>
          <p className="text-lg text-white/90 dark:text-eco-yellow/90 mb-2">We'd love to hear from you! Reach out with questions, feedback, or partnership ideas.</p>
        </div>
      </section>

      {/* Contact Form & Info */}
        <section className="py-16 bg-white/80 dark:bg-gray-900/80 transition-colors duration-300 rounded-3xl shadow-xl w-full max-w-7xl mx-auto mb-12">
          <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center min-h-[480px]">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl shadow-lg p-10">
            <h2 className="text-2xl font-bold text-eco-green dark:text-eco-yellow mb-6 font-playfair">Send Us a Message</h2>
            <p className="text-gray-500 dark:text-eco-yellow/70 mb-6 text-sm">We reply within 1 business day.</p>
            {success ? (
              <div className="text-green-700 dark:text-eco-yellow text-center py-8">
                <div className="text-4xl mb-2">✅</div>
                <div className="text-xl font-bold mb-2">Thank you!</div>
                <div>Your message has been sent. We'll get back to you soon.</div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="peer w-full p-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-eco-green dark:focus:border-eco-yellow focus:ring-2 focus:ring-eco-green/20 dark:focus:ring-eco-yellow/20 transition placeholder-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-eco-yellow"
                    placeholder="Name"
                  />
                  <label className="absolute left-3 top-3 text-gray-500 dark:text-eco-yellow/70 pointer-events-none transition-all duration-200 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:-top-4 peer-focus:text-xs peer-focus:text-eco-green dark:peer-focus:text-eco-yellow bg-gray-50 dark:bg-gray-900 px-1">Name</label>
                </div>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="peer w-full p-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-eco-green dark:focus:border-eco-yellow focus:ring-2 focus:ring-eco-green/20 dark:focus:ring-eco-yellow/20 transition placeholder-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-eco-yellow"
                    placeholder="Email"
                  />
                  <label className="absolute left-3 top-3 text-gray-500 dark:text-eco-yellow/70 pointer-events-none transition-all duration-200 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:-top-4 peer-focus:text-xs peer-focus:text-eco-green dark:peer-focus:text-eco-yellow bg-gray-50 dark:bg-gray-900 px-1">Email</label>
                </div>
                <div className="relative">
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="peer w-full p-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-eco-green dark:focus:border-eco-yellow focus:ring-2 focus:ring-eco-green/20 dark:focus:ring-eco-yellow/20 transition bg-white dark:bg-gray-900 text-gray-900 dark:text-eco-yellow"
                  >
                    <option value="" disabled>Select a subject</option>
                    <option value="General">General</option>
                    <option value="Partnership">Partnership</option>
                    <option value="Support">Support</option>
                  </select>
                  <label className="absolute left-3 -top-4 text-xs text-eco-green dark:text-eco-yellow bg-gray-50 dark:bg-gray-900 px-1">Subject</label>
                </div>
                <div className="relative">
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="peer w-full p-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-eco-green dark:focus:border-eco-yellow focus:ring-2 focus:ring-eco-green/20 dark:focus:ring-eco-yellow/20 transition placeholder-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-eco-yellow"
                    placeholder="Message"
                  />
                  <label className="absolute left-3 top-3 text-gray-500 dark:text-eco-yellow/70 pointer-events-none transition-all duration-200 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:-top-4 peer-focus:text-xs peer-focus:text-eco-green dark:peer-focus:text-eco-yellow bg-gray-50 dark:bg-gray-900 px-1">Message</label>
                </div>
                {error && (
                  <div className="text-red-500 text-sm">{error}</div>
                )}
                <button type="submit" className="w-full bg-eco-yellow text-eco-green font-bold py-3 rounded-lg hover:bg-yellow-300 dark:hover:bg-eco-yellow/80 dark:bg-eco-yellow dark:text-gray-900 transition" disabled={loading}>
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>

          {/* Contact Info & Map */}
            <div className="flex flex-col gap-10">
              <div className="bg-eco-green/90 dark:bg-gray-800 text-white dark:text-eco-yellow rounded-2xl shadow-lg p-10 flex flex-col gap-4">
              <h2 className="text-xl font-bold font-playfair mb-2">Contact Information</h2>
              <div className="flex items-center gap-2"><span className="inline-block w-6 text-center">📧</span><span className="font-bold">Email:</span> <a href="mailto:info@ecowastehub.org" className="underline hover:text-eco-yellow dark:hover:text-white">info@ecowastehub.org</a></div>
              <div className="flex items-center gap-2"><span className="inline-block w-6 text-center">📞</span><span className="font-bold">Phone:</span> <a href="tel:+441234567890" className="underline hover:text-eco-yellow dark:hover:text-white">+44 1234 567890</a></div>
              <div className="flex items-center gap-2"><span className="inline-block w-6 text-center">📍</span><span className="font-bold">Address:</span> 123 Green Lane, London, UK</div>
              <div className="flex gap-4 mt-4">
                {socialLinks.map(link => (
                  <a key={link.alt} href={link.href} target="_blank" rel="noopener noreferrer" className="inline-block">
                    <img src={link.icon} alt={link.alt} className="w-7 h-7 rounded-full bg-white dark:bg-gray-900 p-1 shadow hover:scale-110 transition" />
                  </a>
                ))}
              </div>
            </div>
              <div className="rounded-2xl shadow-lg overflow-hidden">
                <MapContainer center={LONDON_COORDS} zoom={13} scrollWheelZoom={true} className="w-full h-56 rounded-2xl">
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={LONDON_COORDS}>
                  <Popup>
                    123 Green Lane, London, UK
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>
        </div>
      </section>
    </div>
    </>
  );
};

export default Contact; 
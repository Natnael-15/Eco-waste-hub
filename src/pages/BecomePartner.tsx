import React, { useState } from 'react';

const BecomePartner: React.FC = () => {
  const [form, setForm] = useState({ name: '', organization: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.organization || !form.email || !form.message) {
      setError('Please fill in all fields.');
      return;
    }
    setSubmitted(true);
    // Here you would send the form data to your backend
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-12">
      <div className="bg-white rounded-2xl shadow-xl p-10 max-w-2xl w-full text-center">
        <h1 className="text-4xl font-bold text-eco-green font-playfair mb-4">Become a Partner</h1>
        <p className="text-lg text-gray-700 mb-6">Join our network of businesses, charities, and organizations making a real impact in reducing food waste and supporting communities. As a partner, you'll benefit from:</p>
        <ul className="list-disc list-inside text-left text-gray-700 mb-6">
          <li>Positive community and environmental impact</li>
          <li>Recognition on our platform and social media</li>
          <li>Access to partnership resources and events</li>
          <li>Opportunities for collaboration and growth</li>
        </ul>
        {submitted ? (
          <div className="text-green-700 text-lg font-bold py-8">Thank you for your interest! We'll be in touch soon.</div>
        ) : (
          <form className="space-y-5 text-left" onSubmit={handleSubmit}>
            <input type="text" name="name" placeholder="Your Name" value={form.name} onChange={handleChange} className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-eco-green focus:ring-2 focus:ring-eco-green/20 transition" />
            <input type="text" name="organization" placeholder="Organization" value={form.organization} onChange={handleChange} className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-eco-green focus:ring-2 focus:ring-eco-green/20 transition" />
            <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-eco-green focus:ring-2 focus:ring-eco-green/20 transition" />
            <textarea name="message" placeholder="Tell us about your organization and why you want to partner" value={form.message} onChange={handleChange} className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-eco-green focus:ring-2 focus:ring-eco-green/20 transition min-h-[100px]" />
            {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
            <button type="submit" className="w-full bg-eco-yellow text-eco-green font-bold py-3 rounded-lg hover:bg-yellow-300 transition text-lg">Submit Inquiry</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default BecomePartner; 
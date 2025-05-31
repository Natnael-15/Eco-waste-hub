import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const SignUp: React.FC = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const { signUp } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validate all fields are filled
    if (!form.name || !form.email || !form.password || !form.confirm) {
      setError('Please fill in all fields.');
      return;
    }

    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const normalizedEmail = form.email.trim().toLowerCase();
    
    if (!emailRegex.test(normalizedEmail)) {
      setError('Please enter a valid email address (e.g., user@example.com)');
      return;
    }

    // Validate password match
    if (form.password !== form.confirm) {
      setError('Passwords do not match.');
      return;
    }

    // Validate password length
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    try {
      await signUp(normalizedEmail, form.password, form.name);
      setSubmitted(true);
    } catch (err: any) {
      console.error('Signup error:', err);
      setError(err.message || 'An error occurred during signup. Please try again.');
    }
  };

  // Redirect to login after successful signup
  useEffect(() => {
    if (submitted) {
      const timer = setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [submitted]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950 transition-colors duration-300 px-4">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-10 max-w-md w-full text-center">
          <h1 className="text-3xl font-bold text-eco-green dark:text-eco-yellow font-playfair mb-4">Create Your Account</h1>
          <p className="text-gray-600 dark:text-eco-yellow/80 mb-6">Sign up to join our mission and make a difference!</p>
          {submitted ? (
            <div className="text-green-700 dark:text-eco-yellow text-lg font-bold py-8">Account created! Redirecting you to the login page...</div>
          ) : (
            <form className="space-y-5" onSubmit={handleSubmit}>
              <input type="text" name="name" placeholder="Full Name" value={form.name} onChange={handleChange} className="w-full p-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-eco-green dark:focus:border-eco-yellow focus:ring-2 focus:ring-eco-green/20 dark:focus:ring-eco-yellow/20 transition bg-white dark:bg-gray-900 text-gray-900 dark:text-eco-yellow" />
              <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} className="w-full p-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-eco-green dark:focus:border-eco-yellow focus:ring-2 focus:ring-eco-green/20 dark:focus:ring-eco-yellow/20 transition bg-white dark:bg-gray-900 text-gray-900 dark:text-eco-yellow" />
              <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} className="w-full p-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-eco-green dark:focus:border-eco-yellow focus:ring-2 focus:ring-eco-green/20 dark:focus:ring-eco-yellow/20 transition bg-white dark:bg-gray-900 text-gray-900 dark:text-eco-yellow" />
              <input type="password" name="confirm" placeholder="Confirm Password" value={form.confirm} onChange={handleChange} className="w-full p-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-eco-green dark:focus:border-eco-yellow focus:ring-2 focus:ring-eco-green/20 dark:focus:ring-eco-yellow/20 transition bg-white dark:bg-gray-900 text-gray-900 dark:text-eco-yellow" />
              {error && <div className="text-red-600 dark:text-red-400 text-sm mb-2">{error}</div>}
              <button type="submit" className="w-full bg-eco-yellow text-eco-green font-bold py-3 rounded-lg hover:bg-yellow-300 dark:hover:bg-eco-yellow/80 dark:bg-eco-yellow dark:text-gray-900 transition text-lg">Sign Up</button>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default SignUp; 
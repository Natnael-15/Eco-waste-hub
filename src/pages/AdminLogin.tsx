import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserShield, FaEnvelope, FaLock, FaSpinner, FaLeaf } from 'react-icons/fa';
import { supabase } from '../lib/supabase';

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // Sign in with Supabase
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (loginError) throw loginError;
      // Check role in profiles table
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();
      if (profileError) throw profileError;
      if (!profile || profile.role !== 'admin') {
        setError('You are not authorized to access the admin dashboard.');
        setLoading(false);
        await supabase.auth.signOut();
        return;
      }
      // Success: redirect to admin dashboard
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'Login failed.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-eco-green via-amber-50 to-emerald-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-900 p-10 rounded-2xl shadow-2xl border-4 border-eco-green dark:border-eco-yellow animate-fade-in">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-eco-green dark:bg-eco-yellow rounded-full w-16 h-16 flex items-center justify-center mb-2 shadow-lg animate-bounce">
            <FaUserShield className="text-white dark:text-eco-green text-3xl" />
          </div>
          <h2 className="text-3xl font-extrabold text-eco-green dark:text-eco-yellow font-playfair">Admin Login</h2>
          <p className="text-gray-500 dark:text-gray-300 mt-2 text-center">Sign in to access the admin dashboard</p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm animate-shake">
              {error}
            </div>
          )}
          <div>
            <label htmlFor="email" className="sr-only">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-3 pl-10 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-eco-yellow rounded-t-md focus:outline-none focus:ring-eco-green dark:focus:ring-eco-yellow focus:border-eco-green dark:focus:border-eco-yellow focus:z-10 sm:text-sm bg-white dark:bg-gray-900"
                placeholder="Admin email address"
              />
            </div>
          </div>
          <div>
            <label htmlFor="password" className="sr-only">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-3 pl-10 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-eco-yellow rounded-b-md focus:outline-none focus:ring-eco-green dark:focus:ring-eco-yellow focus:border-eco-green dark:focus:border-eco-yellow focus:z-10 sm:text-sm bg-white dark:bg-gray-900"
                placeholder="Password"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-eco-green dark:bg-eco-yellow hover:bg-eco-yellow hover:text-eco-green dark:hover:bg-eco-green dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-eco-green dark:focus:ring-eco-yellow transition-colors duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? <FaSpinner className="animate-spin h-5 w-5" /> : 'Sign in as Admin'}
          </button>
        </form>
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/login')}
            className="text-eco-green dark:text-eco-yellow hover:underline hover:text-eco-yellow dark:hover:text-eco-green text-sm font-semibold transition-colors duration-200"
          >
            Not an admin? Go to user login
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin; 
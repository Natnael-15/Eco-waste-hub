import React, { useState, useEffect } from 'react';
import { FaUserCircle, FaSignOutAlt, FaEnvelope, FaEdit, FaCalendarAlt, FaKey, FaHistory, FaShoppingBag, FaUser, FaLock, FaShoppingCart, FaChevronRight, FaPhone } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Navigate } from 'react-router-dom';
import GoodbyeModal from '../components/GoodbyeModal';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';

interface OrderItem {
  id: string;
  product_id: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

interface Order {
  order_id: string;
  total: number;
  status: string;
  created_at: string;
  items: OrderItem[];
}

interface AccountProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const Account: React.FC<AccountProps> = ({ darkMode, toggleDarkMode }) => {
  const { user, profile, updateProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [showGoodbye, setShowGoodbye] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setPhone(profile.phone || '');
    }
  }, [profile]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      try {
        setLoadingOrders(true);
        const { data, error } = await supabase.rpc('get_user_orders', {
          user_id: user.id
        });
        if (error) throw error;
        setOrders(data || []);
      } catch (err: any) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoadingOrders(false);
      }
    };
    fetchOrders();
  }, [user]);

  // Move the early return after all hooks
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleSave = async () => {
    setSaving(true);
    setSuccess('');
    setError('');
    try {
      const { error } = await supabase.rpc('update_user_profile', {
        user_id: user.id,
        new_full_name: fullName,
        new_phone: phone
      });

      if (error) throw error;
      
      setSuccess('Profile updated successfully!');
      setEditing(false);
    } catch (err: any) {
      setError(err.message || 'Error updating profile');
    } finally {
      setSaving(false);
      setTimeout(() => {
        setSuccess('');
        setError('');
      }, 3000);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordSuccess('');
    setPasswordError('');
    if (!currentPassword || !newPassword) {
      setPasswordError('Please fill in all fields.');
      return;
    }
    try {
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });
      if (loginError) throw new Error('Current password is incorrect.');
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      setPasswordSuccess('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err: any) {
      setPasswordError(err.message || 'Error updating password.');
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      setShowGoodbye(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      await logout();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Error logging out:', error);
      setShowGoodbye(false);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300 pt-20">
      {/* Header Section */}
      <div className="bg-eco-green dark:bg-gray-900 text-white p-6 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold font-playfair">Account Settings</h1>
              <p className="text-eco-yellow/90 mt-2">Manage your account preferences</p>
            </div>
            <button
              onClick={handleLogout}
              disabled={isLoading}
              className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition z-10 relative flex items-center gap-2 disabled:opacity-50"
            >
              <FaSignOutAlt />
              {isLoading ? 'Logging out...' : 'Log Out'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
            <div className="space-y-6">
              {/* Profile Section */}
              <div className="border-b dark:border-gray-700 pb-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Profile Information</h2>
                  <button
                    onClick={() => setEditing(!editing)}
                    className="text-eco-green dark:text-eco-yellow hover:opacity-80"
                  >
                    {editing ? 'Cancel' : 'Edit Profile'}
                  </button>
                </div>

                {editing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-eco-green dark:focus:ring-eco-yellow focus:border-eco-green dark:focus:border-eco-yellow bg-white dark:bg-gray-700"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-eco-green dark:focus:ring-eco-yellow focus:border-eco-green dark:focus:border-eco-yellow bg-white dark:bg-gray-700"
                      />
                    </div>
                    <div className="flex gap-4">
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-4 py-2 bg-eco-green dark:bg-eco-yellow text-white rounded-md hover:opacity-90 disabled:opacity-50"
                      >
                        {saving ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button
                        onClick={() => setEditing(false)}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        Cancel
                      </button>
                    </div>
                    {success && (
                      <p className="text-green-600 dark:text-green-400">{success}</p>
                    )}
                    {error && (
                      <p className="text-red-600 dark:text-red-400">{error}</p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <FaUser className="text-eco-green dark:text-eco-yellow" />
                      <span>{fullName || 'Not set'}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <FaPhone className="text-eco-green dark:text-eco-yellow" />
                      <span>{phone || 'Not set'}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Password Section */}
              <div className="border-b dark:border-gray-700 pb-6">
                <h2 className="text-xl font-semibold mb-4">Change Password</h2>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-eco-green dark:focus:ring-eco-yellow focus:border-eco-green dark:focus:border-eco-yellow bg-white dark:bg-gray-700"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-eco-green dark:focus:ring-eco-yellow focus:border-eco-green dark:focus:border-eco-yellow bg-white dark:bg-gray-700"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-eco-green dark:bg-eco-yellow text-white rounded-md hover:opacity-90"
                  >
                    Update Password
                  </button>
                  {passwordSuccess && (
                    <p className="text-green-600 dark:text-green-400">{passwordSuccess}</p>
                  )}
                  {passwordError && (
                    <p className="text-red-600 dark:text-red-400">{passwordError}</p>
                  )}
                </form>
              </div>

              {/* Account Information */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Account Information</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <FaEnvelope className="text-eco-green dark:text-eco-yellow" />
                    <span>{user.email}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      <GoodbyeModal isOpen={showGoodbye} userEmail={user.email || ''} />
    </div>
    </>
  );
};

export default Account; 
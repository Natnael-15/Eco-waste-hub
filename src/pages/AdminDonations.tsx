import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaHandHoldingHeart, FaDownload, FaSearch } from 'react-icons/fa';
import AdminFooter from '../components/AdminFooter';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import AdminNavbar from '../components/AdminNavbar';
import { useAdminTheme } from '../context/AdminThemeContext';

const FAKE_DONATIONS = Array.from({ length: 20 }, (_, i) => ({
  id: `DON-${2000 + i}`,
  user_id: `U-00${(i % 3) + 1}`,
  amount: Math.round(Math.random() * 20000) / 100,
  recurring: i % 2 === 0,
  created_at: new Date(Date.now() - 86400000 * (i % 12)).toISOString(),
  name: `Donor ${i + 1}`,
  message: i % 3 === 0 ? 'Thank you!' : '',
}));

// Helper to get chart data for last 7 days
function getDonationChartData(donations) {
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().slice(0, 10);
  });
  return days.map(day => ({
    day,
    donations: donations.filter(d => d.created_at.slice(0, 10) === day).length,
  }));
}

// Utility to clean up legacy localStorage keys for fake users, orders, and donations
function cleanupLegacyLocalStorage() {
  // Remove old fake users key(s)
  if (localStorage.getItem('users')) localStorage.removeItem('users');
  // Remove old fake orders key(s)
  if (localStorage.getItem('orders')) localStorage.removeItem('orders');
  // Remove old fake donations key(s)
  if (localStorage.getItem('donations')) localStorage.removeItem('donations');
}

const AdminDonations: React.FC = () => {
  const navigate = useNavigate();
  const [donations, setDonations] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState('created_at');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const { darkMode, toggleDarkMode } = useAdminTheme();

  // Automatic cleanup of legacy localStorage keys
  useEffect(() => {
    cleanupLegacyLocalStorage();
  }, []);

  // Inject fake data if empty
  useEffect(() => {
    localStorage.setItem('donations', JSON.stringify(FAKE_DONATIONS));
    setDonations(FAKE_DONATIONS);
  }, []);

  // Filter and sort
  const filtered = donations
    .filter(d =>
      d.id.toLowerCase().includes(search.toLowerCase()) ||
      (d.user_id && d.user_id.toLowerCase().includes(search.toLowerCase())) ||
      (d.name && d.name.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortKey === 'created_at') {
        return sortDir === 'asc'
          ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          : new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      if (sortKey === 'amount') {
        return sortDir === 'asc' ? a.amount - b.amount : b.amount - a.amount;
      }
      return 0;
    });

  // Export to CSV
  const exportCSV = () => {
    const header = 'Donation ID,User ID,Amount,Recurring,Date,Name,Message\n';
    const rows = filtered.map(d =>
      `${d.id},${d.user_id},${d.amount},${d.recurring ? 'Yes' : 'No'},${new Date(d.created_at).toLocaleString()},${d.name || ''},${d.message || ''}`
    );
    const csv = header + rows.join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'donations.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Stats
  const totalDonations = donations.length;
  const totalValue = donations.reduce((sum, d) => sum + (d.amount || 0), 0);

  const chartData = getDonationChartData(donations);

  return (
    <>
      <AdminNavbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <div className={`min-h-screen bg-gradient-to-br ${darkMode ? 'from-gray-950 via-gray-900 to-gray-950' : 'from-eco-green via-amber-50 to-emerald-100'} py-12 px-4 pb-32 pt-24`}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className={`max-w-6xl mx-auto ${darkMode ? 'bg-gray-900 border-eco-yellow' : 'bg-white border-eco-green'} rounded-2xl shadow-2xl border-4 p-8 relative`}>
          <button
            onClick={() => navigate('/admin')}
            className="absolute left-8 top-8 flex items-center gap-2 text-eco-green dark:text-eco-yellow font-bold hover:underline text-lg"
          >
            <FaArrowLeft /> Back to Dashboard
          </button>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4 mt-2">
            <h1 className="text-3xl font-bold text-eco-green dark:text-eco-yellow font-playfair flex items-center gap-2">
              <FaHandHoldingHeart className="text-eco-green dark:text-eco-yellow" /> Donations
              <span className="ml-3 px-3 py-1 bg-eco-yellow text-eco-green rounded-full text-xs font-bold animate-pulse">LIVE</span>
            </h1>
            <div className="flex gap-3 items-center">
              <button
                onClick={exportCSV}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-eco-green dark:bg-eco-yellow text-white dark:text-eco-green font-bold shadow hover:bg-eco-yellow hover:text-eco-green dark:hover:bg-eco-green dark:hover:text-eco-yellow transition"
              >
                <FaDownload /> Export CSV
              </button>
              <div className="relative">
                <FaSearch className="absolute left-3 top-3 text-eco-green dark:text-eco-yellow" />
                <input
                  type="text"
                  placeholder="Search donations..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-10 pr-4 py-2 rounded-lg border-2 border-eco-green dark:border-eco-yellow bg-white dark:bg-gray-900 text-eco-green dark:text-eco-yellow focus:outline-none focus:ring-2 focus:ring-eco-green/20 dark:focus:ring-eco-yellow/20"
                />
              </div>
            </div>
          </div>
          {/* Stats */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-eco-green/10 dark:bg-eco-yellow/10 rounded-xl p-6 flex items-center gap-4 shadow">
              <div className="text-4xl font-bold text-eco-green dark:text-eco-yellow">{totalDonations}</div>
              <div className="text-gray-600 dark:text-gray-300">Total Donations</div>
            </div>
            <div className="bg-eco-green/10 dark:bg-eco-yellow/10 rounded-xl p-6 flex items-center gap-4 shadow">
              <div className="text-4xl font-bold text-eco-green dark:text-eco-yellow">£{totalValue.toFixed(2)}</div>
              <div className="text-gray-600 dark:text-gray-300">Total Value</div>
            </div>
          </motion.div>
          {/* Chart for Donations (last 7 days) */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mb-8">
            <h2 className="text-xl font-bold text-eco-green dark:text-eco-yellow mb-4 flex items-center gap-2">
              <FaHandHoldingHeart className="text-eco-green dark:text-eco-yellow" /> Donations (Last 7 Days)
            </h2>
            <div className="bg-eco-green/10 dark:bg-eco-yellow/10 rounded-xl p-6 shadow">
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" tick={{ fill: '#1A3C34' }} />
                  <YAxis tick={{ fill: '#1A3C34' }} allowDecimals={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="donations" stroke="#E3B505" strokeWidth={3} dot={{ r: 5 }} name="Donations" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
          {/* Donations Table */}
          <div className="overflow-auto max-h-[40vh] rounded-xl shadow">
            <table className="min-w-full bg-white dark:bg-gray-900 rounded-xl">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-eco-green dark:text-eco-yellow">Donation ID</th>
                  <th className="px-4 py-2 text-left text-eco-green dark:text-eco-yellow">User ID</th>
                  <th className="px-4 py-2 text-left text-eco-green dark:text-eco-yellow">Amount (£)</th>
                  <th className="px-4 py-2 text-left text-eco-green dark:text-eco-yellow cursor-pointer" onClick={() => setSortKey('created_at')}>Date</th>
                  <th className="px-4 py-2 text-left text-eco-green dark:text-eco-yellow">Recurring</th>
                  <th className="px-4 py-2 text-left text-eco-green dark:text-eco-yellow">Name</th>
                  <th className="px-4 py-2 text-left text-eco-green dark:text-eco-yellow">Message</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(d => (
                  <tr key={d.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-eco-green/5 dark:hover:bg-eco-yellow/5 transition">
                    <td className="px-4 py-2 text-xs text-gray-700 dark:text-gray-300">{d.id.slice(0, 8)}...</td>
                    <td className="px-4 py-2 text-xs text-gray-700 dark:text-gray-300">{d.user_id?.slice(0, 8) || 'N/A'}...</td>
                    <td className="px-4 py-2 text-gray-900 dark:text-eco-yellow">£{d.amount?.toFixed(2) || '0.00'}</td>
                    <td className="px-4 py-2 text-gray-900 dark:text-eco-yellow">{d.created_at ? new Date(d.created_at).toLocaleString() : ''}</td>
                    <td className="px-4 py-2 text-gray-900 dark:text-eco-yellow font-bold uppercase">{d.recurring ? 'Yes' : 'No'}</td>
                    <td className="px-4 py-2 text-gray-900 dark:text-eco-yellow">{d.name || ''}</td>
                    <td className="px-4 py-2 text-gray-900 dark:text-eco-yellow">{d.message || ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
      <AdminFooter />
    </>
  );
};

export default AdminDonations; 
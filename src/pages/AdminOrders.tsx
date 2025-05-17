import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaShoppingBag, FaDownload, FaSearch } from 'react-icons/fa';
import AdminFooter from '../components/AdminFooter';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const FAKE_ORDERS = Array.from({ length: 20 }, (_, i) => ({
  id: `ORD-${1000 + i}`,
  user_id: `U-00${(i % 3) + 1}`,
  total: Math.round(Math.random() * 10000) / 100,
  status: 'completed',
  created_at: new Date(Date.now() - 86400000 * (i % 10)).toISOString(),
  items: [
    { name: 'Product ' + (i + 1), quantity: Math.ceil(Math.random() * 3), price: Math.round(Math.random() * 2000) / 100 },
    { name: 'Product ' + (i + 2), quantity: Math.ceil(Math.random() * 2), price: Math.round(Math.random() * 1500) / 100 },
  ],
}));

// Helper to get chart data for last 7 days
function getOrderChartData(orders) {
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().slice(0, 10);
  });
  return days.map(day => ({
    day,
    orders: orders.filter(o => o.created_at.slice(0, 10) === day).length,
  }));
}

const AdminOrders: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState('created_at');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  // Inject fake data if empty
  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(FAKE_ORDERS));
    setOrders(FAKE_ORDERS);
  }, []);

  // Filter and sort
  const filtered = orders
    .filter(o =>
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      (o.user_id && o.user_id.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortKey === 'created_at') {
        return sortDir === 'asc'
          ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          : new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      if (sortKey === 'total') {
        return sortDir === 'asc' ? a.total - b.total : b.total - a.total;
      }
      return 0;
    });

  // Export to CSV
  const exportCSV = () => {
    const header = 'Order ID,User ID,Total,Status,Date\n';
    const rows = filtered.map(o =>
      `${o.id},${o.user_id},${o.total},${o.status},${new Date(o.created_at).toLocaleString()}`
    );
    const csv = header + rows.join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'orders.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Stats
  const totalOrders = orders.length;
  const totalValue = orders.reduce((sum, o) => sum + (o.total || 0), 0);

  const chartData = getOrderChartData(orders);

  return (
    <div className="min-h-screen bg-gradient-to-br from-eco-green via-amber-50 to-emerald-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 py-12 px-4 pb-32">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border-4 border-eco-green dark:border-eco-yellow p-8 relative">
        <button
          onClick={() => navigate('/admin')}
          className="absolute left-8 top-8 flex items-center gap-2 text-eco-green dark:text-eco-yellow font-bold hover:underline text-lg"
        >
          <FaArrowLeft /> Back to Dashboard
        </button>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4 mt-2">
          <h1 className="text-3xl font-bold text-eco-green dark:text-eco-yellow font-playfair flex items-center gap-2">
            <FaShoppingBag className="text-eco-green dark:text-eco-yellow" /> Orders
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
                placeholder="Search orders..."
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
            <div className="text-4xl font-bold text-eco-green dark:text-eco-yellow">{totalOrders}</div>
            <div className="text-gray-600 dark:text-gray-300">Total Orders</div>
          </div>
          <div className="bg-eco-green/10 dark:bg-eco-yellow/10 rounded-xl p-6 flex items-center gap-4 shadow">
            <div className="text-4xl font-bold text-eco-green dark:text-eco-yellow">£{totalValue.toFixed(2)}</div>
            <div className="text-gray-600 dark:text-gray-300">Total Value</div>
          </div>
        </motion.div>
        {/* Chart for Orders (last 7 days) */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mb-8">
          <h2 className="text-xl font-bold text-eco-green dark:text-eco-yellow mb-4 flex items-center gap-2">
            <FaShoppingBag className="text-eco-green dark:text-eco-yellow" /> Orders (Last 7 Days)
          </h2>
          <div className="bg-eco-green/10 dark:bg-eco-yellow/10 rounded-xl p-6 shadow">
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" tick={{ fill: '#1A3C34' }} />
                <YAxis tick={{ fill: '#1A3C34' }} allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="orders" stroke="#1A3C34" strokeWidth={3} dot={{ r: 5 }} name="Orders" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
        {/* Orders Table */}
        <div className="overflow-auto max-h-[40vh] rounded-xl shadow">
          <table className="min-w-full bg-white dark:bg-gray-900 rounded-xl">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-eco-green dark:text-eco-yellow">Order ID</th>
                <th className="px-4 py-2 text-left text-eco-green dark:text-eco-yellow">User ID</th>
                <th className="px-4 py-2 text-left text-eco-green dark:text-eco-yellow">Total (£)</th>
                <th className="px-4 py-2 text-left text-eco-green dark:text-eco-yellow cursor-pointer" onClick={() => setSortKey('created_at')}>Date</th>
                <th className="px-4 py-2 text-left text-eco-green dark:text-eco-yellow">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(o => (
                <tr key={o.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-eco-green/5 dark:hover:bg-eco-yellow/5 transition">
                  <td className="px-4 py-2 text-xs text-gray-700 dark:text-gray-300">{o.id.slice(0, 8)}...</td>
                  <td className="px-4 py-2 text-xs text-gray-700 dark:text-gray-300">{o.user_id?.slice(0, 8) || 'N/A'}...</td>
                  <td className="px-4 py-2 text-gray-900 dark:text-eco-yellow">£{o.total?.toFixed(2) || '0.00'}</td>
                  <td className="px-4 py-2 text-gray-900 dark:text-eco-yellow">{o.created_at ? new Date(o.created_at).toLocaleString() : ''}</td>
                  <td className="px-4 py-2 text-gray-900 dark:text-eco-yellow font-bold uppercase">{o.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
      <AdminFooter />
    </div>
  );
};

export default AdminOrders; 
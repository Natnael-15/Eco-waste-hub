import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaChartLine, FaGamepad, FaDownload, FaSearch, FaLeaf, FaHandHoldingHeart } from 'react-icons/fa';
import AdminFooter from '../components/AdminFooter';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import AdminNavbar from '../components/AdminNavbar';
import { useAdminTheme } from '../context/AdminThemeContext';

// Fake data for games and revenue
const GAMES = [
  {
    id: 'alien-invaders',
    title: 'Alien Invaders 2',
    revenue: 1250.75,
    impressions: 45678,
    clicks: 2345,
    ctr: 5.14,
    avgTimeSpent: 8.5,
    players: 12345,
  },
  {
    id: 'wood-block',
    title: 'Wood Block Puzzle',
    revenue: 1875.25,
    impressions: 67890,
    clicks: 3456,
    ctr: 5.09,
    avgTimeSpent: 12.3,
    players: 15678,
  },
  {
    id: 'connect-bubbles',
    title: 'Connect The Bubbles',
    revenue: 950.50,
    impressions: 34567,
    clicks: 1789,
    ctr: 5.18,
    avgTimeSpent: 6.7,
    players: 9876,
  },
];

// Generate fake daily revenue data for the last 30 days
const generateDailyRevenue = () => {
  const data = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const baseRevenue = Math.random() * 200 + 100; // Random base revenue between 100-300
    const gameMultiplier = Math.random() * 0.5 + 0.75; // Random multiplier between 0.75-1.25
    data.push({
      date: date.toISOString().slice(0, 10),
      revenue: Math.round(baseRevenue * gameMultiplier * 100) / 100,
    });
  }
  return data;
};

// Generate fake monthly revenue data
const generateMonthlyRevenue = () => {
  const data = [];
  const today = new Date();
  for (let i = 11; i >= 0; i--) {
    const date = new Date(today);
    date.setMonth(date.getMonth() - i);
    const baseRevenue = Math.random() * 5000 + 3000; // Random base revenue between 3000-8000
    const gameMultiplier = Math.random() * 0.5 + 0.75; // Random multiplier between 0.75-1.25
    data.push({
      month: date.toLocaleString('default', { month: 'short' }),
      revenue: Math.round(baseRevenue * gameMultiplier * 100) / 100,
    });
  }
  return data;
};

const COLORS = ['#1A3C34', '#E3B505', '#4CAF50'];

const AdminAdRevenue: React.FC = () => {
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useAdminTheme();
  const [search, setSearch] = useState('');
  const [timeRange, setTimeRange] = useState<'daily' | 'monthly'>('daily');
  const [dailyData] = useState(generateDailyRevenue());
  const [monthlyData] = useState(generateMonthlyRevenue());

  // Calculate total revenue
  const totalRevenue = GAMES.reduce((sum, game) => sum + game.revenue, 0);
  const totalImpressions = GAMES.reduce((sum, game) => sum + game.impressions, 0);
  const totalClicks = GAMES.reduce((sum, game) => sum + game.clicks, 0);
  const avgCTR = (totalClicks / totalImpressions * 100).toFixed(2);

  // Filter games based on search
  const filteredGames = GAMES.filter(game =>
    game.title.toLowerCase().includes(search.toLowerCase())
  );

  // Export to CSV
  const exportCSV = () => {
    const header = 'Game,Revenue,Impressions,Clicks,CTR,Avg Time Spent,Players\n';
    const rows = GAMES.map(game =>
      `${game.title},${game.revenue},${game.impressions},${game.clicks},${game.ctr}%,${game.avgTimeSpent}m,${game.players}`
    );
    const csv = header + rows.join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ad-revenue.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

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
              <FaChartLine className="text-eco-green dark:text-eco-yellow" /> AD Revenue
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
                  placeholder="Search games..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-10 pr-4 py-2 rounded-lg border-2 border-eco-green dark:border-eco-yellow bg-white dark:bg-gray-900 text-eco-green dark:text-eco-yellow focus:outline-none focus:ring-2 focus:ring-eco-green/20 dark:focus:ring-eco-yellow/20"
                />
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-eco-green/10 dark:bg-eco-yellow/10 rounded-xl p-6 flex items-center gap-4 shadow">
              <div className="text-4xl font-bold text-eco-green dark:text-eco-yellow">£{totalRevenue.toFixed(2)}</div>
              <div className="text-gray-600 dark:text-gray-300">Total Revenue</div>
            </div>
            <div className="bg-eco-green/10 dark:bg-eco-yellow/10 rounded-xl p-6 flex items-center gap-4 shadow">
              <div className="text-4xl font-bold text-eco-green dark:text-eco-yellow">{totalImpressions.toLocaleString()}</div>
              <div className="text-gray-600 dark:text-gray-300">Total Impressions</div>
            </div>
            <div className="bg-eco-green/10 dark:bg-eco-yellow/10 rounded-xl p-6 flex items-center gap-4 shadow">
              <div className="text-4xl font-bold text-eco-green dark:text-eco-yellow">{totalClicks.toLocaleString()}</div>
              <div className="text-gray-600 dark:text-gray-300">Total Clicks</div>
            </div>
            <div className="bg-eco-green/10 dark:bg-eco-yellow/10 rounded-xl p-6 flex items-center gap-4 shadow">
              <div className="text-4xl font-bold text-eco-green dark:text-eco-yellow">{avgCTR}%</div>
              <div className="text-gray-600 dark:text-gray-300">Avg CTR</div>
            </div>
          </motion.div>

          {/* Revenue Chart */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-eco-green dark:text-eco-yellow flex items-center gap-2">
                <FaChartLine /> Revenue Trend
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setTimeRange('daily')}
                  className={`px-4 py-2 rounded-lg ${timeRange === 'daily' ? 'bg-eco-green dark:bg-eco-yellow text-white dark:text-eco-green' : 'bg-eco-green/10 dark:bg-eco-yellow/10 text-eco-green dark:text-eco-yellow'} font-bold transition`}
                >
                  Daily
                </button>
                <button
                  onClick={() => setTimeRange('monthly')}
                  className={`px-4 py-2 rounded-lg ${timeRange === 'monthly' ? 'bg-eco-green dark:bg-eco-yellow text-white dark:text-eco-green' : 'bg-eco-green/10 dark:bg-eco-yellow/10 text-eco-green dark:text-eco-yellow'} font-bold transition`}
                >
                  Monthly
                </button>
              </div>
            </div>
            <div className="bg-eco-green/10 dark:bg-eco-yellow/10 rounded-xl p-6 shadow">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={timeRange === 'daily' ? dailyData : monthlyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey={timeRange === 'daily' ? 'date' : 'month'} tick={{ fill: '#1A3C34' }} />
                  <YAxis tick={{ fill: '#1A3C34' }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="revenue" stroke="#1A3C34" strokeWidth={3} dot={{ r: 5 }} name="Revenue" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Game Distribution Chart */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-8">
            <h2 className="text-xl font-bold text-eco-green dark:text-eco-yellow mb-4 flex items-center gap-2">
              <FaGamepad /> Revenue by Game
            </h2>
            <div className="bg-eco-green/10 dark:bg-eco-yellow/10 rounded-xl p-6 shadow">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={GAMES}
                    dataKey="revenue"
                    nameKey="title"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {GAMES.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Games Table */}
          <div className="overflow-auto max-h-[40vh] rounded-xl shadow">
            <table className="min-w-full bg-white dark:bg-gray-900 rounded-xl">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-eco-green dark:text-eco-yellow">Game</th>
                  <th className="px-4 py-2 text-left text-eco-green dark:text-eco-yellow">Revenue (£)</th>
                  <th className="px-4 py-2 text-left text-eco-green dark:text-eco-yellow">Impressions</th>
                  <th className="px-4 py-2 text-left text-eco-green dark:text-eco-yellow">Clicks</th>
                  <th className="px-4 py-2 text-left text-eco-green dark:text-eco-yellow">CTR (%)</th>
                  <th className="px-4 py-2 text-left text-eco-green dark:text-eco-yellow">Avg Time (min)</th>
                  <th className="px-4 py-2 text-left text-eco-green dark:text-eco-yellow">Players</th>
                </tr>
              </thead>
              <tbody>
                {filteredGames.map(game => (
                  <tr key={game.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-eco-green/5 dark:hover:bg-eco-yellow/5 transition">
                    <td className="px-4 py-2 text-gray-900 dark:text-eco-yellow">{game.title}</td>
                    <td className="px-4 py-2 text-gray-900 dark:text-eco-yellow">£{game.revenue.toFixed(2)}</td>
                    <td className="px-4 py-2 text-gray-900 dark:text-eco-yellow">{game.impressions.toLocaleString()}</td>
                    <td className="px-4 py-2 text-gray-900 dark:text-eco-yellow">{game.clicks.toLocaleString()}</td>
                    <td className="px-4 py-2 text-gray-900 dark:text-eco-yellow">{game.ctr}%</td>
                    <td className="px-4 py-2 text-gray-900 dark:text-eco-yellow">{game.avgTimeSpent}</td>
                    <td className="px-4 py-2 text-gray-900 dark:text-eco-yellow">{game.players.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Impact Message */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="mt-8 bg-eco-green/10 dark:bg-eco-yellow/10 rounded-xl p-6 shadow flex items-center gap-4">
            <div className="text-4xl text-eco-green dark:text-eco-yellow">
              <FaLeaf />
            </div>
            <div>
              <h3 className="text-xl font-bold text-eco-green dark:text-eco-yellow mb-2">Supporting Our Mission</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Every ad impression and click helps us reduce food waste and support communities. 
                Your gaming sessions contribute to our mission of creating a more sustainable future.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
      <AdminFooter />
    </>
  );
};

export default AdminAdRevenue; 
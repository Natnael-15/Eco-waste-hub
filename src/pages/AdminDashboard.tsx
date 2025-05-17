import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';
import { FaUserShield, FaUsers, FaShoppingBag, FaHandHoldingHeart, FaLeaf, FaTruck, FaSearch } from 'react-icons/fa';
import AdminFooter from '../components/AdminFooter';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useAuth } from '../context/AuthContext';

const FAKE_USERS = [
  { id: 'U-001', name: 'Jane Doe', email: 'jane@example.com', role: 'user' },
  { id: 'U-002', name: 'John Smith', email: 'john@example.com', role: 'user' },
  { id: 'U-003', name: 'Admin User', email: 'admin@example.com', role: 'admin' },
];
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
const FAKE_DONATIONS = Array.from({ length: 20 }, (_, i) => ({
  id: `DON-${2000 + i}`,
  user_id: `U-00${(i % 3) + 1}`,
  amount: Math.round(Math.random() * 20000) / 100,
  recurring: i % 2 === 0,
  created_at: new Date(Date.now() - 86400000 * (i % 12)).toISOString(),
  name: `Donor ${i + 1}`,
  message: i % 3 === 0 ? 'Thank you!' : '',
}));

const getRecentActivity = (orders, donations) => {
  const acts = [
    ...orders.map(o => ({
      type: 'order',
      id: o.id,
      user: o.user_id,
      value: o.total,
      date: o.created_at,
    })),
    ...donations.map(d => ({
      type: 'donation',
      id: d.id,
      user: d.user_id,
      value: d.amount,
      date: d.created_at,
    })),
  ];
  return acts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 6);
};

const getChartData = (orders, donations) => {
  // Group by day for last 7 days
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().slice(0, 10);
  });
  return days.map(day => ({
    day,
    orders: orders.filter(o => o.created_at.slice(0, 10) === day).length,
    donations: donations.filter(d => d.created_at.slice(0, 10) === day).length,
  }));
};

function lerp(a, b, t) { return a + (b - a) * t; }
function getAngle(x1, y1, x2, y2) { return Math.atan2(y2 - y1, x2 - x1); }

const MAP_WIDTH = 700;
const MAP_HEIGHT = 300;
const WAREHOUSE = { x: 350, y: 150 }; // Center warehouse

// Create circular route with multiple stops
const STOPS = [
  { x: 500, y: 100 }, // Top right
  { x: 600, y: 200 }, // Far right
  { x: 500, y: 300 }, // Bottom right
  { x: 200, y: 300 }, // Bottom left
  { x: 100, y: 200 }, // Far left
  { x: 200, y: 100 }, // Top left
];

function getRoute(i) {
  // Each truck gets a unique starting point but follows the same circular route
  const startIndex = i % STOPS.length;
  const route = [
    WAREHOUSE,
    ...STOPS.slice(startIndex),
    ...STOPS.slice(0, startIndex),
    WAREHOUSE
  ];
  return route;
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [admin, setAdmin] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [donations, setDonations] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [deliveryStatus, setDeliveryStatus] = useState('On the way');
  const [deliveryProgress, setDeliveryProgress] = useState(0);

  // Live Deliveries Simulation (map-based, multi-point, looping)
  const [deliveries, setDeliveries] = useState(() => {
    const shuffled = [...orders].sort(() => 0.5 - Math.random());
    return [0, 1, 2].map(i => ({
      order: shuffled[i] || FAKE_ORDERS[i],
      route: getRoute(i),
      seg: 0,
      t: Math.random() * 0.8,
      status: 'On the way',
      id: i,
      visible: true,
      pauseTime: 0,
    }));
  });
  const deliveryInterval = useRef<NodeJS.Timeout | null>(null);

  // Inject fake data if empty
  useEffect(() => {
    let storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    let storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    let storedDonations = JSON.parse(localStorage.getItem('donations') || '[]');
    if (!storedUsers.length) {
      localStorage.setItem('users', JSON.stringify(FAKE_USERS));
      storedUsers = FAKE_USERS;
    }
    if (!storedOrders.length) {
      localStorage.setItem('orders', JSON.stringify(FAKE_ORDERS));
      storedOrders = FAKE_ORDERS;
    }
    if (!storedDonations.length) {
      localStorage.setItem('donations', JSON.stringify(FAKE_DONATIONS));
      storedDonations = FAKE_DONATIONS;
    }
    setUsers(storedUsers);
    setOrders(storedOrders);
    setDonations(storedDonations);
  }, []);

  // Simulate delivery progress
  useEffect(() => {
    if (deliveryProgress < 100) {
      const timer = setTimeout(() => setDeliveryProgress(deliveryProgress + 2), 100);
      return () => clearTimeout(timer);
    } else {
      setDeliveryStatus('Delivered');
    }
  }, [deliveryProgress]);

  useEffect(() => {
    if (deliveryInterval.current) clearInterval(deliveryInterval.current);
    deliveryInterval.current = setInterval(() => {
      setDeliveries(ds => ds.map(d => {
        let { seg, t, route, visible, pauseTime } = d;
        
        // If truck is paused at warehouse
        if (!visible) {
          pauseTime += 1;
          if (pauseTime >= 50) { // 5 seconds (50 * 100ms)
            const shuffled = [...orders].sort(() => 0.5 - Math.random());
            const newOrder = shuffled[Math.floor(Math.random() * shuffled.length)] || FAKE_ORDERS[d.id];
            return {
              ...d,
              order: newOrder,
              route: getRoute(d.id),
              seg: 0,
              t: 0,
              status: 'On the way',
              visible: true,
              pauseTime: 0,
            };
          }
          return { ...d, pauseTime };
        }

        // If truck is at a stop (not warehouse)
        if (seg > 0 && seg < route.length - 1 && t >= 0.95) {
          return { ...d, t: 0.95, status: 'Delivering' };
        }

        // Normal movement
        let speed = 0.003; // Slower speed
        t += speed;
        
        if (t >= 1) {
          seg++;
          t = 0;
          
          // If reached warehouse, make truck disappear
          if (seg >= route.length - 1) {
            return {
              ...d,
              visible: false,
              pauseTime: 0,
              status: 'Returning to warehouse',
            };
          }
        }

        return {
          ...d,
          seg,
          t,
          status: seg === route.length - 2 && t > 0.95 ? 'Returning to warehouse' : 'On the way',
        };
      }));
    }, 100); // Slower update interval
    return () => deliveryInterval.current && clearInterval(deliveryInterval.current);
  }, [orders]);

  // Stats
  const totalUsers = users.length;
  const totalOrders = orders.length;
  const totalDonations = donations.length;
  const totalValue = orders.reduce((sum, o) => sum + (o.total || 0), 0) + donations.reduce((sum, d) => sum + (d.amount || 0), 0);

  // Recent activity
  const recentActivity = getRecentActivity(orders, donations);

  // Chart data
  const chartData = getChartData(orders, donations);

  // User search
  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  // Add a logout handler for the admin dashboard
  const handleAdminLogout = async () => {
    try {
      await logout();
      navigate('/admin-login');
    } catch (error) {
      alert('Error logging out. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-eco-green via-amber-50 to-emerald-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 py-12 px-4 pb-32">
      <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
        className="max-w-7xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border-4 border-eco-green dark:border-eco-yellow p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-eco-green dark:text-eco-yellow font-playfair flex items-center gap-2">
              <FaUserShield className="text-eco-green dark:text-eco-yellow" /> Admin Dashboard
            </h1>
            <p className="text-gray-500 dark:text-gray-300 mt-2">Welcome, {admin?.name || 'Admin'}!</p>
          </div>
          <button
            onClick={handleAdminLogout}
            className="px-6 py-2 rounded-lg bg-eco-green dark:bg-eco-yellow text-white dark:text-gray-900 font-bold hover:bg-eco-yellow hover:text-eco-green dark:hover:bg-eco-green dark:hover:text-white transition"
          >
            Log Out
          </button>
        </div>
        {/* Summary Cards */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-eco-green/10 dark:bg-eco-yellow/10 rounded-xl p-6 flex flex-col items-center shadow">
            <FaUsers className="text-3xl text-eco-green dark:text-eco-yellow mb-2" />
            <div className="text-2xl font-bold text-eco-green dark:text-eco-yellow">{totalUsers}</div>
            <div className="text-gray-600 dark:text-gray-300">Users</div>
          </div>
          <div className="bg-eco-green/10 dark:bg-eco-yellow/10 rounded-xl p-6 flex flex-col items-center shadow">
            <FaShoppingBag className="text-3xl text-eco-green dark:text-eco-yellow mb-2" />
            <div className="text-2xl font-bold text-eco-green dark:text-eco-yellow">{totalOrders}</div>
            <div className="text-gray-600 dark:text-gray-300">Orders</div>
          </div>
          <div className="bg-eco-green/10 dark:bg-eco-yellow/10 rounded-xl p-6 flex flex-col items-center shadow">
            <FaHandHoldingHeart className="text-3xl text-eco-green dark:text-eco-yellow mb-2" />
            <div className="text-2xl font-bold text-eco-green dark:text-eco-yellow">{totalDonations}</div>
            <div className="text-gray-600 dark:text-gray-300">Donations</div>
          </div>
          <div className="bg-eco-green/10 dark:bg-eco-yellow/10 rounded-xl p-6 flex flex-col items-center shadow">
            <FaLeaf className="text-3xl text-eco-green dark:text-eco-yellow mb-2" />
            <div className="text-2xl font-bold text-eco-green dark:text-eco-yellow">£{totalValue.toFixed(2)}</div>
            <div className="text-gray-600 dark:text-gray-300">Total Value</div>
          </div>
        </motion.div>
        {/* Orders/Donations Buttons Side by Side */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
          className="flex flex-row gap-6 mb-10 justify-center items-center">
          <button
            onClick={() => navigate('/admin/orders')}
            className="w-64 h-32 rounded-2xl bg-eco-green dark:bg-eco-yellow text-white dark:text-eco-green text-2xl font-bold flex flex-col items-center justify-center shadow-xl hover:scale-105 hover:bg-eco-yellow hover:text-eco-green dark:hover:bg-eco-green dark:hover:text-eco-yellow transition-all duration-200 border-4 border-eco-yellow dark:border-eco-green"
          >
            <FaShoppingBag className="text-4xl mb-2" />
            Orders
          </button>
          <button
            onClick={() => navigate('/admin/donations')}
            className="w-64 h-32 rounded-2xl bg-eco-yellow dark:bg-eco-green text-eco-green dark:text-eco-yellow text-2xl font-bold flex flex-col items-center justify-center shadow-xl hover:scale-105 hover:bg-eco-green hover:text-eco-yellow dark:hover:bg-eco-yellow dark:hover:text-eco-green transition-all duration-200 border-4 border-eco-green dark:border-eco-yellow"
          >
            <FaHandHoldingHeart className="text-4xl mb-2" />
            Donations
          </button>
        </motion.div>
        {/* User Search */}
        <div className="mb-10 flex justify-center">
          <div className="relative w-full max-w-md">
            <FaSearch className="absolute left-3 top-3 text-eco-green dark:text-eco-yellow" />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-lg border-2 border-eco-green dark:border-eco-yellow bg-white dark:bg-gray-900 text-eco-green dark:text-eco-yellow focus:outline-none focus:ring-2 focus:ring-eco-green/20 dark:focus:ring-eco-yellow/20 w-full"
            />
          </div>
        </div>
        {/* Filtered Users Table */}
        {search && (
          <div className="mb-10 overflow-auto max-h-[20vh] rounded-xl shadow">
            <table className="min-w-full bg-white dark:bg-gray-900 rounded-xl">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-eco-green dark:text-eco-yellow">User ID</th>
                  <th className="px-4 py-2 text-left text-eco-green dark:text-eco-yellow">Name</th>
                  <th className="px-4 py-2 text-left text-eco-green dark:text-eco-yellow">Email</th>
                  <th className="px-4 py-2 text-left text-eco-green dark:text-eco-yellow">Role</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(u => (
                  <tr key={u.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-eco-green/5 dark:hover:bg-eco-yellow/5 transition">
                    <td className="px-4 py-2 text-xs text-gray-700 dark:text-gray-300">{u.id}</td>
                    <td className="px-4 py-2 text-gray-900 dark:text-eco-yellow">{u.name}</td>
                    <td className="px-4 py-2 text-gray-900 dark:text-eco-yellow">{u.email}</td>
                    <td className="px-4 py-2 text-gray-900 dark:text-eco-yellow font-bold uppercase">{u.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {/* Recent Activity Feed */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-eco-green dark:text-eco-yellow mb-4 flex items-center gap-2">
            <FaTruck /> Recent Activity
          </h2>
          <div className="bg-eco-green/10 dark:bg-eco-yellow/10 rounded-xl p-6 shadow flex flex-col gap-3 max-h-[20vh] overflow-auto">
            {recentActivity.map((a, i) => (
              <div key={i} className="flex items-center gap-4 animate-pulse">
                {a.type === 'order' ? (
                  <FaShoppingBag className="text-eco-green dark:text-eco-yellow text-xl" />
                ) : (
                  <FaHandHoldingHeart className="text-eco-green dark:text-eco-yellow text-xl" />
                )}
                <div className="flex-1">
                  <div className="font-bold text-eco-green dark:text-eco-yellow">
                    {a.type === 'order' ? 'Order' : 'Donation'} {a.id}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-300">
                    User: {a.user} | Value: £{a.value} | {new Date(a.date).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
            {/* Simulated delivery */}
            <div className="flex items-center gap-4 animate-bounce mt-2">
              <FaTruck className="text-eco-green dark:text-eco-yellow text-xl" />
              <div className="flex-1">
                <div className="font-bold text-eco-green dark:text-eco-yellow">Delivery Status: {deliveryStatus}</div>
                <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2 mt-2">
                  <div className="bg-eco-green dark:bg-eco-yellow h-2 rounded-full" style={{ width: `${deliveryProgress}%`, transition: 'width 0.5s' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Orders/Donations Chart */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-eco-green dark:text-eco-yellow mb-4 flex items-center gap-2">
            <FaLeaf /> Orders & Donations (Last 7 Days)
          </h2>
          <div className="bg-eco-green/10 dark:bg-eco-yellow/10 rounded-xl p-6 shadow">
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" tick={{ fill: '#1A3C34' }} />
                <YAxis tick={{ fill: '#1A3C34' }} />
                <Tooltip />
                <Line type="monotone" dataKey="orders" stroke="#1A3C34" strokeWidth={3} dot={{ r: 5 }} name="Orders" />
                <Line type="monotone" dataKey="donations" stroke="#E3B505" strokeWidth={3} dot={{ r: 5 }} name="Donations" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* Live Deliveries Animation (Map) */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-eco-green dark:text-eco-yellow mb-4 flex items-center gap-2">
            <FaTruck /> Live Deliveries
          </h2>
          <div className="flex justify-center">
            <svg width={MAP_WIDTH} height={MAP_HEIGHT} className="rounded-xl shadow bg-eco-green/10 dark:bg-eco-yellow/10" style={{ minWidth: 350 }}>
              {/* Draw the circular route as a single closed polyline */}
              <polyline
                points={[
                  [WAREHOUSE.x, WAREHOUSE.y],
                  ...STOPS.map(p => [p.x, p.y]),
                  [WAREHOUSE.x, WAREHOUSE.y]
                ].map(([x, y]) => `${x},${y}`).join(' ')}
                fill="none"
                stroke="#E3B505"
                strokeWidth={4}
                strokeDasharray="8 6"
              />
              
              {/* Warehouse */}
              <circle cx={WAREHOUSE.x} cy={WAREHOUSE.y} r={18} fill="#1A3C34" />
              <text x={WAREHOUSE.x} y={WAREHOUSE.y + 5} textAnchor="middle" fill="#fff" fontSize={14} fontWeight="bold">WH</text>
              
              {/* Delivery Stops (Houses) */}
              {STOPS.map((loc, i) => (
                <g key={i}>
                  <text x={loc.x} y={loc.y} fontSize={24} textAnchor="middle" alignmentBaseline="middle">🏠</text>
                  <text x={loc.x} y={loc.y + 30} textAnchor="middle" fill="#1A3C34" fontSize={12} fontWeight="bold">
                    Stop {i + 1}
                  </text>
                </g>
              ))}
              
              {/* Trucks */}
              {deliveries.map((d, idx) => {
                if (!d.visible) return null;
                
                const { route, seg, t } = d;
                const p1 = route[seg];
                const p2 = route[seg + 1];
                const x = lerp(p1.x, p2.x, t);
                const y = lerp(p1.y, p2.y, t);
                const angle = getAngle(p1.x, p1.y, p2.x, p2.y);
                const flip = Math.abs(angle) > Math.PI / 2;
                
                return (
                  <g key={d.id}>
                    {/* Truck icon */}
                    <g transform={`translate(${x},${y}) scale(${flip ? -1 : 1},1)`}>
                      <text x={0} y={0} fontSize={32} textAnchor="middle" alignmentBaseline="middle">🚚</text>
                    </g>
                    {/* Info card above truck */}
                    <g>
                      <rect x={x - 60} y={y - 55} width={120} height={38} rx={10} fill="#fff" opacity={0.95} />
                      <text x={x} y={y - 40} textAnchor="middle" fill="#1A3C34" fontSize={13} fontWeight="bold">
                        Order: {d.order.id}
                      </text>
                      <text x={x} y={y - 25} textAnchor="middle" fill="#E3B505" fontSize={12}>
                        {d.status}
                      </text>
                    </g>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      </motion.div>
      <AdminFooter />
    </div>
  );
};

export default AdminDashboard; 
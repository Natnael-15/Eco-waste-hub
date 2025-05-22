import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Navigate } from 'react-router-dom';
import GoodbyeModal from '../components/GoodbyeModal';
import StatCard from '../components/StatCard';
import Globe3D from '../components/Globe3D';
import ImpactLeaf3D from '../components/ImpactLeaf3D';
import { motion } from 'framer-motion';
import { FaRecycle, FaLeaf, FaChartLine, FaTrophy, FaHistory, FaShoppingBag } from 'react-icons/fa';
import { toast } from 'react-toastify';
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
  id: string;
  total: number;
  status: string;
  created_at: string;
  items: OrderItem[];
}

interface UserDashboardProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ darkMode, toggleDarkMode }) => {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();
  const [showGoodbye, setShowGoodbye] = useState(false);
  const [stats] = useState({
    recyclingPoints: 1250,
    carbonSaved: 45.5,
    itemsRecycled: 78,
    streak: 12,
    nextMilestone: 1500,
    impactLevel: 'Eco Warrior'
  });
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoadingOrders(true);
        // Fetch orders from localStorage
        const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        // Only show orders for the current user
        const userOrders = allOrders.filter(order => order.user_id === user?.id);
        // Ensure orders have the correct structure
        const formattedOrders = (userOrders || []).map(order => ({
          ...order,
          items: Array.isArray(order.items) ? order.items : []
        }));
        setOrders(formattedOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast.error('Failed to load order history');
      } finally {
        setLoadingOrders(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  // Move the early return after all hooks
  if (!user) {
    return <Navigate to="/login" />;
  }

  const handleLogout = async () => {
    try {
      setShowGoodbye(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error during logout:', error);
      setShowGoodbye(false);
    }
  };

  // Prefer profile.name, then email prefix, then Eco Hero
  const displayName = profile?.name || user.email?.split('@')[0] || 'Eco Hero';

  const formatDate = (dateString) => {
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
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-amber-50 to-emerald-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-300 py-16 px-4 pt-20">
        {/* Header Section */}
        <div className="w-full flex justify-center items-center py-4">
          <div className="relative w-full max-w-4xl bg-white/70 dark:bg-gray-900/80 backdrop-blur-md rounded-2xl shadow-2xl border border-eco-yellow/30 px-8 py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6 overflow-visible">
            {/* Accent bar */}
            <div className="absolute left-0 top-0 h-full w-2 bg-gradient-to-b from-eco-yellow/80 to-eco-green/80 rounded-l-2xl" />
            <div className="flex-1 flex flex-col gap-2">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl md:text-4xl font-bold font-playfair text-gray-900 dark:text-eco-yellow drop-shadow-lg">
                  Welcome back, {displayName}!
                </h1>
                <motion.span
                  initial={{ scale: 1 }}
                  animate={{ scale: [1, 1.18, 1], rotate: [0, 10, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                  className="text-4xl md:text-5xl select-none"
                  role="img"
                  aria-label="eco"
                >
                  🌱
                </motion.span>
              </div>
              <div className="text-lg md:text-xl text-eco-green dark:text-eco-yellow/90 font-medium opacity-90 mb-1">
                Keep up the great work in making our planet greener!
              </div>
            </div>
            <div className="flex items-center md:justify-end">
              <button
                onClick={handleLogout}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-eco-yellow to-eco-green text-eco-green dark:text-gray-900 font-bold shadow-lg hover:from-yellow-300 hover:to-emerald-400 transition-all duration-200 flex items-center gap-2 text-lg border-2 border-eco-green/20"
              >
                <FaLeaf className="text-xl" />
                Log Out
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Recycling Points"
              value={stats.recyclingPoints}
              icon={<FaRecycle className="text-3xl text-eco-green dark:text-eco-yellow" />}
              progress={{ current: stats.recyclingPoints, total: stats.nextMilestone }}
            />
            <StatCard
              title="Carbon Saved"
              value={`${stats.carbonSaved} kg`}
              icon={<FaLeaf className="text-3xl text-eco-green dark:text-eco-yellow" />}
              subtitle={`That's like planting ${Math.round(stats.carbonSaved * 2)} trees!`}
            />
            <StatCard
              title="Items Recycled"
              value={stats.itemsRecycled}
              icon={<FaChartLine className="text-3xl text-eco-green dark:text-eco-yellow" />}
              subtitle={stats.itemsRecycled > 50 ? "You're a recycling superstar! 🌟" : "Keep going, you're doing great!"}
            />
            <StatCard
              title="Current Streak"
              value={`${stats.streak} days`}
              icon={<FaTrophy className="text-3xl text-eco-green dark:text-eco-yellow" />}
              subtitle={stats.streak > 10 ? "Incredible streak! 🔥" : "Keep the momentum going!"}
            />
          </div>

          {/* Impact Level */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-gradient-to-r from-eco-green to-eco-yellow dark:from-gray-800 dark:to-gray-700 rounded-xl p-8 shadow-lg text-white"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="hidden md:flex items-center justify-center">
                <ImpactLeaf3D />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-bold mb-2">Your Impact Level</h2>
                <p className="text-lg opacity-90">{stats.impactLevel}</p>
                <p className="mt-2 opacity-80">Keep up the amazing work! You're making a real difference.</p>
                <p className="mt-2 text-base opacity-80 text-eco-yellow bg-black/30 rounded-lg px-3 py-2 inline-block font-semibold shadow-sm">
                  We run ads on the games to raise money for our mission—so every time you play, you help support Eco Waste Hub!
                </p>
              </div>
              <div className="flex items-center justify-center">
                <Globe3D width={140} height={140} />
              </div>
            </div>
          </motion.div>

          {/* Order History Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8 mt-12"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <FaHistory className="text-eco-green dark:text-eco-yellow" />
                Order History
              </h2>
              {loadingOrders ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-eco-green dark:border-eco-yellow"></div>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <FaShoppingBag className="text-4xl mx-auto mb-4" />
                  <p>No orders yet</p>
                  <button
                    onClick={() => navigate('/shop')}
                    className="mt-4 px-4 py-2 bg-eco-green dark:bg-eco-yellow text-white rounded-md hover:opacity-90"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      onClick={() => {
                        setSelectedOrder(order);
                        setShowOrderModal(true);
                      }}
                      className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 cursor-pointer hover:shadow-md transition"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold text-eco-green dark:text-eco-yellow">
                            Order #{order.id.slice(0, 8)}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {formatDate(order.created_at)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-eco-green dark:text-eco-yellow">
                            £{order.total.toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {order.items.length} items
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Order Details Modal */}
          {showOrderModal && selectedOrder && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/80" onClick={() => setShowOrderModal(false)}>
              <div
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-lg w-full p-8 relative animate-fade-in border-4 border-eco-yellow dark:border-eco-green mx-4"
                onClick={e => e.stopPropagation()}
              >
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-eco-green dark:text-eco-yellow dark:hover:text-eco-green text-2xl"
                >×</button>
                <h2 className="text-2xl font-bold text-eco-green dark:text-eco-yellow mb-2 flex items-center gap-2">
                  <FaShoppingBag /> Order #{selectedOrder.id.slice(0, 8)}
                </h2>
                <div className="mb-4 text-gray-600 dark:text-gray-300 text-sm">
                  <div>Date: <span className="font-semibold">{formatDate(selectedOrder.created_at)}</span></div>
                  <div>Status: <span className="font-semibold text-green-600 dark:text-green-300">Completed</span></div>
                  <div>Total: <span className="font-semibold text-eco-green dark:text-eco-yellow">£{selectedOrder.total.toFixed(2)}</span></div>
                </div>
                
                <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
                  {selectedOrder.items.map(item => (
                    <div key={item.id} className="flex items-center gap-4 border-b border-gray-200 dark:border-gray-800 pb-3">
                      <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded-lg" />
                      <div className="flex-1">
                        <div className="font-bold text-eco-green dark:text-eco-yellow">{item.name}</div>
                        <div className="text-xs text-gray-500 dark:text-eco-yellow/70">{item.quantity} × £{item.price.toFixed(2)}</div>
                      </div>
                      <div className="font-bold text-lg text-eco-green dark:text-eco-yellow">
                        £{(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <GoodbyeModal isOpen={showGoodbye} userEmail={user?.email || ''} />
      </div>
    </>
  );
};

export default UserDashboard; 
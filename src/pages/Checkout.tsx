import React, { useEffect, useState } from 'react';
import { FaShoppingCart, FaArrowLeft, FaCreditCard, FaLock, FaCheckCircle, FaHistory } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { supabase } from '../lib/supabase';
import { useCart } from '../context/CartContext';

// Thank You Modal Component
const ThankYouModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 max-w-md w-full mx-4 text-center">
        <div className="animate-bounce mb-6">
          <FaCheckCircle className="text-6xl text-eco-green dark:text-eco-yellow mx-auto" />
        </div>
        <h2 className="text-2xl font-bold text-eco-green dark:text-eco-yellow mb-4">Thank You!</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Your order has been placed successfully. We'll start processing it right away!
        </p>
        <button
          onClick={() => {
            onClose();
            navigate('/dashboard');
          }}
          className="w-full bg-eco-green text-white py-3 rounded-lg font-bold hover:bg-eco-yellow hover:text-eco-green dark:bg-eco-yellow dark:text-gray-900 dark:hover:bg-eco-green dark:hover:text-white transition flex items-center justify-center gap-2 text-lg"
        >
          <FaHistory /> View Order History
        </button>
      </div>
    </div>
  );
};

// Payment Modal Component
const PaymentModal = ({ isOpen, onClose, onPaymentComplete, total }) => {
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAutoFill = () => {
    setCardDetails({
      number: '4242 4242 4242 4242',
      name: 'Demo User',
      expiry: '12/25',
      cvv: '123'
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isProcessing) return; // Prevent double submission
    
    setIsProcessing(true);
    
    try {
      // Validate card details
      if (!cardDetails.number || !cardDetails.name || !cardDetails.expiry || !cardDetails.cvv) {
        toast.error('Please fill in all card details');
        setIsProcessing(false);
        return;
      }

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Call the payment completion handler
      await onPaymentComplete();
      
      // Close the payment modal
      onClose();
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed. Please try again.');
      setIsProcessing(false);
    }
  };

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setCardDetails({
        number: '',
        name: '',
        expiry: '',
        cvv: ''
      });
      setIsProcessing(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 max-w-md w-full mx-4 relative">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" 
          disabled={isProcessing}
        >×</button>
        <h2 className="text-2xl font-bold text-eco-green dark:text-eco-yellow mb-6 flex items-center gap-2">
          <FaCreditCard /> Payment Details
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Card Number
            </label>
            <input
              type="text"
              value={cardDetails.number}
              onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
              placeholder="1234 5678 9012 3456"
              className="w-full p-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-eco-green dark:focus:border-eco-yellow focus:ring-2 focus:ring-eco-green/20 dark:focus:ring-eco-yellow/20 transition bg-white dark:bg-gray-900 text-gray-900 dark:text-eco-yellow"
              required
              disabled={isProcessing}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Cardholder Name
            </label>
            <input
              type="text"
              value={cardDetails.name}
              onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
              placeholder="John Doe"
              className="w-full p-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-eco-green dark:focus:border-eco-yellow focus:ring-2 focus:ring-eco-green/20 dark:focus:ring-eco-yellow/20 transition bg-white dark:bg-gray-900 text-gray-900 dark:text-eco-yellow"
              required
              disabled={isProcessing}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Expiry Date
              </label>
              <input
                type="text"
                value={cardDetails.expiry}
                onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                placeholder="MM/YY"
                className="w-full p-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-eco-green dark:focus:border-eco-yellow focus:ring-2 focus:ring-eco-green/20 dark:focus:ring-eco-yellow/20 transition bg-white dark:bg-gray-900 text-gray-900 dark:text-eco-yellow"
                required
                disabled={isProcessing}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                CVV
              </label>
              <input
                type="text"
                value={cardDetails.cvv}
                onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                placeholder="123"
                className="w-full p-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-eco-green dark:focus:border-eco-yellow focus:ring-2 focus:ring-eco-green/20 dark:focus:ring-eco-yellow/20 transition bg-white dark:bg-gray-900 text-gray-900 dark:text-eco-yellow"
                required
                disabled={isProcessing}
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4">
            <button
              type="button"
              onClick={handleAutoFill}
              className="text-sm text-eco-green dark:text-eco-yellow hover:underline"
              disabled={isProcessing}
            >
              Auto-fill Demo Card
            </button>
            <div className="text-right">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Amount</p>
              <p className="text-xl font-bold text-eco-green dark:text-eco-yellow">£{total.toFixed(2)}</p>
            </div>
          </div>

          <button
            type="submit"
            disabled={isProcessing}
            className={`w-full mt-6 bg-eco-green text-white py-3 rounded-lg font-bold hover:bg-eco-yellow hover:text-eco-green dark:bg-eco-yellow dark:text-gray-900 dark:hover:bg-eco-green dark:hover:text-white transition flex items-center justify-center gap-2 text-lg ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Processing...
              </>
            ) : (
              <>
                <FaLock /> Pay Now
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { clearCartAfterCheckout } = useCart();
  const [cart, setCart] = useState([]);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showThankYouModal, setShowThankYouModal] = useState(false);

  useEffect(() => {
    // Get cart items from localStorage
    const storedCheckoutData = JSON.parse(localStorage.getItem('checkoutCart') || '{}');
    if (!storedCheckoutData.items || storedCheckoutData.items.length === 0) {
      // If no items in cart, redirect to shop
      navigate('/shop');
      return;
    }
    setCart(storedCheckoutData.items);
  }, [navigate]);

  // Calculate cart summary and total
  const cartSummary = cart.reduce((acc, item) => {
    const found = acc.find(i => i.id === item.id);
    if (found) {
      found.qty += 1;
    } else {
      acc.push({ ...item, qty: 1 });
    }
    return acc;
  }, []);
  
  const cartTotal = cartSummary.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handlePlaceOrder = async () => {
    if (!user) {
      toast.info('🔒 Please log in to complete your order.', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      navigate('/login');
      return;
    }
    setShowPaymentModal(true);
  };

  const handlePaymentComplete = async () => {
    try {
      // Create order object
      const orderId = crypto.randomUUID();
      const order = {
        id: orderId,
        user_id: user.id,
        total: cartTotal,
        status: 'completed',
        created_at: new Date().toISOString(),
        items: cartSummary.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.qty,
          image: item.image
        }))
      };

      // Store order in localStorage
      const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      existingOrders.unshift(order); // Add to start for most recent first
      localStorage.setItem('orders', JSON.stringify(existingOrders));

      // Clear cart and update state
      localStorage.removeItem('checkoutCart');
      clearCartAfterCheckout();
      setCart([]);
      setOrderPlaced(true);
      setShowPaymentModal(false);
      setShowThankYouModal(true);

      toast.success('Order placed successfully! 🎉');
      
      // Navigate to dashboard after successful order
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Error in handlePaymentComplete:', error);
      toast.error('An unexpected error occurred. Please try again.');
      setShowPaymentModal(false);
    }
  };

  const handleViewOrderHistory = () => {
    setShowThankYouModal(false);
    navigate('/dashboard');
  };

  return (
    <>
      <ToastContainer />
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-amber-50 to-emerald-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-300 flex flex-col items-center justify-center py-16 px-4">
        <div className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 border-4 border-eco-yellow dark:border-eco-green">
          <button onClick={() => navigate('/shop')} className="mb-4 flex items-center gap-2 text-eco-green dark:text-eco-yellow hover:underline">
            <FaArrowLeft /> Back to Shop
          </button>
          <h2 className="text-3xl font-bold font-playfair text-eco-green dark:text-eco-yellow mb-6 flex items-center gap-2">
            <FaShoppingCart /> Checkout
          </h2>
          
          {cart.length === 0 ? (
            <div className="text-center text-gray-400 dark:text-eco-yellow/60 py-8">
              Your cart is empty. <br />
              <button 
                onClick={() => navigate('/shop')} 
                className="mt-4 bg-eco-green text-white px-6 py-2 rounded-lg font-bold hover:bg-eco-yellow hover:text-eco-green dark:bg-eco-yellow dark:text-gray-900 dark:hover:bg-eco-green dark:hover:text-white transition"
              >
                Return to Shop
              </button>
            </div>
          ) : orderPlaced ? (
            <div className="text-center text-eco-green dark:text-eco-yellow py-8 text-xl font-bold">
              Thank you for your order! 🎉<br />You will receive a confirmation email soon.
            </div>
          ) : (
            <div>
              <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
                {cartSummary.map(item => (
                  <div key={item.id} className="flex items-center gap-4 border-b border-gray-200 dark:border-gray-800 pb-3">
                    <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded-lg" />
                    <div className="flex-1">
                      <div className="font-bold text-eco-green dark:text-eco-yellow">{item.name}</div>
                      <div className="text-xs text-gray-500 dark:text-eco-yellow/70">{item.qty} × £{item.price.toFixed(2)}</div>
                    </div>
                    <div className="font-bold text-lg text-eco-green dark:text-eco-yellow">£{(item.price * item.qty).toFixed(2)}</div>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex items-center justify-between text-lg font-bold">
                <span className="text-eco-green dark:text-eco-yellow">Total:</span>
                <span className="text-eco-green dark:text-eco-yellow">£{cartTotal.toFixed(2)}</span>
              </div>
              <button
                className="mt-6 w-full bg-eco-green text-white py-3 rounded-lg font-bold hover:bg-eco-yellow hover:text-eco-green dark:bg-eco-yellow dark:text-gray-900 dark:hover:bg-eco-green dark:hover:text-white transition flex items-center justify-center gap-2 text-lg"
                onClick={handlePlaceOrder}
              >
                <FaCreditCard /> Proceed to Payment
              </button>
            </div>
          )}
        </div>
      </div>

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onPaymentComplete={handlePaymentComplete}
        total={cartTotal}
      />

      <ThankYouModal
        isOpen={showThankYouModal}
        onClose={handleViewOrderHistory}
      />
    </>
  );
};

export default Checkout; 
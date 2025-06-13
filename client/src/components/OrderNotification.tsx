import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';
import { Bell, Clock, CheckCircle, X, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import { Order } from '../lib/types';
import { orderAPI } from '../lib/api';

const OrderNotification: React.FC = () => {
  const { user } = useAuth();
  const { socket, isConnected } = useSocket();
  const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'mom') return;

    // Fetch existing pending orders
    const fetchPendingOrders = async () => {
      try {
        const response = await orderAPI.getMyOrders();
        if (response.success) {
          const pending = response.orders.filter(order => order.status === 'pending');
          setPendingOrders(pending);
          if (pending.length > 0) {
            setShowNotification(true);
          }
        }
      } catch (error) {
        console.error('Error fetching pending orders:', error);
      }
    };

    fetchPendingOrders();

    // Listen for new order events
    const handleNewOrder = (event: any) => {
      const orderData = event.detail;
      setPendingOrders(prev => [...prev, orderData.order]);
      setShowNotification(true);
    };

    // Listen for order status updates
    const handleOrderStatusUpdate = (event: any) => {
      const { orderId, status } = event.detail;
      setPendingOrders(prev => 
        prev.filter(order => order._id !== orderId || status === 'pending')
      );
      
      // Hide notification if no more pending orders
      setPendingOrders(prev => {
        if (prev.length === 0) {
          setShowNotification(false);
        }
        return prev;
      });
    };

    // Add event listeners
    window.addEventListener('new_order', handleNewOrder);
    window.addEventListener('order_status_update', handleOrderStatusUpdate);

    // Cleanup
    return () => {
      window.removeEventListener('new_order', handleNewOrder);
      window.removeEventListener('order_status_update', handleOrderStatusUpdate);
    };
  }, [user]);

  const handleAcceptOrder = async (orderId: string) => {
    try {
      const response = await orderAPI.updateOrderStatus(orderId, 'accepted');
      
      if (response.success) {
        setPendingOrders(prev => prev.filter(order => order._id !== orderId));
        toast.success('Order accepted! Start cooking 👩‍🍳');
        
        // If no more pending orders, hide notification
        if (pendingOrders.length === 1) {
          setShowNotification(false);
        }
      }
    } catch (error: any) {
      console.error('Error accepting order:', error);
      toast.error(error.message || 'Failed to accept order');
    }
  };

  const handleRejectOrder = async (orderId: string) => {
    try {
      const response = await orderAPI.updateOrderStatus(orderId, 'cancelled');
      
      if (response.success) {
        setPendingOrders(prev => prev.filter(order => order._id !== orderId));
        toast.error('Order rejected');
        
        // If no more pending orders, hide notification
        if (pendingOrders.length === 1) {
          setShowNotification(false);
        }
      }
    } catch (error: any) {
      console.error('Error rejecting order:', error);
      toast.error(error.message || 'Failed to reject order');
    }
  };

  if (!user || user.role !== 'mom' || !showNotification || pendingOrders.length === 0) {
    return null;
  }

  return (
    <AnimatePresence>
      {showNotification && (
        <motion.div
          initial={{ opacity: 0, x: 400 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 400 }}
          className="fixed top-20 right-4 z-50 max-w-sm w-full"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-orange-200 dark:border-gray-600 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-pink-500 p-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <motion.div
                    animate={{ rotate: [0, 15, -15, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                  >
                    <Bell className="h-5 w-5" />
                  </motion.div>
                  <span className="font-semibold">New Order!</span>
                  {!isConnected && (
                    <span className="text-xs bg-red-500 px-2 py-1 rounded-full">
                      Offline
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setShowNotification(false)}
                  className="text-white/80 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Orders List */}
            <div className="max-h-96 overflow-y-auto">
              {pendingOrders.map((order, index) => (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                >
                  {/* Order Details */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        Order #{order._id.slice(-6)}
                      </span>
                      <span className="text-lg font-bold text-green-600">
                        ₹{order.total_amount}
                      </span>
                    </div>
                    
                    <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4" />
                        <span>{new Date(order.created_at).toLocaleTimeString()}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4" />
                        <span className="truncate">{order.delivery_address}</span>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="mt-2">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Items: {order.items.length} item(s)
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAcceptOrder(order._id)}
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>Accept</span>
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleRejectOrder(order._id)}
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
                    >
                      <X className="h-4 w-4" />
                      <span>Reject</span>
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Footer */}
            <div className="bg-gray-50 dark:bg-gray-700 p-3 text-center">
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Respond quickly to keep customers happy! 😊
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OrderNotification;
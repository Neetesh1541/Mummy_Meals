import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';
import { Bell, Clock, CheckCircle, X, MapPin, Phone, Star, ChefHat } from 'lucide-react';
import toast from 'react-hot-toast';
import { Order } from '../lib/types';
import { orderAPI } from '../lib/api';

const OrderNotification: React.FC = () => {
  const { user } = useAuth();
  const { socket, isConnected } = useSocket();
  const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
  const [showNotification, setShowNotification] = useState(false);
  const [loading, setLoading] = useState(false);

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
      console.log('New order event received:', event.detail);
      const orderData = event.detail;
      setPendingOrders(prev => {
        // Check if order already exists
        const exists = prev.some(order => order._id === orderData.order._id);
        if (!exists) {
          setShowNotification(true);
          return [orderData.order, ...prev];
        }
        return prev;
      });
    };

    // Listen for order status updates
    const handleOrderStatusUpdate = (event: any) => {
      const { orderId, status } = event.detail;
      setPendingOrders(prev => {
        const updated = prev.filter(order => order._id !== orderId || status === 'pending');
        if (updated.length === 0) {
          setShowNotification(false);
        }
        return updated;
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
      setLoading(true);
      const response = await orderAPI.updateOrderStatus(orderId, 'accepted');
      
      if (response.success) {
        setPendingOrders(prev => prev.filter(order => order._id !== orderId));
        toast.success('Order accepted! Start cooking 👩‍🍳');
        
        // If no more pending orders, hide notification
        if (pendingOrders.length === 1) {
          setShowNotification(false);
        }

        // Emit cooking update via socket
        if (socket) {
          socket.emit('cooking_update', {
            order_id: orderId,
            message: 'Chef has accepted your order and will start cooking soon!',
            progress: 25
          });
        }
      }
    } catch (error: any) {
      console.error('Error accepting order:', error);
      toast.error(error.response?.data?.message || 'Failed to accept order');
    } finally {
      setLoading(false);
    }
  };

  const handleRejectOrder = async (orderId: string) => {
    try {
      setLoading(true);
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
      toast.error(error.response?.data?.message || 'Failed to reject order');
    } finally {
      setLoading(false);
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
                  <span className="font-semibold">New Order{pendingOrders.length > 1 ? 's' : ''}!</span>
                  <div className="flex items-center space-x-1">
                    <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
                    <span className="text-xs">{isConnected ? 'Live' : 'Offline'}</span>
                  </div>
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
                      {order.foodie_id && (
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4" />
                          <span>{(order.foodie_id as any).name}</span>
                        </div>
                      )}
                    </div>

                    {/* Order Items */}
                    <div className="mt-2">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Items: {order.items.length} item(s)
                      </p>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {order.items.map((item, idx) => (
                          <span key={idx}>
                            {item.quantity}x Item #{item.menu_item_id}
                            {idx < order.items.length - 1 ? ', ' : ''}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Delivery Instructions */}
                    {order.delivery_instructions && (
                      <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <p className="text-xs text-blue-800 dark:text-blue-300">
                          <strong>Instructions:</strong> {order.delivery_instructions}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAcceptOrder(order._id)}
                      disabled={loading}
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium disabled:opacity-50"
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>Accept & Cook</span>
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleRejectOrder(order._id)}
                      disabled={loading}
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium disabled:opacity-50"
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
              <div className="flex items-center justify-center space-x-2 mt-1">
                <ChefHat className="h-3 w-3 text-orange-500" />
                <span className="text-xs text-orange-600 dark:text-orange-400 font-medium">
                  Real-time notifications active
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OrderNotification;
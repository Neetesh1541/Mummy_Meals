import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { supabase, Order } from '../lib/supabase';
import { Bell, Clock, CheckCircle, X, Phone, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

const OrderNotification: React.FC = () => {
  const { user } = useAuth();
  const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'mom') return;

    // Subscribe to new orders for this mom
    const subscription = supabase
      .channel('orders')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'orders',
          filter: `mom_id=eq.${user.id}`,
        },
        (payload) => {
          const newOrder = payload.new as Order;
          setPendingOrders(prev => [...prev, newOrder]);
          setShowNotification(true);
          
          // Play notification sound
          const audio = new Audio('/notification.mp3');
          audio.play().catch(() => {});
          
          // Show toast notification
          toast.success('New order received!', {
            icon: '🔔',
            duration: 5000,
          });
        }
      )
      .subscribe();

    // Fetch existing pending orders
    const fetchPendingOrders = async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('mom_id', user.id)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching pending orders:', error);
        return;
      }

      setPendingOrders(data || []);
      if (data && data.length > 0) {
        setShowNotification(true);
      }
    };

    fetchPendingOrders();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  const handleAcceptOrder = async (orderId: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          status: 'accepted',
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (error) throw error;

      setPendingOrders(prev => prev.filter(order => order.id !== orderId));
      toast.success('Order accepted! Start cooking 👩‍🍳');
      
      // If no more pending orders, hide notification
      if (pendingOrders.length === 1) {
        setShowNotification(false);
      }
    } catch (error) {
      console.error('Error accepting order:', error);
      toast.error('Failed to accept order');
    }
  };

  const handleRejectOrder = async (orderId: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          status: 'cancelled',
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (error) throw error;

      setPendingOrders(prev => prev.filter(order => order.id !== orderId));
      toast.error('Order rejected');
      
      // If no more pending orders, hide notification
      if (pendingOrders.length === 1) {
        setShowNotification(false);
      }
    } catch (error) {
      console.error('Error rejecting order:', error);
      toast.error('Failed to reject order');
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
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                >
                  {/* Order Details */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        Order #{order.id.slice(-6)}
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
                      onClick={() => handleAcceptOrder(order.id)}
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>Accept</span>
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleRejectOrder(order.id)}
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
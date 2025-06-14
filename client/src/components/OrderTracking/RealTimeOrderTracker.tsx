import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, 
  ChefHat, 
  Truck, 
  MapPin, 
  Phone, 
  CheckCircle,
  AlertCircle,
  Navigation,
  Timer,
  User,
  Star,
  X,
  MessageCircle,
  Heart
} from 'lucide-react';
import { useSocket } from '../../contexts/SocketContext';
import { orderAPI } from '../../lib/api';
import toast from 'react-hot-toast';

interface OrderStatus {
  _id: string;
  status: 'pending' | 'accepted' | 'preparing' | 'ready' | 'picked_up' | 'delivered';
  estimatedTime: number; // in minutes
  actualTime?: number;
  foodie_id: any;
  mom_id: any;
  delivery_partner_id?: any;
  items: Array<{
    menu_item_id: string;
    quantity: number;
    price: number;
  }>;
  total_amount: number;
  created_at: string;
  delivery_address: string;
  delivery_instructions?: string;
}

interface RealTimeOrderTrackerProps {
  orderId: string;
  onClose: () => void;
}

const RealTimeOrderTracker: React.FC<RealTimeOrderTrackerProps> = ({ orderId, onClose }) => {
  const { socket, isConnected } = useSocket();
  const [orderStatus, setOrderStatus] = useState<OrderStatus | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [cookingProgress, setCookingProgress] = useState(0);
  const [feedback, setFeedback] = useState({ rating: 5, comment: '' });
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Fetch order details
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const response = await orderAPI.getMyOrders();
        if (response.success) {
          const order = response.orders.find(o => o._id === orderId);
          if (order) {
            setOrderStatus(order);
            if (order.status === 'delivered') {
              setShowFeedback(true);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching order details:', error);
        toast.error('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  // Listen for real-time order updates
  useEffect(() => {
    const handleOrderStatusUpdate = (event: any) => {
      const { orderId: updatedOrderId, status, order } = event.detail;
      if (updatedOrderId === orderId) {
        setOrderStatus(prev => prev ? {
          ...prev,
          status: status,
          actualTime: Math.floor((new Date().getTime() - new Date(prev.created_at).getTime()) / (1000 * 60))
        } : null);
        
        if (status === 'delivered') {
          setShowFeedback(true);
        }
      }
    };

    const handleCookingProgress = (event: any) => {
      const data = event.detail;
      if (data.order_id === orderId) {
        setCookingProgress(data.progress || 0);
        toast.success(data.message, { icon: '👩‍🍳' });
      }
    };

    const handleDeliveryUpdate = (event: any) => {
      const data = event.detail;
      if (data.order_id === orderId) {
        toast.info(data.message, { icon: '🚚' });
      }
    };

    window.addEventListener('order_status_update', handleOrderStatusUpdate);
    window.addEventListener('cooking_progress', handleCookingProgress);
    window.addEventListener('delivery_update', handleDeliveryUpdate);

    return () => {
      window.removeEventListener('order_status_update', handleOrderStatusUpdate);
      window.removeEventListener('cooking_progress', handleCookingProgress);
      window.removeEventListener('delivery_update', handleDeliveryUpdate);
    };
  }, [orderId]);

  const getStatusInfo = (status: string) => {
    const statusMap = {
      pending: { 
        icon: Clock, 
        color: 'text-yellow-500', 
        bg: 'bg-yellow-100 dark:bg-yellow-900/20',
        title: 'Order Placed',
        description: 'Waiting for chef to accept your order',
        progress: 10
      },
      accepted: { 
        icon: CheckCircle, 
        color: 'text-green-500', 
        bg: 'bg-green-100 dark:bg-green-900/20',
        title: 'Order Accepted',
        description: 'Chef has accepted your order',
        progress: 25
      },
      preparing: { 
        icon: ChefHat, 
        color: 'text-orange-500', 
        bg: 'bg-orange-100 dark:bg-orange-900/20',
        title: 'Cooking in Progress',
        description: 'Your meal is being prepared with love',
        progress: 50 + (cookingProgress * 0.3)
      },
      ready: { 
        icon: AlertCircle, 
        color: 'text-blue-500', 
        bg: 'bg-blue-100 dark:bg-blue-900/20',
        title: 'Ready for Pickup',
        description: 'Meal is ready, waiting for delivery partner',
        progress: 80
      },
      picked_up: { 
        icon: Truck, 
        color: 'text-purple-500', 
        bg: 'bg-purple-100 dark:bg-purple-900/20',
        title: 'Out for Delivery',
        description: 'Your order is on the way',
        progress: 90
      },
      delivered: { 
        icon: CheckCircle, 
        color: 'text-green-600', 
        bg: 'bg-green-100 dark:bg-green-900/20',
        title: 'Delivered',
        description: 'Enjoy your meal!',
        progress: 100
      }
    };
    return statusMap[status as keyof typeof statusMap];
  };

  const submitFeedback = () => {
    if (socket && orderStatus) {
      socket.emit('order_feedback', {
        order_id: orderId,
        chef_id: orderStatus.mom_id._id,
        rating: feedback.rating,
        comment: feedback.comment
      });
      toast.success('Thank you for your feedback!');
      setShowFeedback(false);
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-md w-full p-8 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      </motion.div>
    );
  }

  if (!orderStatus) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-md w-full p-8 text-center">
          <p className="text-gray-600 dark:text-gray-400">Order not found</p>
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    );
  }

  const currentStatusInfo = getStatusInfo(orderStatus.status);
  const StatusIcon = currentStatusInfo.icon;

  const getTimeElapsed = () => {
    const orderTime = new Date(orderStatus.created_at);
    const elapsedMinutes = Math.floor((currentTime.getTime() - orderTime.getTime()) / (1000 * 60));
    return elapsedMinutes;
  };

  const getEstimatedTimeRemaining = () => {
    const elapsed = getTimeElapsed();
    const estimated = orderStatus.estimatedTime || 45;
    return Math.max(0, estimated - elapsed);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-gray-900 warm:bg-orange-50 green:bg-green-50 rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 warm:border-orange-200 green:border-green-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white warm:text-gray-800 green:text-gray-900">
              Live Order Tracking
            </h2>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-xs text-gray-500">
                {isConnected ? 'Live' : 'Offline'}
              </span>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 warm:hover:bg-orange-100 green:hover:bg-green-100 rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          <div className="text-sm text-gray-600 dark:text-gray-400 warm:text-gray-700 green:text-gray-600">
            Order #{orderId.slice(-6)}
          </div>
        </div>

        {/* Current Status */}
        <div className="p-6">
          <div className={`flex items-center space-x-4 p-4 rounded-2xl ${currentStatusInfo.bg} mb-6`}>
            <div className={`p-3 rounded-full bg-white dark:bg-gray-800 warm:bg-orange-100 green:bg-green-100 ${currentStatusInfo.color}`}>
              <StatusIcon className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-white warm:text-gray-800 green:text-gray-900">
                {currentStatusInfo.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 warm:text-gray-700 green:text-gray-600">
                {currentStatusInfo.description}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 warm:text-gray-600 green:text-gray-500 mb-2">
              <span>Progress</span>
              <span>{Math.round(currentStatusInfo.progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 warm:bg-orange-200 green:bg-green-200 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-orange-500 to-pink-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${currentStatusInfo.progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* Time Information */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 warm:bg-orange-100 green:bg-green-100 rounded-xl">
              <Timer className="h-6 w-6 text-orange-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white warm:text-gray-800 green:text-gray-900">
                {getEstimatedTimeRemaining()}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 warm:text-gray-700 green:text-gray-600">
                Minutes Left
              </div>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 warm:bg-orange-100 green:bg-green-100 rounded-xl">
              <Clock className="h-6 w-6 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white warm:text-gray-800 green:text-gray-900">
                {getTimeElapsed()}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 warm:text-gray-700 green:text-gray-600">
                Minutes Elapsed
              </div>
            </div>
          </div>

          {/* Chef Information */}
          {orderStatus.mom_id && (
            <div className="mb-6 p-4 bg-gradient-to-r from-orange-50 to-pink-50 dark:from-orange-900/20 dark:to-pink-900/20 warm:from-orange-100 warm:to-pink-100 green:from-green-50 green:to-emerald-50 rounded-xl">
              <h4 className="font-semibold text-gray-900 dark:text-white warm:text-gray-800 green:text-gray-900 mb-3 flex items-center">
                <ChefHat className="h-5 w-5 mr-2 text-orange-500" />
                Your Chef
              </h4>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-400 to-pink-400 flex items-center justify-center">
                  <span className="text-white font-bold">
                    {orderStatus.mom_id.name?.charAt(0) || 'M'}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900 dark:text-white warm:text-gray-800 green:text-gray-900">
                    {orderStatus.mom_id.name || 'Chef Mom'}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 warm:text-gray-700 green:text-gray-600">
                    Home Kitchen
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600 dark:text-gray-400 warm:text-gray-700 green:text-gray-600">
                      4.8
                    </span>
                  </div>
                </div>
                {orderStatus.mom_id.phone && (
                  <a
                    href={`tel:${orderStatus.mom_id.phone}`}
                    className="p-2 bg-white dark:bg-gray-800 warm:bg-orange-100 green:bg-green-100 rounded-full shadow-sm hover:shadow-md transition-shadow"
                  >
                    <Phone className="h-4 w-4 text-green-500" />
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Delivery Partner Information */}
          {orderStatus.delivery_partner_id && orderStatus.status !== 'pending' && orderStatus.status !== 'accepted' && (
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 warm:from-blue-100 warm:to-purple-100 green:from-blue-50 green:to-purple-50 rounded-xl">
              <h4 className="font-semibold text-gray-900 dark:text-white warm:text-gray-800 green:text-gray-900 mb-3 flex items-center">
                <Truck className="h-5 w-5 mr-2 text-blue-500" />
                Delivery Partner
              </h4>
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center">
                  <span className="text-white font-bold">
                    {orderStatus.delivery_partner_id.name?.charAt(0) || 'D'}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900 dark:text-white warm:text-gray-800 green:text-gray-900">
                    {orderStatus.delivery_partner_id.name || 'Delivery Partner'}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 warm:text-gray-700 green:text-gray-600">
                    Bike • ⭐ 4.6
                  </div>
                </div>
                {orderStatus.delivery_partner_id.phone && (
                  <a
                    href={`tel:${orderStatus.delivery_partner_id.phone}`}
                    className="p-2 bg-white dark:bg-gray-800 warm:bg-orange-100 green:bg-green-100 rounded-full shadow-sm hover:shadow-md transition-shadow"
                  >
                    <Phone className="h-4 w-4 text-green-500" />
                  </a>
                )}
              </div>
              
              {orderStatus.status === 'picked_up' && (
                <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 warm:bg-orange-100 green:bg-green-100 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Navigation className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white warm:text-gray-800 green:text-gray-900">
                      Live Location
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 warm:text-gray-700 green:text-gray-600">
                    15 min away
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Order Items */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 dark:text-white warm:text-gray-800 green:text-gray-900 mb-3">
              Order Items
            </h4>
            <div className="space-y-2">
              {orderStatus.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 warm:bg-orange-100 green:bg-green-100 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white warm:text-gray-800 green:text-gray-900">
                      Item #{item.menu_item_id}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 warm:text-gray-700 green:text-gray-600">
                      Qty: {item.quantity}
                    </div>
                  </div>
                  <div className="font-semibold text-gray-900 dark:text-white warm:text-gray-800 green:text-gray-900">
                    ₹{item.price}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 warm:border-orange-200 green:border-green-200">
              <span className="font-semibold text-gray-900 dark:text-white warm:text-gray-800 green:text-gray-900">
                Total Amount
              </span>
              <span className="font-bold text-lg text-orange-600 dark:text-orange-400 warm:text-orange-700 green:text-green-600">
                ₹{orderStatus.total_amount}
              </span>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="p-4 bg-gray-50 dark:bg-gray-800 warm:bg-orange-100 green:bg-green-100 rounded-xl">
            <div className="flex items-start space-x-3">
              <MapPin className="h-5 w-5 text-red-500 mt-0.5" />
              <div>
                <div className="font-medium text-gray-900 dark:text-white warm:text-gray-800 green:text-gray-900 mb-1">
                  Delivery Address
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 warm:text-gray-700 green:text-gray-600">
                  {orderStatus.delivery_address}
                </div>
                {orderStatus.delivery_instructions && (
                  <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                    Instructions: {orderStatus.delivery_instructions}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Feedback Modal */}
        <AnimatePresence>
          {showFeedback && orderStatus.status === 'delivered' && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="absolute inset-0 bg-black/50 flex items-center justify-center p-4"
            >
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-sm w-full">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Heart className="h-5 w-5 mr-2 text-red-500" />
                  Rate Your Experience
                </h3>
                
                <div className="mb-4">
                  <div className="flex justify-center space-x-2 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setFeedback(prev => ({ ...prev, rating: star }))}
                        className={`text-2xl ${star <= feedback.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                      >
                        ⭐
                      </button>
                    ))}
                  </div>
                  
                  <textarea
                    value={feedback.comment}
                    onChange={(e) => setFeedback(prev => ({ ...prev, comment: e.target.value }))}
                    placeholder="Share your experience..."
                    className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
                    rows={3}
                  />
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowFeedback(false)}
                    className="flex-1 py-2 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    Skip
                  </button>
                  <button
                    onClick={submitFeedback}
                    className="flex-1 py-2 px-4 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center justify-center space-x-2"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>Submit</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default RealTimeOrderTracker;
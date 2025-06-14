import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';
import { menuAPI, orderAPI } from '../lib/api';
import { 
  Heart, 
  TrendingUp, 
  Clock, 
  DollarSign, 
  Users, 
  Star,
  ShoppingBag,
  ChefHat,
  Calendar,
  Award,
  MapPin,
  Bell,
  Settings,
  BarChart3,
  Package,
  Plus,
  Edit,
  Trash2,
  Upload,
  Image as ImageIcon,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { socket, isConnected } = useSocket();
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [showAddMenuItem, setShowAddMenuItem] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [newMenuItem, setNewMenuItem] = useState({
    name: '',
    description: '',
    price: '',
    category: 'main',
    is_veg: true,
    is_jain: false,
    is_healthy: false,
    tags: '',
    preparation_time: '30',
    image_url: ''
  });

  const isFoodBuddy = user?.role === 'foodie';
  const isMom = user?.role === 'mom';
  const isDeliveryPartner = user?.role === 'delivery';

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  useEffect(() => {
    // Listen for real-time order updates
    const handleNewOrder = (data: any) => {
      console.log('New order received:', data);
      setOrders(prev => [data.order, ...prev]);
      toast.success('New order received!', {
        icon: '🔔',
        duration: 5000,
      });
    };

    const handleOrderStatusUpdate = (data: any) => {
      console.log('Order status updated:', data);
      setOrders(prev => 
        prev.map(order => 
          order._id === data.orderId 
            ? { ...order, status: data.status }
            : order
        )
      );
      toast.success(data.message);
    };

    window.addEventListener('new_order', handleNewOrder);
    window.addEventListener('order_status_update', handleOrderStatusUpdate);

    return () => {
      window.removeEventListener('new_order', handleNewOrder);
      window.removeEventListener('order_status_update', handleOrderStatusUpdate);
    };
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load orders
      const ordersResponse = await orderAPI.getMyOrders();
      if (ordersResponse.success) {
        setOrders(ordersResponse.orders);
      }

      // Load menu items for moms
      if (isMom) {
        const menuResponse = await menuAPI.getMenuItems();
        if (menuResponse.success) {
          // Filter items by current mom
          const myItems = menuResponse.items.filter(item => item.mom_id === user._id);
          setMenuItems(myItems);
        }
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMenuItem = async () => {
    try {
      if (!newMenuItem.name || !newMenuItem.price) {
        toast.error('Name and price are required');
        return;
      }

      const menuItemData = {
        ...newMenuItem,
        price: parseFloat(newMenuItem.price),
        preparation_time: parseInt(newMenuItem.preparation_time),
        tags: newMenuItem.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        image_url: newMenuItem.image_url || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1'
      };

      const response = await menuAPI.addMenuItem(menuItemData);
      if (response.success) {
        setMenuItems(prev => [response.item, ...prev]);
        setShowAddMenuItem(false);
        setNewMenuItem({
          name: '',
          description: '',
          price: '',
          category: 'main',
          is_veg: true,
          is_jain: false,
          is_healthy: false,
          tags: '',
          preparation_time: '30',
          image_url: ''
        });
        toast.success('Menu item added successfully!');
      }
    } catch (error: any) {
      console.error('Error adding menu item:', error);
      toast.error(error.response?.data?.message || 'Failed to add menu item');
    }
  };

  const handleUpdateMenuItem = async (itemId: string, updates: any) => {
    try {
      const response = await menuAPI.updateMenuItem(itemId, updates);
      if (response.success) {
        setMenuItems(prev => 
          prev.map(item => 
            item._id === itemId ? response.item : item
          )
        );
        setEditingItem(null);
        toast.success('Menu item updated successfully!');
      }
    } catch (error: any) {
      console.error('Error updating menu item:', error);
      toast.error(error.response?.data?.message || 'Failed to update menu item');
    }
  };

  const handleDeleteMenuItem = async (itemId: string) => {
    try {
      const response = await menuAPI.deleteMenuItem(itemId);
      if (response.success) {
        setMenuItems(prev => prev.filter(item => item._id !== itemId));
        toast.success('Menu item deleted successfully!');
      }
    } catch (error: any) {
      console.error('Error deleting menu item:', error);
      toast.error(error.response?.data?.message || 'Failed to delete menu item');
    }
  };

  const handleOrderStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      const response = await orderAPI.updateOrderStatus(orderId, newStatus);
      if (response.success) {
        setOrders(prev => 
          prev.map(order => 
            order._id === orderId 
              ? { ...order, status: newStatus }
              : order
          )
        );
        toast.success(`Order status updated to ${newStatus}`);
      }
    } catch (error: any) {
      console.error('Error updating order status:', error);
      toast.error(error.response?.data?.message || 'Failed to update order status');
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-blue-100 text-blue-800',
      preparing: 'bg-orange-100 text-orange-800',
      ready: 'bg-purple-100 text-purple-800',
      picked_up: 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getNextStatus = (currentStatus: string) => {
    const statusFlow = {
      pending: 'accepted',
      accepted: 'preparing',
      preparing: 'ready',
      ready: 'picked_up',
      picked_up: 'delivered'
    };
    return statusFlow[currentStatus as keyof typeof statusFlow];
  };

  if (!user) return null;

  // Mock stats for demonstration
  const stats = {
    foodie: {
      totalOrders: orders.length,
      activeOrders: orders.filter(o => !['delivered', 'cancelled'].includes(o.status)).length,
      favoriteChefs: 8,
      totalSpent: orders.reduce((sum, order) => sum + order.total_amount, 0)
    },
    mom: {
      totalEarnings: orders.filter(o => o.status === 'delivered').reduce((sum, order) => sum + order.total_amount, 0),
      activeOrders: orders.filter(o => !['delivered', 'cancelled'].includes(o.status)).length,
      totalCustomers: new Set(orders.map(o => o.foodie_id)).size,
      menuItems: menuItems.length
    },
    delivery: {
      totalDeliveries: orders.filter(o => o.status === 'delivered').length,
      activeDeliveries: orders.filter(o => ['picked_up'].includes(o.status)).length,
      totalEarnings: orders.filter(o => o.status === 'delivered').length * 25, // ₹25 per delivery
      rating: 4.7
    }
  };

  const StatCard: React.FC<{ icon: React.ElementType; title: string; value: string | number; subtitle?: string; color: string }> = 
    ({ icon: Icon, title, value, subtitle, color }) => (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-gray-800 warm:bg-orange-50 green:bg-green-50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-r ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <TrendingUp className="h-5 w-5 text-green-500" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white warm:text-gray-800 green:text-gray-900 mb-1">
        {value}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 warm:text-gray-700 green:text-gray-600 font-medium">
        {title}
      </p>
      {subtitle && (
        <p className="text-sm text-gray-500 dark:text-gray-500 warm:text-gray-600 green:text-gray-500 mt-1">
          {subtitle}
        </p>
      )}
    </motion.div>
  );

  return (
    <div className="min-h-screen pt-16 bg-gray-50 dark:bg-gray-900 warm:bg-orange-100 green:bg-green-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white warm:text-gray-800 green:text-gray-900 mb-2">
                Welcome back, {user.name.split(' ')[0]}! 👋
              </h1>
              <p className="text-gray-600 dark:text-gray-400 warm:text-gray-700 green:text-gray-600">
                {isFoodBuddy && "Here's your meal summary and recent activity."}
                {isMom && "Manage your kitchen and track today's orders."}
                {isDeliveryPartner && "Track your deliveries and earnings."}
              </p>
              <div className="flex items-center space-x-2 mt-2">
                <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-sm text-gray-500">
                  {isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 rounded-full bg-white dark:bg-gray-800 warm:bg-orange-50 green:bg-green-50 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Bell className="h-6 w-6 text-orange-600 dark:text-orange-400 warm:text-orange-700 green:text-green-600" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 rounded-full bg-white dark:bg-gray-800 warm:bg-orange-50 green:bg-green-50 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Settings className="h-6 w-6 text-orange-600 dark:text-orange-400 warm:text-orange-700 green:text-green-600" />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {isFoodBuddy && (
            <>
              <StatCard
                icon={ShoppingBag}
                title="Total Orders"
                value={stats.foodie.totalOrders}
                color="from-blue-500 to-blue-600"
              />
              <StatCard
                icon={Clock}
                title="Active Orders"
                value={stats.foodie.activeOrders}
                color="from-green-500 to-green-600"
              />
              <StatCard
                icon={Heart}
                title="Favorite Chefs"
                value={stats.foodie.favoriteChefs}
                color="from-pink-500 to-pink-600"
              />
              <StatCard
                icon={DollarSign}
                title="Total Spent"
                value={`₹${stats.foodie.totalSpent}`}
                color="from-orange-500 to-orange-600"
              />
            </>
          )}

          {isMom && (
            <>
              <StatCard
                icon={DollarSign}
                title="Total Earnings"
                value={`₹${stats.mom.totalEarnings}`}
                color="from-green-500 to-green-600"
              />
              <StatCard
                icon={Package}
                title="Active Orders"
                value={stats.mom.activeOrders}
                color="from-blue-500 to-blue-600"
              />
              <StatCard
                icon={Users}
                title="Total Customers"
                value={stats.mom.totalCustomers}
                color="from-purple-500 to-purple-600"
              />
              <StatCard
                icon={ChefHat}
                title="Menu Items"
                value={stats.mom.menuItems}
                color="from-orange-500 to-orange-600"
              />
            </>
          )}

          {isDeliveryPartner && (
            <>
              <StatCard
                icon={Package}
                title="Total Deliveries"
                value={stats.delivery.totalDeliveries}
                color="from-blue-500 to-blue-600"
              />
              <StatCard
                icon={Clock}
                title="Active Deliveries"
                value={stats.delivery.activeDeliveries}
                color="from-orange-500 to-orange-600"
              />
              <StatCard
                icon={DollarSign}
                title="Total Earnings"
                value={`₹${stats.delivery.totalEarnings}`}
                color="from-green-500 to-green-600"
              />
              <StatCard
                icon={Star}
                title="Rating"
                value={stats.delivery.rating}
                color="from-yellow-500 to-yellow-600"
              />
            </>
          )}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Orders Management */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 warm:bg-orange-50 green:bg-green-50 rounded-2xl p-6 shadow-lg"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white warm:text-gray-800 green:text-gray-900">
                  {isFoodBuddy ? 'My Orders' : isMom ? 'Incoming Orders' : 'Delivery Tasks'}
                </h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={loadDashboardData}
                  className="text-orange-600 dark:text-orange-400 warm:text-orange-700 green:text-green-600 hover:underline font-medium flex items-center space-x-1"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  <span>Refresh</span>
                </motion.button>
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {orders.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No orders yet</p>
                  </div>
                ) : (
                  orders.map((order, index) => (
                    <motion.div
                      key={order._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 warm:bg-orange-100 green:bg-green-100 rounded-xl"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-400 to-pink-400 flex items-center justify-center">
                          <Package className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white warm:text-gray-800 green:text-gray-900">
                            Order #{order._id.slice(-6)}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 warm:text-gray-700 green:text-gray-600">
                            {order.items?.length || 0} items • ₹{order.total_amount}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(order.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                        {(isMom || isDeliveryPartner) && getNextStatus(order.status) && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleOrderStatusUpdate(order._id, getNextStatus(order.status))}
                            className="px-3 py-1 bg-orange-500 text-white rounded-lg text-xs font-medium hover:bg-orange-600 transition-colors"
                          >
                            {getNextStatus(order.status) === 'accepted' && 'Accept'}
                            {getNextStatus(order.status) === 'preparing' && 'Start Cooking'}
                            {getNextStatus(order.status) === 'ready' && 'Mark Ready'}
                            {getNextStatus(order.status) === 'picked_up' && 'Pick Up'}
                            {getNextStatus(order.status) === 'delivered' && 'Delivered'}
                          </motion.button>
                        )}
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>

            {/* Menu Management for Moms */}
            {isMom && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white dark:bg-gray-800 warm:bg-orange-50 green:bg-green-50 rounded-2xl p-6 shadow-lg"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white warm:text-gray-800 green:text-gray-900">
                    My Menu Items
                  </h2>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowAddMenuItem(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all duration-300"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Item</span>
                  </motion.button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                  {menuItems.map((item) => (
                    <div key={item._id} className="border border-gray-200 dark:border-gray-600 rounded-xl p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white">{item.name}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{item.description}</p>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-orange-600">₹{item.price}</span>
                            <span className={`w-3 h-3 rounded-full ${item.is_veg ? 'bg-green-500' : 'bg-red-500'}`}></span>
                            {item.is_jain && <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Jain</span>}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setEditingItem(item)}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"
                          >
                            <Edit className="h-4 w-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDeleteMenuItem(item._id)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                          >
                            <Trash2 className="h-4 w-4" />
                          </motion.button>
                        </div>
                      </div>
                      {item.image_url && (
                        <img src={item.image_url} alt={item.name} className="w-full h-32 object-cover rounded-lg" />
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-800 warm:bg-orange-50 green:bg-green-50 rounded-2xl p-6 shadow-lg"
            >
              <h2 className="text-xl font-bold text-gray-900 dark:text-white warm:text-gray-800 green:text-gray-900 mb-6">
                Quick Actions
              </h2>
              
              <div className="space-y-3">
                {isFoodBuddy && (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => window.location.href = '/menu'}
                      className="w-full flex items-center space-x-3 p-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all duration-300"
                    >
                      <ShoppingBag className="h-5 w-5" />
                      <span>Order Now</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center space-x-3 p-4 bg-white dark:bg-gray-700 warm:bg-orange-100 green:bg-green-100 border border-orange-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-orange-50 transition-all duration-300"
                    >
                      <Heart className="h-5 w-5" />
                      <span>Browse Chefs</span>
                    </motion.button>
                  </>
                )}

                {isMom && (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowAddMenuItem(true)}
                      className="w-full flex items-center space-x-3 p-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:shadow-lg transition-all duration-300"
                    >
                      <Plus className="h-5 w-5" />
                      <span>Add Menu Item</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center space-x-3 p-4 bg-white dark:bg-gray-700 border border-orange-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-orange-50 transition-all duration-300"
                    >
                      <BarChart3 className="h-5 w-5" />
                      <span>View Analytics</span>
                    </motion.button>
                  </>
                )}

                {isDeliveryPartner && (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:shadow-lg transition-all duration-300"
                    >
                      <MapPin className="h-5 w-5" />
                      <span>Go Online</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center space-x-3 p-4 bg-white dark:bg-gray-700 border border-orange-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-orange-50 transition-all duration-300"
                    >
                      <BarChart3 className="h-5 w-5" />
                      <span>View Earnings</span>
                    </motion.button>
                  </>
                )}
              </div>
            </motion.div>

            {/* Profile Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white dark:bg-gray-800 warm:bg-orange-50 green:bg-green-50 rounded-2xl p-6 shadow-lg"
            >
              <h2 className="text-xl font-bold text-gray-900 dark:text-white warm:text-gray-800 green:text-gray-900 mb-6">
                Profile Summary
              </h2>
              
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-orange-400 to-pink-400 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">
                    {user.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {user.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {isFoodBuddy ? 'Food Buddy' : isMom ? 'Mummy Chef' : 'Delivery Partner'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {user.email}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {user.address || 'New Delhi, India'}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {isFoodBuddy ? 'Verified Food Buddy' : isMom ? 'Certified Home Chef' : 'Verified Delivery Partner'}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Add Menu Item Modal */}
        <AnimatePresence>
          {showAddMenuItem && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowAddMenuItem(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Add Menu Item</h2>
                  <button
                    onClick={() => setShowAddMenuItem(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Item Name *
                    </label>
                    <input
                      type="text"
                      value={newMenuItem.name}
                      onChange={(e) => setNewMenuItem(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="e.g., Dal Chawal Combo"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description
                    </label>
                    <textarea
                      value={newMenuItem.description}
                      onChange={(e) => setNewMenuItem(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      rows={3}
                      placeholder="Describe your delicious meal..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Price (₹) *
                      </label>
                      <input
                        type="number"
                        value={newMenuItem.price}
                        onChange={(e) => setNewMenuItem(prev => ({ ...prev, price: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        placeholder="120"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Prep Time (min)
                      </label>
                      <input
                        type="number"
                        value={newMenuItem.preparation_time}
                        onChange={(e) => setNewMenuItem(prev => ({ ...prev, preparation_time: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        placeholder="30"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Image URL
                    </label>
                    <input
                      type="url"
                      value={newMenuItem.image_url}
                      onChange={(e) => setNewMenuItem(prev => ({ ...prev, image_url: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tags (comma separated)
                    </label>
                    <input
                      type="text"
                      value={newMenuItem.tags}
                      onChange={(e) => setNewMenuItem(prev => ({ ...prev, tags: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="Homestyle, Comfort Food, Vegetarian"
                    />
                  </div>

                  <div className="flex flex-wrap gap-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={newMenuItem.is_veg}
                        onChange={(e) => setNewMenuItem(prev => ({ ...prev, is_veg: e.target.checked }))}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Vegetarian</span>
                    </label>

                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={newMenuItem.is_jain}
                        onChange={(e) => setNewMenuItem(prev => ({ ...prev, is_jain: e.target.checked }))}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Jain</span>
                    </label>

                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={newMenuItem.is_healthy}
                        onChange={(e) => setNewMenuItem(prev => ({ ...prev, is_healthy: e.target.checked }))}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Healthy</span>
                    </label>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAddMenuItem}
                    className="w-full py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <Save className="h-5 w-5" />
                    <span>Add Menu Item</span>
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Dashboard;
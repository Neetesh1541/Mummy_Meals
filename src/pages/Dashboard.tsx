import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
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
  Package
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  const isFoodBuddy = user.role === 'foodie';

  // Mock data for Food Buddy
  const foodBuddyStats = {
    totalOrders: 45,
    activeSubscriptions: 3,
    favoriteChefs: 8,
    totalSpent: 4500
  };

  const recentOrders = [
    { id: 1, chef: 'Priya Aunty', meal: 'Dal Chawal + Sabzi', date: '2024-01-15', status: 'delivered', rating: 5 },
    { id: 2, chef: 'Sunita Mummy', meal: 'Rajma Rice + Roti', date: '2024-01-14', status: 'delivered', rating: 5 },
    { id: 3, chef: 'Kavita Ma', meal: 'Chole Bhature', date: '2024-01-13', status: 'delivered', rating: 4 },
  ];

  // Mock data for Mummy Chef
  const mummyChefStats = {
    totalEarnings: 12500,
    activeOrders: 8,
    totalCustomers: 35,
    rating: 4.8
  };

  const todaysOrders = [
    { id: 1, customer: 'Rahul K.', meal: 'Dal Chawal Thali', time: '1:00 PM', status: 'preparing' },
    { id: 2, customer: 'Priya S.', meal: 'Rajma Rice', time: '1:30 PM', status: 'ready' },
    { id: 3, customer: 'Amit G.', meal: 'Chole Bhature', time: '2:00 PM', status: 'pending' },
  ];

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
                {isFoodBuddy 
                  ? "Here's your meal summary and recent activity."
                  : "Here's your kitchen dashboard and today's orders."
                }
              </p>
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
          {isFoodBuddy ? (
            <>
              <StatCard
                icon={ShoppingBag}
                title="Total Orders"
                value={foodBuddyStats.totalOrders}
                color="from-blue-500 to-blue-600"
              />
              <StatCard
                icon={Calendar}
                title="Active Plans"
                value={foodBuddyStats.activeSubscriptions}
                color="from-green-500 to-green-600"
              />
              <StatCard
                icon={Heart}
                title="Favorite Chefs"
                value={foodBuddyStats.favoriteChefs}
                color="from-pink-500 to-pink-600"
              />
              <StatCard
                icon={DollarSign}
                title="Total Spent"
                value={`₹${foodBuddyStats.totalSpent}`}
                color="from-orange-500 to-orange-600"
              />
            </>
          ) : (
            <>
              <StatCard
                icon={DollarSign}
                title="Total Earnings"
                value={`₹${mummyChefStats.totalEarnings}`}
                color="from-green-500 to-green-600"
              />
              <StatCard
                icon={Package}
                title="Active Orders"
                value={mummyChefStats.activeOrders}
                color="from-blue-500 to-blue-600"
              />
              <StatCard
                icon={Users}
                title="Total Customers"
                value={mummyChefStats.totalCustomers}
                color="from-purple-500 to-purple-600"
              />
              <StatCard
                icon={Star}
                title="Average Rating"
                value={mummyChefStats.rating}
                subtitle="Based on 245 reviews"
                color="from-yellow-500 to-yellow-600"
              />
            </>
          )}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 warm:bg-orange-50 green:bg-green-50 rounded-2xl p-6 shadow-lg"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white warm:text-gray-800 green:text-gray-900">
                  {isFoodBuddy ? 'Recent Orders' : 'Today\'s Orders'}
                </h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-orange-600 dark:text-orange-400 warm:text-orange-700 green:text-green-600 hover:underline font-medium"
                >
                  View All
                </motion.button>
              </div>

              <div className="space-y-4">
                {(isFoodBuddy ? recentOrders : todaysOrders).map((order, index) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 warm:bg-orange-100 green:bg-green-100 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 warm:hover:bg-orange-200 green:hover:bg-green-200 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-400 to-pink-400 dark:from-orange-500 dark:to-pink-500 warm:from-orange-300 warm:to-pink-300 green:from-green-400 green:to-emerald-400 flex items-center justify-center">
                        {isFoodBuddy ? <ChefHat className="h-6 w-6 text-white" /> : <Users className="h-6 w-6 text-white" />}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white warm:text-gray-800 green:text-gray-900">
                          {isFoodBuddy ? (order as any).chef : (order as any).customer}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 warm:text-gray-700 green:text-gray-600">
                          {order.meal}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 warm:text-gray-600 green:text-gray-500">
                          {isFoodBuddy ? (order as any).date : (order as any).time}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        order.status === 'delivered' || order.status === 'ready'
                          ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400'
                          : order.status === 'preparing'
                          ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400'
                          : 'bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-400'
                      }`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                      {isFoodBuddy && (order as any).rating && (
                        <div className="flex items-center justify-end mt-1">
                          {[...Array((order as any).rating)].map((_, i) => (
                            <Star key={i} className="h-3 w-3 text-yellow-400 fill-current" />
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Chart/Analytics Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white dark:bg-gray-800 warm:bg-orange-50 green:bg-green-50 rounded-2xl p-6 shadow-lg"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white warm:text-gray-800 green:text-gray-900">
                  {isFoodBuddy ? 'Spending Overview' : 'Earnings Overview'}
                </h2>
                <BarChart3 className="h-6 w-6 text-orange-600 dark:text-orange-400 warm:text-orange-700 green:text-green-600" />
              </div>
              
              <div className="h-64 flex items-center justify-center bg-gradient-to-br from-orange-50 to-pink-50 dark:from-gray-700 dark:to-gray-600 warm:from-orange-100 warm:to-pink-100 green:from-green-100 green:to-emerald-100 rounded-xl">
                <div className="text-center">
                  <BarChart3 className="h-16 w-16 text-orange-400 dark:text-orange-300 warm:text-orange-500 green:text-green-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400 warm:text-gray-700 green:text-gray-600">
                    Analytics chart will be displayed here
                  </p>
                </div>
              </div>
            </motion.div>
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
                {isFoodBuddy ? (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center space-x-3 p-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all duration-300"
                    >
                      <ShoppingBag className="h-5 w-5" />
                      <span>Order Now</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center space-x-3 p-4 bg-white dark:bg-gray-700 warm:bg-orange-100 green:bg-green-100 border border-orange-200 dark:border-gray-600 warm:border-orange-300 green:border-green-200 text-gray-700 dark:text-gray-300 warm:text-gray-800 green:text-gray-700 rounded-xl hover:bg-orange-50 dark:hover:bg-gray-600 warm:hover:bg-orange-200 green:hover:bg-green-200 transition-all duration-300"
                    >
                      <Calendar className="h-5 w-5" />
                      <span>Schedule Meals</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center space-x-3 p-4 bg-white dark:bg-gray-700 warm:bg-orange-100 green:bg-green-100 border border-orange-200 dark:border-gray-600 warm:border-orange-300 green:border-green-200 text-gray-700 dark:text-gray-300 warm:text-gray-800 green:text-gray-700 rounded-xl hover:bg-orange-50 dark:hover:bg-gray-600 warm:hover:bg-orange-200 green:hover:bg-green-200 transition-all duration-300"
                    >
                      <Heart className="h-5 w-5" />
                      <span>Browse Chefs</span>
                    </motion.button>
                  </>
                ) : (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center space-x-3 p-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:shadow-lg transition-all duration-300"
                    >
                      <Package className="h-5 w-5" />
                      <span>Add Menu Item</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center space-x-3 p-4 bg-white dark:bg-gray-700 warm:bg-orange-100 green:bg-green-100 border border-orange-200 dark:border-gray-600 warm:border-orange-300 green:border-green-200 text-gray-700 dark:text-gray-300 warm:text-gray-800 green:text-gray-700 rounded-xl hover:bg-orange-50 dark:hover:bg-gray-600 warm:hover:bg-orange-200 green:hover:bg-green-200 transition-all duration-300"
                    >
                      <Clock className="h-5 w-5" />
                      <span>Update Availability</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center space-x-3 p-4 bg-white dark:bg-gray-700 warm:bg-orange-100 green:bg-green-100 border border-orange-200 dark:border-gray-600 warm:border-orange-300 green:border-green-200 text-gray-700 dark:text-gray-300 warm:text-gray-800 green:text-gray-700 rounded-xl hover:bg-orange-50 dark:hover:bg-gray-600 warm:hover:bg-orange-200 green:hover:bg-green-200 transition-all duration-300"
                    >
                      <BarChart3 className="h-5 w-5" />
                      <span>View Analytics</span>
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
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-orange-400 to-pink-400 dark:from-orange-500 dark:to-pink-500 warm:from-orange-300 warm:to-pink-300 green:from-green-400 green:to-emerald-400 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">
                    {user.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white warm:text-gray-800 green:text-gray-900">
                    {user.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 warm:text-gray-700 green:text-gray-600">
                    {isFoodBuddy ? 'Food Buddy' : 'Mummy Chef'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 warm:text-gray-600 green:text-gray-500">
                    {user.email}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400 warm:text-gray-700 green:text-gray-600">
                    {user.address || 'New Delhi, India'}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400 warm:text-gray-700 green:text-gray-600">
                    {isFoodBuddy ? 'Verified Food Buddy' : 'Certified Home Chef'}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { menuAPI } from '../lib/api';
import { 
  Search, 
  Filter, 
  Star, 
  MapPin, 
  Clock, 
  Heart,
  ChefHat,
  Leaf,
  ShoppingCart,
  Plus,
  Minus,
  Eye
} from 'lucide-react';
import RealTimeOrderTracker from '../components/OrderTracking/RealTimeOrderTracker';
import Cart from '../components/Cart/Cart';
import toast from 'react-hot-toast';

const Menu: React.FC = () => {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedChef, setSelectedChef] = useState('all');
  const [cart, setCart] = useState<{[key: number]: number}>({});
  const [showOrderTracker, setShowOrderTracker] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [trackedOrderId, setTrackedOrderId] = useState('');
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: 'all', name: 'All Items', icon: '🍽️' },
    { id: 'veg', name: 'Vegetarian', icon: '🥗' },
    { id: 'nonveg', name: 'Non-Vegetarian', icon: '🍗' },
    { id: 'jain', name: 'Jain', icon: '🌿' },
    { id: 'healthy', name: 'Healthy', icon: '💪' },
    { id: 'regional', name: 'Regional', icon: '🏠' }
  ];

  const chefs = [
    { id: 'all', name: 'All Chefs' },
    { id: 'priya', name: 'Priya Aunty' },
    { id: 'sunita', name: 'Sunita Mummy' },
    { id: 'kavita', name: 'Kavita Ma' },
    { id: 'rekha', name: 'Rekha Didi' }
  ];

  // Mock data for demonstration
  const mockMenuItems = [
    {
      id: 1,
      name: 'Dal Chawal Combo',
      chef: 'Priya Aunty',
      chefId: 'priya',
      category: 'veg',
      price: 120,
      rating: 4.8,
      reviews: 156,
      distance: '0.8 km',
      time: '25-30 min',
      image: 'https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1',
      description: 'Traditional dal with steamed rice, mixed vegetables, pickle, and papad',
      tags: ['Homestyle', 'Comfort Food', 'Vegetarian'],
      isVeg: true,
      isJain: false,
      isHealthy: true,
      isLive: true
    },
    {
      id: 2,
      name: 'Rajma Rice Bowl',
      chef: 'Sunita Mummy',
      chefId: 'sunita',
      category: 'veg',
      price: 140,
      rating: 4.9,
      reviews: 203,
      distance: '1.2 km',
      time: '30-35 min',
      image: 'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1',
      description: 'Kidney beans curry with basmati rice, salad, and fresh yogurt',
      tags: ['Punjabi', 'Protein Rich', 'Filling'],
      isVeg: true,
      isJain: false,
      isHealthy: true,
      isLive: true
    },
    {
      id: 3,
      name: 'Chole Bhature',
      chef: 'Kavita Ma',
      chefId: 'kavita',
      category: 'veg',
      price: 100,
      rating: 4.7,
      reviews: 189,
      distance: '0.5 km',
      time: '20-25 min',
      image: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1',
      description: 'Spicy chickpea curry with fluffy fried bread and onion pickle',
      tags: ['Street Food', 'Spicy', 'Traditional'],
      isVeg: true,
      isJain: false,
      isHealthy: false,
      isLive: false
    },
    {
      id: 4,
      name: 'Chicken Curry Rice',
      chef: 'Rekha Didi',
      chefId: 'rekha',
      category: 'nonveg',
      price: 180,
      rating: 4.6,
      reviews: 134,
      distance: '1.5 km',
      time: '35-40 min',
      image: 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1',
      description: 'Home-style chicken curry with fragrant basmati rice and raita',
      tags: ['Non-Veg', 'Spicy', 'High Protein'],
      isVeg: false,
      isJain: false,
      isHealthy: true,
      isLive: true
    },
    {
      id: 5,
      name: 'Jain Thali Special',
      chef: 'Priya Aunty',
      chefId: 'priya',
      category: 'jain',
      price: 160,
      rating: 4.8,
      reviews: 92,
      distance: '0.8 km',
      time: '25-30 min',
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1',
      description: 'Complete Jain meal with dal, sabzi, roti, rice, and sweets',
      tags: ['Jain', 'Complete Meal', 'Pure Veg'],
      isVeg: true,
      isJain: true,
      isHealthy: true,
      isLive: true
    },
    {
      id: 6,
      name: 'Quinoa Salad Bowl',
      chef: 'Sunita Mummy',
      chefId: 'sunita',
      category: 'healthy',
      price: 150,
      rating: 4.5,
      reviews: 67,
      distance: '1.2 km',
      time: '20-25 min',
      image: 'https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1',
      description: 'Nutritious quinoa with fresh vegetables, nuts, and homemade dressing',
      tags: ['Healthy', 'Low Carb', 'Superfood'],
      isVeg: true,
      isJain: true,
      isHealthy: true,
      isLive: false
    }
  ];

  useEffect(() => {
    loadMenuItems();
  }, []);

  const loadMenuItems = async () => {
    try {
      setLoading(true);
      // Try to fetch from API, fallback to mock data
      try {
        const response = await menuAPI.getMenuItems();
        setMenuItems(response.items || mockMenuItems);
      } catch (error) {
        console.log('Using mock data due to API unavailability');
        setMenuItems(mockMenuItems);
      }
    } catch (error) {
      console.error('Error loading menu items:', error);
      setMenuItems(mockMenuItems);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.chef.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || 
                           (selectedCategory === 'veg' && item.isVeg) ||
                           (selectedCategory === 'nonveg' && !item.isVeg) ||
                           (selectedCategory === 'jain' && item.isJain) ||
                           (selectedCategory === 'healthy' && item.isHealthy) ||
                           (selectedCategory === 'regional' && item.tags.some((tag: string) => tag.includes('Regional') || tag.includes('Punjabi') || tag.includes('Traditional')));
    
    const matchesChef = selectedChef === 'all' || item.chefId === selectedChef;

    return matchesSearch && matchesCategory && matchesChef;
  });

  const addToCart = (itemId: number) => {
    setCart(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1
    }));
    toast.success('Added to cart!');
  };

  const updateCartQuantity = (itemId: number, quantity: number) => {
    if (quantity <= 0) {
      setCart(prev => {
        const newCart = { ...prev };
        delete newCart[itemId];
        return newCart;
      });
    } else {
      setCart(prev => ({
        ...prev,
        [itemId]: quantity
      }));
    }
  };

  const removeFromCart = (itemId: number) => {
    setCart(prev => ({
      ...prev,
      [itemId]: Math.max((prev[itemId] || 0) - 1, 0)
    }));
  };

  const clearCart = () => {
    setCart({});
  };

  const getTotalItems = () => {
    return Object.values(cart).reduce((sum, count) => sum + count, 0);
  };

  const getTotalPrice = () => {
    return Object.entries(cart).reduce((total, [itemId, count]) => {
      const item = menuItems.find(item => item.id === parseInt(itemId));
      return total + (item ? item.price * count : 0);
    }, 0);
  };

  const handleTrackOrder = (itemId: number) => {
    const orderId = `ORD${itemId}${Date.now()}`;
    setTrackedOrderId(orderId);
    setShowOrderTracker(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-16 bg-gray-50 dark:bg-gray-900 warm:bg-orange-100 green:bg-green-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading delicious meals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 bg-gray-50 dark:bg-gray-900 warm:bg-orange-100 green:bg-green-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white warm:text-gray-800 green:text-gray-900 mb-4">
            Delicious Home-Cooked Meals
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 warm:text-gray-700 green:text-gray-600 max-w-2xl mx-auto">
            Browse fresh, homemade meals prepared with love by our certified home chefs in your neighborhood.
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 space-y-4"
        >
          {/* Search Bar */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search meals, chefs, or ingredients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 warm:border-orange-200 green:border-green-200 rounded-full bg-white dark:bg-gray-800 warm:bg-orange-50 green:bg-green-50 text-gray-900 dark:text-white warm:text-gray-800 green:text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-orange-500 text-white shadow-lg'
                    : 'bg-white dark:bg-gray-800 warm:bg-orange-50 green:bg-green-50 text-gray-700 dark:text-gray-300 warm:text-gray-800 green:text-gray-700 border border-gray-200 dark:border-gray-600 warm:border-orange-200 green:border-green-200 hover:bg-orange-50 dark:hover:bg-gray-700 warm:hover:bg-orange-100 green:hover:bg-green-100'
                }`}
              >
                <span>{category.icon}</span>
                <span>{category.name}</span>
              </motion.button>
            ))}
          </div>

          {/* Chef Filter */}
          <div className="flex justify-center">
            <select
              value={selectedChef}
              onChange={(e) => setSelectedChef(e.target.value)}
              className="px-4 py-2 border border-gray-200 dark:border-gray-600 warm:border-orange-200 green:border-green-200 rounded-lg bg-white dark:bg-gray-800 warm:bg-orange-50 green:bg-green-50 text-gray-900 dark:text-white warm:text-gray-800 green:text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              {chefs.map((chef) => (
                <option key={chef.id} value={chef.id}>
                  {chef.name}
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6 text-center"
        >
          <p className="text-gray-600 dark:text-gray-300 warm:text-gray-700 green:text-gray-600">
            Showing {filteredItems.length} delicious meal{filteredItems.length !== 1 ? 's' : ''}
          </p>
        </motion.div>

        {/* Menu Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        >
          <AnimatePresence>
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-gray-800 warm:bg-orange-50 green:bg-green-50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 flex items-center space-x-2">
                    {item.isVeg ? (
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                      </div>
                    ) : (
                      <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                        <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                      </div>
                    )}
                    {item.isLive && (
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full flex items-center space-x-1"
                      >
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        <span>LIVE</span>
                      </motion.div>
                    )}
                  </div>
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleTrackOrder(item.id)}
                      className="p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
                    >
                      <Eye className="h-4 w-4 text-blue-600" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
                    >
                      <Heart className="h-4 w-4 text-gray-600 hover:text-red-500 transition-colors" />
                    </motion.button>
                  </div>
                  {item.isJain && (
                    <div className="absolute bottom-4 left-4">
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                        <Leaf className="inline h-3 w-3 mr-1" />
                        Jain
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white warm:text-gray-800 green:text-gray-900">
                      {item.name}
                    </h3>
                    <span className="text-xl font-bold text-orange-600 dark:text-orange-400 warm:text-orange-700 green:text-green-600">
                      ₹{item.price}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 mb-3">
                    <ChefHat className="h-4 w-4 text-orange-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-300 warm:text-gray-700 green:text-gray-600 font-medium">
                      {item.chef}
                    </span>
                    {item.isLive && (
                      <span className="text-xs text-green-600 font-medium">• Currently Cooking</span>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-300 warm:text-gray-700 green:text-gray-600 mb-4 line-clamp-2">
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 warm:text-gray-600 green:text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span>{item.rating}</span>
                        <span>({item.reviews})</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{item.distance}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{item.time}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {item.tags.slice(0, 3).map((tag: string, tagIndex: number) => (
                      <span
                        key={tagIndex}
                        className="px-2 py-1 bg-orange-100 dark:bg-orange-900/20 warm:bg-orange-200 green:bg-green-100 text-orange-800 dark:text-orange-300 warm:text-orange-900 green:text-green-800 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Add to Cart */}
                  <div className="flex items-center justify-between">
                    {cart[item.id] ? (
                      <div className="flex items-center space-x-3">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => removeFromCart(item.id)}
                          className="p-2 bg-orange-100 dark:bg-orange-900/20 warm:bg-orange-200 green:bg-green-100 text-orange-600 dark:text-orange-400 warm:text-orange-700 green:text-green-600 rounded-full hover:bg-orange-200 dark:hover:bg-orange-900/40 warm:hover:bg-orange-300 green:hover:bg-green-200 transition-colors"
                        >
                          <Minus className="h-4 w-4" />
                        </motion.button>
                        <span className="font-semibold text-gray-900 dark:text-white warm:text-gray-800 green:text-gray-900">
                          {cart[item.id]}
                        </span>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => addToCart(item.id)}
                          className="p-2 bg-orange-100 dark:bg-orange-900/20 warm:bg-orange-200 green:bg-green-100 text-orange-600 dark:text-orange-400 warm:text-orange-700 green:text-green-600 rounded-full hover:bg-orange-200 dark:hover:bg-orange-900/40 warm:hover:bg-orange-300 green:hover:bg-green-200 transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                        </motion.button>
                      </div>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => addToCart(item.id)}
                        className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-500 dark:from-orange-600 dark:to-pink-600 warm:from-orange-400 warm:to-pink-400 green:from-green-500 green:to-emerald-500 text-white rounded-lg hover:shadow-lg transition-all duration-300 font-medium"
                      >
                        <ShoppingCart className="h-4 w-4" />
                        <span>Add to Cart</span>
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">🍽️</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white warm:text-gray-800 green:text-gray-900 mb-2">
              No meals found
            </h3>
            <p className="text-gray-600 dark:text-gray-300 warm:text-gray-700 green:text-gray-600">
              Try adjusting your search or filters to find delicious meals.
            </p>
          </motion.div>
        )}

        {/* Floating Cart */}
        <AnimatePresence>
          {getTotalItems() > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="fixed bottom-6 right-6 z-40"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCart(true)}
                className="flex items-center space-x-3 px-6 py-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <ShoppingCart className="h-6 w-6" />
                <div className="text-left">
                  <div className="font-semibold">{getTotalItems()} items</div>
                  <div className="text-sm opacity-90">₹{getTotalPrice()}</div>
                </div>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Cart Modal */}
        <Cart
          items={cart}
          menuItems={menuItems}
          onUpdateQuantity={updateCartQuantity}
          onClearCart={clearCart}
          isOpen={showCart}
          onClose={() => setShowCart(false)}
        />

        {/* Real-Time Order Tracker Modal */}
        {showOrderTracker && (
          <RealTimeOrderTracker
            orderId={trackedOrderId}
            onClose={() => setShowOrderTracker(false)}
          />
        )}
      </div>
    </div>
  );
};

export default Menu;
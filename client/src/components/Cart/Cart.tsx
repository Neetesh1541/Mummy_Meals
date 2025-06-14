import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useSocket } from '../../contexts/SocketContext';
import { orderAPI } from '../../lib/api';
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  CreditCard,
  MapPin,
  Clock,
  X,
  CheckCircle,
  Loader2,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  chef: string;
  chefId: string;
  image: string;
}

interface CartProps {
  items: { [key: number]: number };
  menuItems: any[];
  onUpdateQuantity: (itemId: number, quantity: number) => void;
  onClearCart: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const Cart: React.FC<CartProps> = ({ 
  items, 
  menuItems, 
  onUpdateQuantity, 
  onClearCart, 
  isOpen, 
  onClose 
}) => {
  const { user } = useAuth();
  const { socket, isConnected } = useSocket();
  const [isProcessing, setIsProcessing] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState(user?.address || '');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'online'>('cod');

  const cartItems: CartItem[] = Object.entries(items)
    .filter(([_, quantity]) => quantity > 0)
    .map(([itemId, quantity]) => {
      const menuItem = menuItems.find(item => item.id === parseInt(itemId));
      if (!menuItem) return null;
      
      return {
        id: parseInt(itemId),
        name: menuItem.name,
        price: menuItem.price,
        quantity,
        chef: menuItem.chef,
        chefId: menuItem.chefId,
        image: menuItem.image
      };
    })
    .filter(Boolean) as CartItem[];

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const handleQuantityChange = (itemId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      onUpdateQuantity(itemId, 0);
    } else {
      onUpdateQuantity(itemId, newQuantity);
    }
  };

  const handleRemoveItem = (itemId: number) => {
    onUpdateQuantity(itemId, 0);
    toast.success('Item removed from cart');
  };

  const handleCheckout = async () => {
    if (!user) {
      toast.error('Please login to place an order');
      return;
    }

    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    if (!deliveryAddress.trim()) {
      toast.error('Please enter delivery address');
      return;
    }

    if (!isConnected) {
      toast.error('Connection lost. Please check your internet connection.');
      return;
    }

    setIsProcessing(true);

    try {
      // Group items by chef
      const itemsByChef = cartItems.reduce((acc, item) => {
        const chefId = item.chefId;
        
        if (!acc[chefId]) {
          acc[chefId] = {
            chef: item.chef,
            items: []
          };
        }
        
        acc[chefId].items.push({
          menu_item_id: item.id.toString(),
          quantity: item.quantity,
          price: item.price,
          name: item.name
        });
        
        return acc;
      }, {} as { [key: string]: { chef: string; items: any[] } });

      // Create orders for each chef
      const orderPromises = Object.entries(itemsByChef).map(async ([chefId, chefData]) => {
        const orderData = {
          mom_id: chefId,
          items: chefData.items,
          total_amount: chefData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
          delivery_address: deliveryAddress,
          delivery_instructions: deliveryInstructions,
          payment_method: paymentMethod
        };

        console.log('Creating order:', orderData);
        return orderAPI.createOrder(orderData);
      });

      const orderResults = await Promise.all(orderPromises);
      
      // Check if all orders were successful
      const successfulOrders = orderResults.filter(result => result.success);
      
      if (successfulOrders.length === orderResults.length) {
        toast.success(`${successfulOrders.length} order(s) placed successfully! 🎉`);
        
        // Show real-time notification
        toast.success('Chefs have been notified instantly! 👩‍🍳', {
          duration: 4000,
          icon: '🔔'
        });
        
        onClearCart();
        onClose();

        // Redirect to dashboard to track orders
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 2000);
      } else {
        throw new Error('Some orders failed to process');
      }

    } catch (error: any) {
      console.error('Checkout error:', error);
      toast.error(error.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
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
          className="bg-white dark:bg-gray-900 warm:bg-orange-50 green:bg-green-50 rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 warm:border-orange-200 green:border-green-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/20 warm:bg-orange-200 green:bg-green-100 rounded-full">
                  <ShoppingCart className="h-6 w-6 text-orange-600 dark:text-orange-400 warm:text-orange-700 green:text-green-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white warm:text-gray-800 green:text-gray-900">
                    Your Cart
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 warm:text-gray-700 green:text-gray-600">
                    {getTotalItems()} items
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 warm:hover:bg-orange-100 green:hover:bg-green-100 rounded-full transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>
            </div>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto max-h-64 p-6">
            {cartItems.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 warm:text-gray-600 green:text-gray-500">
                  Your cart is empty
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800 warm:bg-orange-100 green:bg-green-100 rounded-xl"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white warm:text-gray-800 green:text-gray-900">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 warm:text-gray-700 green:text-gray-600">
                        by {item.chef}
                      </p>
                      <p className="font-bold text-orange-600 dark:text-orange-400 warm:text-orange-700 green:text-green-600">
                        ₹{item.price} each
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        className="p-1 bg-orange-100 dark:bg-orange-900/20 warm:bg-orange-200 green:bg-green-100 text-orange-600 dark:text-orange-400 warm:text-orange-700 green:text-green-600 rounded-full hover:bg-orange-200 dark:hover:bg-orange-900/40 warm:hover:bg-orange-300 green:hover:bg-green-200 transition-colors"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center font-semibold text-gray-900 dark:text-white warm:text-gray-800 green:text-gray-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        className="p-1 bg-orange-100 dark:bg-orange-900/20 warm:bg-orange-200 green:bg-green-100 text-orange-600 dark:text-orange-400 warm:text-orange-700 green:text-green-600 rounded-full hover:bg-orange-200 dark:hover:bg-orange-900/40 warm:hover:bg-orange-300 green:hover:bg-green-200 transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="p-1 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full hover:bg-red-200 dark:hover:bg-red-900/40 transition-colors ml-2"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Checkout Section */}
          {cartItems.length > 0 && (
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 warm:border-orange-200 green:border-green-200">
              {/* Delivery Address */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 warm:text-gray-800 green:text-gray-700 mb-2">
                  <MapPin className="inline h-4 w-4 mr-1" />
                  Delivery Address *
                </label>
                <textarea
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Enter your complete delivery address"
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 warm:border-orange-200 green:border-green-200 rounded-lg bg-white dark:bg-gray-800 warm:bg-orange-100 green:bg-green-100 text-gray-900 dark:text-white warm:text-gray-800 green:text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                  rows={2}
                />
              </div>

              {/* Delivery Instructions */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 warm:text-gray-800 green:text-gray-700 mb-2">
                  Delivery Instructions (Optional)
                </label>
                <input
                  type="text"
                  value={deliveryInstructions}
                  onChange={(e) => setDeliveryInstructions(e.target.value)}
                  placeholder="e.g., Ring the bell twice"
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 warm:border-orange-200 green:border-green-200 rounded-lg bg-white dark:bg-gray-800 warm:bg-orange-100 green:bg-green-100 text-gray-900 dark:text-white warm:text-gray-800 green:text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              {/* Payment Method */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 warm:text-gray-800 green:text-gray-700 mb-2">
                  Payment Method
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                      paymentMethod === 'cod'
                        ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 warm:bg-orange-100 green:bg-green-50 text-orange-600 dark:text-orange-400 warm:text-orange-700 green:text-green-600'
                        : 'border-gray-200 dark:border-gray-600 warm:border-orange-200 green:border-green-200 text-gray-700 dark:text-gray-300 warm:text-gray-800 green:text-gray-700'
                    }`}
                  >
                    <Clock className="h-5 w-5 mx-auto mb-1" />
                    <div className="text-sm font-medium">Cash on Delivery</div>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('online')}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                      paymentMethod === 'online'
                        ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 warm:bg-orange-100 green:bg-green-50 text-orange-600 dark:text-orange-400 warm:text-orange-700 green:text-green-600'
                        : 'border-gray-200 dark:border-gray-600 warm:border-orange-200 green:border-green-200 text-gray-700 dark:text-gray-300 warm:text-gray-800 green:text-gray-700'
                    }`}
                  >
                    <CreditCard className="h-5 w-5 mx-auto mb-1" />
                    <div className="text-sm font-medium">Online Payment</div>
                  </button>
                </div>
              </div>

              {/* Order Summary */}
              <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-800 warm:bg-orange-100 green:bg-green-100 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white warm:text-gray-800 green:text-gray-900 mb-2">
                  Order Summary
                </h3>
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400 warm:text-gray-700 green:text-gray-600">
                      {item.quantity}x {item.name}
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white warm:text-gray-800 green:text-gray-900">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                ))}
                <div className="border-t border-gray-200 dark:border-gray-700 warm:border-orange-200 green:border-green-200 pt-2 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900 dark:text-white warm:text-gray-800 green:text-gray-900">
                      Total Amount
                    </span>
                    <span className="text-xl font-bold text-orange-600 dark:text-orange-400 warm:text-orange-700 green:text-green-600">
                      ₹{getTotalPrice()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Connection Status Warning */}
              {!isConnected && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm">Connection lost. Please check your internet.</span>
                  </div>
                </div>
              )}

              {/* Checkout Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCheckout}
                disabled={isProcessing || !deliveryAddress.trim() || !isConnected}
                className="w-full py-4 bg-gradient-to-r from-orange-500 to-pink-500 dark:from-orange-600 dark:to-pink-600 warm:from-orange-400 warm:to-pink-400 green:from-green-500 green:to-emerald-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Placing Order...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-5 w-5" />
                    <span>Place Order - ₹{getTotalPrice()}</span>
                  </>
                )}
              </motion.button>

              <p className="text-xs text-gray-500 dark:text-gray-400 warm:text-gray-600 green:text-gray-500 text-center mt-2">
                Your order will be sent instantly to the chef via real-time notifications
              </p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Cart;
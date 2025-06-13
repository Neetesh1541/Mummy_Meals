import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { orderAPI, paymentAPI } from '../../lib/api';
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
  Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  chef: string;
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
  const [isProcessing, setIsProcessing] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState(user?.address || '');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'online'>('online');

  const cartItems: CartItem[] = Object.entries(items)
    .filter(([_, quantity]) => quantity > 0)
    .map(([itemId, quantity]) => {
      const menuItem = menuItems.find(item => item.id === parseInt(itemId));
      return {
        id: parseInt(itemId),
        name: menuItem?.name || '',
        price: menuItem?.price || 0,
        quantity,
        chef: menuItem?.chef || '',
        image: menuItem?.image || ''
      };
    });

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
  };

  const processPayment = async (orderData: any) => {
    if (paymentMethod === 'cod') {
      return { success: true };
    }

    try {
      const paymentData = {
        amount: getTotalPrice(),
        currency: 'INR',
        order_id: `ORDER_${Date.now()}`,
        customer_details: {
          name: user?.name || '',
          email: user?.email || '',
          phone: user?.phone || ''
        }
      };

      const paymentIntent = await paymentAPI.createPaymentIntent(paymentData);
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const confirmation = await paymentAPI.confirmPayment(paymentIntent.payment_intent_id);
      return confirmation;
    } catch (error) {
      console.error('Payment error:', error);
      throw new Error('Payment failed');
    }
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

    setIsProcessing(true);

    try {
      // Group items by chef
      const itemsByChef = cartItems.reduce((acc, item) => {
        const menuItem = menuItems.find(mi => mi.id === item.id);
        const chefId = menuItem?.chefId || 'unknown';
        
        if (!acc[chefId]) {
          acc[chefId] = [];
        }
        acc[chefId].push({
          menu_item_id: item.id.toString(),
          quantity: item.quantity,
          price: item.price
        });
        return acc;
      }, {} as { [key: string]: any[] });

      // Create orders for each chef
      const orderPromises = Object.entries(itemsByChef).map(async ([chefId, orderItems]) => {
        const orderData = {
          mom_id: chefId,
          items: orderItems,
          total_amount: orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
          delivery_address: deliveryAddress,
          delivery_instructions: deliveryInstructions,
          payment_method: paymentMethod
        };

        // Process payment if online payment is selected
        if (paymentMethod === 'online') {
          await processPayment(orderData);
        }

        return orderAPI.createOrder(orderData);
      });

      await Promise.all(orderPromises);

      toast.success('Order placed successfully!');
      onClearCart();
      onClose();

      // Redirect to dashboard to track orders
      window.location.href = '/dashboard';

    } catch (error: any) {
      console.error('Checkout error:', error);
      toast.error(error.message || 'Failed to place order');
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
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 warm:hover:bg-orange-100 green:hover:bg-green-100 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </button>
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
                        ₹{item.price}
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
                  Delivery Address
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
                    onClick={() => setPaymentMethod('online')}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                      paymentMethod === 'online'
                        ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 warm:bg-orange-100 green:bg-green-50 text-orange-600 dark:text-orange-400 warm:text-orange-700 green:text-green-600'
                        : 'border-gray-200 dark:border-gray-600 warm:border-orange-200 green:border-green-200 text-gray-700 dark:text-gray-300 warm:text-gray-800 green:text-gray-700'
                    }`}
                  >
                    <CreditCard className="h-5 w-5 mx-auto mb-1" />
                    <div className="text-sm font-medium">Online</div>
                  </button>
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
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center mb-4 p-3 bg-gray-50 dark:bg-gray-800 warm:bg-orange-100 green:bg-green-100 rounded-lg">
                <span className="font-semibold text-gray-900 dark:text-white warm:text-gray-800 green:text-gray-900">
                  Total Amount
                </span>
                <span className="text-xl font-bold text-orange-600 dark:text-orange-400 warm:text-orange-700 green:text-green-600">
                  ₹{getTotalPrice()}
                </span>
              </div>

              {/* Checkout Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCheckout}
                disabled={isProcessing || !deliveryAddress.trim()}
                className="w-full py-4 bg-gradient-to-r from-orange-500 to-pink-500 dark:from-orange-600 dark:to-pink-600 warm:from-orange-400 warm:to-pink-400 green:from-green-500 green:to-emerald-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-5 w-5" />
                    <span>Place Order</span>
                  </>
                )}
              </motion.button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Cart;
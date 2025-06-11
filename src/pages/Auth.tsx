import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { 
  Heart, 
  Mail, 
  Lock, 
  User, 
  ChefHat, 
  Utensils,
  Truck,
  Eye,
  EyeOff,
  Loader2,
  Phone,
  MapPin
} from 'lucide-react';
import EnhancedWaves from '../components/UI/EnhancedWaves';

const Auth: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login, signup, isLoading, user } = useAuth();
  
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'foodie' | 'mom' | 'delivery'>(
    (searchParams.get('role') as 'foodie' | 'mom' | 'delivery') || 'foodie'
  );
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    kitchenName: '',
    specialties: '',
    vehicleType: 'bike',
    licenseNumber: ''
  });

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLogin && formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        const additionalData: any = {};
        
        if (selectedRole === 'mom') {
          additionalData.kitchen_name = formData.kitchenName;
          additionalData.specialties = formData.specialties.split(',').map(s => s.trim());
          additionalData.location = {
            address: formData.address,
            lat: 28.6139, // Default Delhi coordinates
            lng: 77.2090
          };
        } else if (selectedRole === 'delivery') {
          additionalData.vehicle_type = formData.vehicleType;
          additionalData.license_number = formData.licenseNumber;
        }

        if (formData.address) {
          additionalData.address = formData.address;
        }

        await signup(formData.name, formData.email, formData.password, formData.phone, selectedRole, additionalData);
      }
      navigate('/dashboard');
    } catch (error) {
      console.error('Auth error:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const roleConfig = {
    foodie: {
      icon: Utensils,
      title: 'Food Buddy',
      subtitle: 'Order delicious meals',
      color: 'from-orange-500 to-pink-500',
      bgColor: 'from-orange-50 to-pink-50'
    },
    mom: {
      icon: ChefHat,
      title: 'Mummy Chef',
      subtitle: 'Cook & earn from home',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'from-purple-50 to-pink-50'
    },
    delivery: {
      icon: Truck,
      title: 'Delivery Partner',
      subtitle: 'Deliver with flexibility',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'from-blue-50 to-cyan-50'
    }
  };

  return (
    <div className="min-h-screen pt-16 flex items-center justify-center relative overflow-hidden">
      {/* Enhanced Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <EnhancedWaves variant="hero" />
      </div>
      
      <div className="relative z-10 w-full max-w-lg px-4">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20"
        >
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              className="inline-flex p-4 rounded-full bg-gradient-to-r from-orange-400 to-pink-400 mb-4"
            >
              <Heart className="h-10 w-10 text-white" />
            </motion.div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome to MummyMeals
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {isLogin ? 'Sign in to your account' : 'Create your account'}
            </p>
          </div>

          {/* Role Selection */}
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 text-center">
              Join as:
            </p>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(roleConfig).map(([role, config]) => {
                const Icon = config.icon;
                return (
                  <motion.button
                    key={role}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedRole(role as any)}
                    className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                      selectedRole === role
                        ? `border-orange-500 bg-gradient-to-br ${config.bgColor} text-orange-600`
                        : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-orange-300'
                    }`}
                  >
                    <Icon className="h-5 w-5 mx-auto mb-1" />
                    <div className="text-xs font-medium">{config.title}</div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Auth Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required={!isLogin}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required={!isLogin}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      name="address"
                      placeholder="Address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  {/* Role-specific fields */}
                  {selectedRole === 'mom' && (
                    <>
                      <input
                        type="text"
                        name="kitchenName"
                        placeholder="Kitchen Name"
                        value={formData.kitchenName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                      <input
                        type="text"
                        name="specialties"
                        placeholder="Specialties (comma separated)"
                        value={formData.specialties}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </>
                  )}

                  {selectedRole === 'delivery' && (
                    <>
                      <select
                        name="vehicleType"
                        value={formData.vehicleType}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      >
                        <option value="bike">Bike</option>
                        <option value="scooter">Scooter</option>
                        <option value="bicycle">Bicycle</option>
                      </select>
                      <input
                        type="text"
                        name="licenseNumber"
                        placeholder="License Number"
                        value={formData.licenseNumber}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full pl-10 pr-12 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirm Password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required={!isLogin}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 bg-gradient-to-r ${roleConfig[selectedRole].color} text-white rounded-xl font-semibold text-lg hover:shadow-lg transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center space-x-2`}
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                  {React.createElement(roleConfig[selectedRole].icon, { className: "h-5 w-5" })}
                </>
              )}
            </motion.button>
          </form>

          {/* Toggle Auth Mode */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="ml-2 text-orange-600 dark:text-orange-400 hover:underline font-medium"
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
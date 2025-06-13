import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { 
  Heart, 
  Users, 
  Clock, 
  Star, 
  ChefHat, 
  Utensils,
  Truck,
  MapPin,
  Shield,
  Award,
  ArrowRight,
  Play,
  Quote,
  Zap,
  Globe,
  CreditCard
} from 'lucide-react';
import EnhancedWaves from '../components/UI/EnhancedWaves';
import MummyMealsLogo from '../components/UI/MummyMealsLogo';
import RealTimeOrderTracker from '../components/OrderTracking/RealTimeOrderTracker';

const Home: React.FC = () => {
  const { theme } = useTheme();
  const [showOrderTracker, setShowOrderTracker] = useState(false);

  const features = [
    {
      icon: ChefHat,
      title: "Certified Home Chefs",
      description: "Authentic home-cooked meals prepared by verified mothers with traditional recipes and fresh ingredients.",
      color: "from-orange-500 to-pink-500"
    },
    {
      icon: Zap,
      title: "Real-Time Ordering",
      description: "Instant notifications to moms, live order tracking, and seamless delivery coordination like Swiggy.",
      color: "from-blue-500 to-purple-500"
    },
    {
      icon: Truck,
      title: "Smart Delivery Network",
      description: "Professional delivery partners ensuring your meals reach you fresh, hot, and on time.",
      color: "from-green-500 to-teal-500"
    },
    {
      icon: CreditCard,
      title: "Secure Payments",
      description: "Multiple payment options including online payments and cash on delivery for your convenience.",
      color: "from-purple-500 to-pink-500"
    }
  ];

  const howItWorks = [
    {
      step: "1",
      title: "Choose Your Meal",
      description: "Browse nearby home chefs, view their specialties, ratings, and select your favorite dishes.",
      icon: Utensils
    },
    {
      step: "2", 
      title: "Real-Time Cooking",
      description: "Your order instantly reaches the mom chef who starts preparing your meal with love and care.",
      icon: ChefHat
    },
    {
      step: "3",
      title: "Fresh Delivery",
      description: "Our delivery partners pick up your fresh meal and deliver it hot to your doorstep.",
      icon: Truck
    }
  ];

  const testimonials = [
    {
      name: "Rahul Verma",
      role: "Software Engineer",
      image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1",
      rating: 5,
      text: "The real-time notifications and fresh delivery make it feel like mom is cooking just for me. Amazing platform!"
    },
    {
      name: "Priya Sharma",
      role: "Marketing Executive", 
      image: "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1",
      rating: 5,
      text: "As a working professional, the instant ordering and reliable delivery have been a game-changer for my daily meals."
    },
    {
      name: "Ankit Gupta",
      role: "College Student",
      image: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1", 
      rating: 5,
      text: "Affordable, tasty, and delivered fast. The moms get instant notifications and start cooking immediately!"
    }
  ];

  const stats = [
    { number: "15,000+", label: "Happy Food Buddies" },
    { number: "800+", label: "Mummy Chefs" },
    { number: "100,000+", label: "Meals Delivered" },
    { number: "25+", label: "Cities Covered" }
  ];

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Enhanced Background with Theme Support */}
        <div className="absolute inset-0">
          <EnhancedWaves variant="hero" theme={theme} />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            {/* Large Logo Display */}
            <div className="flex justify-center mb-8">
              <MummyMealsLogo size="xl" animated={true} showText={true} />
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white warm:text-gray-800 green:text-gray-900 mb-6">
              <span className="block">Taste of Home,</span>
              <span className="block bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
                Delivered Instantly
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-200 warm:text-gray-700 green:text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
              Connect with loving home chefs in real-time. Order fresh, authentic meals and watch them being prepared with love, 
              delivered hot to your doorstep by our trusted delivery partners.
            </p>

            {/* Real-time Features Highlight */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30"
              >
                <Zap className="h-5 w-5 text-yellow-500" />
                <span className="text-gray-700 dark:text-gray-200 warm:text-gray-800 green:text-gray-700 font-medium">Instant Notifications</span>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30"
              >
                <Globe className="h-5 w-5 text-blue-500" />
                <span className="text-gray-700 dark:text-gray-200 warm:text-gray-800 green:text-gray-700 font-medium">Live Tracking</span>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30"
              >
                <Clock className="h-5 w-5 text-green-500" />
                <span className="text-gray-700 dark:text-gray-200 warm:text-gray-800 green:text-gray-700 font-medium">30-Min Delivery</span>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
          >
            <Link
              to="/auth?role=foodie"
              className="group px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-full font-semibold text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-2"
            >
              <span>Order Now</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link
              to="/auth?role=mom"
              className="group px-8 py-4 bg-white/90 backdrop-blur-sm text-gray-900 rounded-full font-semibold text-lg border-2 border-orange-500 hover:bg-orange-500 hover:text-white transition-all duration-300 flex items-center space-x-2"
            >
              <ChefHat className="h-5 w-5" />
              <span>Cook & Earn</span>
            </Link>

            <Link
              to="/auth?role=delivery"
              className="group px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full font-semibold text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-2"
            >
              <Truck className="h-5 w-5" />
              <span>Deliver & Earn</span>
            </Link>
          </motion.div>

          {/* Demo Order Tracking Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowOrderTracker(true)}
              className="group flex items-center space-x-3 px-6 py-3 bg-white/80 backdrop-blur-lg rounded-full border border-white/30 hover:bg-white transition-all duration-300"
            >
              <div className="p-2 rounded-full bg-gradient-to-r from-orange-500 to-pink-500">
                <Play className="h-4 w-4 text-white ml-0.5" />
              </div>
              <span className="text-gray-700 font-medium">
                See Live Order Tracking
              </span>
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-gray-900 warm:bg-orange-50 green:bg-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-orange-600 dark:text-orange-400 warm:text-orange-700 green:text-green-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 dark:text-gray-300 warm:text-gray-700 green:text-gray-600 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <EnhancedWaves variant="section" theme={theme} />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white warm:text-gray-800 green:text-gray-900 mb-4">
              Why Choose MummyMeals?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 warm:text-gray-700 green:text-gray-600 max-w-3xl mx-auto">
              Experience the future of home-cooked food delivery with real-time connectivity and instant satisfaction.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="group"
                >
                  <div className="bg-white/80 dark:bg-gray-900/80 warm:bg-orange-50/80 green:bg-green-50/80 backdrop-blur-lg rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 h-full border border-white/20">
                    <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white warm:text-gray-800 green:text-gray-900 mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 warm:text-gray-700 green:text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white dark:bg-gray-900 warm:bg-orange-50 green:bg-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white warm:text-gray-800 green:text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 warm:text-gray-700 green:text-gray-600 max-w-3xl mx-auto">
              From order to delivery - experience seamless real-time food delivery in just 3 simple steps!
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {howItWorks.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="relative text-center"
                >
                  {/* Connection Line */}
                  {index < howItWorks.length - 1 && (
                    <div className="hidden md:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-orange-300 to-pink-300 warm:from-orange-400 warm:to-pink-400 green:from-green-300 green:to-emerald-300 transform -translate-x-1/2" />
                  )}
                  
                  <div className="relative z-10 mb-6">
                    <motion.div 
                      whileHover={{ scale: 1.1 }}
                      className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 warm:from-orange-400 warm:to-pink-400 green:from-green-500 green:to-emerald-500 text-white font-bold text-xl mb-4 shadow-lg"
                    >
                      {step.step}
                    </motion.div>
                    <div className="inline-flex p-4 rounded-full bg-orange-100 dark:bg-gray-800 warm:bg-orange-200 green:bg-green-100">
                      <Icon className="h-8 w-8 text-orange-600 dark:text-orange-400 warm:text-orange-700 green:text-green-600" />
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white warm:text-gray-800 green:text-gray-900 mb-4">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 warm:text-gray-700 green:text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <EnhancedWaves variant="section" theme={theme} />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white warm:text-gray-800 green:text-gray-900 mb-4">
              What Our Community Says
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 warm:text-gray-700 green:text-gray-600 max-w-3xl mx-auto">
              Real stories from people who experience the magic of instant home-cooked meals.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-white/90 dark:bg-gray-900/90 warm:bg-orange-50/90 green:bg-green-50/90 backdrop-blur-lg rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/20"
              >
                <div className="flex items-center mb-4">
                  <Quote className="h-8 w-8 text-orange-400 warm:text-orange-500 green:text-green-400 mr-2" />
                  <div className="flex space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
                
                <p className="text-gray-700 dark:text-gray-200 warm:text-gray-800 green:text-gray-700 mb-6 leading-relaxed italic">
                  "{testimonial.text}"
                </p>
                
                <div className="flex items-center">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white warm:text-gray-800 green:text-gray-900">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300 warm:text-gray-700 green:text-gray-600">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <EnhancedWaves variant="footer" theme={theme} />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Join the Real-Time Food Revolution
            </h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
              Experience instant connectivity with home chefs, real-time order tracking, and the fastest delivery 
              of authentic home-cooked meals. Join thousands who've already made the switch!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/auth?role=foodie"
                className="px-8 py-4 bg-white text-orange-600 rounded-full font-semibold text-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 flex items-center space-x-2"
              >
                <Utensils className="h-5 w-5" />
                <span>Start Ordering</span>
              </Link>
              
              <Link
                to="/auth?role=mom"
                className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-semibold text-lg hover:bg-white hover:text-orange-600 transition-all duration-300 flex items-center space-x-2"
              >
                <ChefHat className="h-5 w-5" />
                <span>Become a Chef</span>
              </Link>

              <Link
                to="/auth?role=delivery"
                className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-semibold text-lg hover:bg-white hover:text-purple-600 transition-all duration-300 flex items-center space-x-2"
              >
                <Truck className="h-5 w-5" />
                <span>Deliver & Earn</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Real-Time Order Tracker Modal */}
      {showOrderTracker && (
        <RealTimeOrderTracker
          orderId="ORD123456"
          onClose={() => setShowOrderTracker(false)}
        />
      )}
    </div>
  );
};

export default Home;
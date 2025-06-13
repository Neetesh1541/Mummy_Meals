import React from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Users, 
  Award, 
  Target,
  ChefHat,
  Utensils,
  MapPin,
  TrendingUp,
  Shield,
  Clock,
  Star,
  Linkedin,
  Github,
  Mail
} from 'lucide-react';
import AnimatedWaves from '../components/UI/AnimatedWaves';

const About: React.FC = () => {
  const stats = [
    { icon: Users, number: '10,000+', label: 'Happy Food Buddies' },
    { icon: ChefHat, number: '500+', label: 'Certified Mummy Chefs' },
    { icon: Utensils, number: '50,000+', label: 'Meals Delivered' },
    { icon: MapPin, number: '15+', label: 'Cities Covered' }
  ];

  const values = [
    {
      icon: Heart,
      title: 'Love & Care',
      description: 'Every meal is prepared with the same love and care that a mother puts into cooking for her family.',
      color: 'from-red-500 to-pink-500'
    },
    {
      icon: Shield,
      title: 'Trust & Safety',
      description: 'We ensure the highest standards of hygiene and food safety across all our partner kitchens.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Award,
      title: 'Quality Excellence',
      description: 'Only the finest ingredients and traditional cooking methods are used to create authentic flavors.',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: Users,
      title: 'Community First',
      description: 'Building strong connections between home chefs and food lovers in local communities.',
      color: 'from-green-500 to-emerald-500'
    }
  ];

  const milestones = [
    {
      year: '2023',
      title: 'The Beginning',
      description: 'MummyMeals was founded with a simple vision: connecting people with authentic home-cooked meals.'
    },
    {
      year: '2023',
      title: 'First 100 Chefs',
      description: 'We onboarded our first 100 home chefs across Delhi NCR, establishing our quality standards.'
    },
    {
      year: '2024',
      title: 'Rapid Growth',
      description: 'Expanded to 15 cities with over 500 certified home chefs and 10,000+ satisfied customers.'
    },
    {
      year: '2024',
      title: 'Future Vision',
      description: 'Planning to reach 50 cities and empower 5,000+ home chefs across India.'
    }
  ];

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-orange-50 via-pink-50 to-orange-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 warm:from-orange-100 warm:via-pink-100 warm:to-orange-200 green:from-green-50 green:via-emerald-50 green:to-green-100">
        <AnimatedWaves color="#fb923c" className="opacity-10" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex justify-center mb-6">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="p-4 rounded-full bg-gradient-to-r from-orange-400 to-pink-400 dark:from-orange-500 dark:to-pink-500 warm:from-orange-300 warm:to-pink-300 green:from-green-400 green:to-emerald-400"
              >
                <Heart className="h-12 w-12 text-white" />
              </motion.div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white warm:text-gray-800 green:text-gray-900 mb-6">
              Our Story
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 warm:text-gray-700 green:text-gray-600 mb-8 max-w-4xl mx-auto">
              MummyMeals was born from a simple belief: everyone deserves to experience the warmth and love of home-cooked meals, 
              no matter how far they are from home.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-gray-900 warm:bg-orange-50 green:bg-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="inline-flex p-4 rounded-full bg-gradient-to-r from-orange-100 to-pink-100 dark:from-orange-900/20 dark:to-pink-900/20 warm:from-orange-200 warm:to-pink-200 green:from-green-100 green:to-emerald-100 mb-4">
                    <Icon className="h-8 w-8 text-orange-600 dark:text-orange-400 warm:text-orange-700 green:text-green-600" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white warm:text-gray-800 green:text-gray-900 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 warm:text-gray-700 green:text-gray-600 font-medium">
                    {stat.label}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800 warm:bg-orange-100 green:bg-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <Target className="h-8 w-8 text-orange-600 dark:text-orange-400 warm:text-orange-700 green:text-green-600 mr-3" />
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white warm:text-gray-800 green:text-gray-900">
                    Our Mission
                  </h2>
                </div>
                <p className="text-lg text-gray-600 dark:text-gray-400 warm:text-gray-700 green:text-gray-600 leading-relaxed">
                  To bridge the gap between homesick hearts and the comfort of home-cooked meals by connecting 
                  skilled home chefs with food lovers who crave authentic, nutritious, and lovingly prepared food.
                </p>
              </div>

              <div>
                <div className="flex items-center mb-4">
                  <TrendingUp className="h-8 w-8 text-orange-600 dark:text-orange-400 warm:text-orange-700 green:text-green-600 mr-3" />
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white warm:text-gray-800 green:text-gray-900">
                    Our Vision
                  </h2>
                </div>
                <p className="text-lg text-gray-600 dark:text-gray-400 warm:text-gray-700 green:text-gray-600 leading-relaxed">
                  To become India's most trusted platform for home-cooked meals, empowering thousands of home chefs 
                  while ensuring that no one has to compromise on the taste and nutrition of home food.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1"
                  alt="Home cooking"
                  className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">Made with Love</h3>
                  <p className="text-lg opacity-90">Every meal tells a story of care and tradition</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
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
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 warm:text-gray-700 green:text-gray-600 max-w-3xl mx-auto">
              These principles guide everything we do and shape the MummyMeals experience.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                  className="text-center group"
                >
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${value.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white warm:text-gray-800 green:text-gray-900 mb-4">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 warm:text-gray-700 green:text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800 warm:bg-orange-100 green:bg-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white warm:text-gray-800 green:text-gray-900 mb-4">
              Our Journey
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 warm:text-gray-700 green:text-gray-600 max-w-3xl mx-auto">
              From a simple idea to a thriving community of food lovers and home chefs.
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-orange-400 to-pink-400 dark:from-orange-500 dark:to-pink-500 warm:from-orange-300 warm:to-pink-300 green:from-green-400 green:to-emerald-400"></div>

            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                >
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <div className="bg-white dark:bg-gray-900 warm:bg-orange-50 green:bg-green-50 rounded-2xl p-6 shadow-lg">
                      <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 warm:text-orange-700 green:text-green-600 mb-2">
                        {milestone.year}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white warm:text-gray-800 green:text-gray-900 mb-3">
                        {milestone.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 warm:text-gray-700 green:text-gray-600">
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="relative z-10 w-4 h-4 bg-white dark:bg-gray-900 warm:bg-orange-50 green:bg-green-50 border-4 border-orange-400 dark:border-orange-500 warm:border-orange-300 green:border-green-400 rounded-full"></div>
                  
                  <div className="w-1/2"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Founder Section */}
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
              Meet Our Founder
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 warm:text-gray-700 green:text-gray-600 max-w-3xl mx-auto">
              The visionary behind MummyMeals and his passion for connecting communities through food.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-gradient-to-br from-orange-50 to-pink-50 dark:from-gray-800 dark:to-gray-700 warm:from-orange-100 warm:to-pink-100 green:from-green-50 green:to-emerald-50 rounded-3xl p-8 md:p-12 shadow-xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                <div className="md:col-span-1">
                  <div className="relative">
                    <div className="w-48 h-48 mx-auto rounded-full bg-gradient-to-r from-orange-400 to-pink-400 dark:from-orange-500 dark:to-pink-500 warm:from-orange-300 warm:to-pink-300 green:from-green-400 green:to-emerald-400 flex items-center justify-center text-white text-6xl font-bold">
                      Neetesh
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-white dark:bg-gray-800 warm:bg-orange-50 green:bg-green-50 rounded-full flex items-center justify-center shadow-lg">
                      <Heart className="h-8 w-8 text-orange-500" />
                    </div>
                  </div>
                </div>
                
                <div className="md:col-span-2 text-center md:text-left">
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white warm:text-gray-800 green:text-gray-900 mb-2">
                    Neetesh Sharma
                  </h3>
                  <p className="text-xl text-orange-600 dark:text-orange-400 warm:text-orange-700 green:text-green-600 mb-6 font-medium">
                    Founder & CEO, MummyMeals
                  </p>
                  
                  <p className="text-gray-600 dark:text-gray-400 warm:text-gray-700 green:text-gray-600 leading-relaxed mb-6">
                    "Having lived away from home during my college and early career days, I deeply understand the longing for 
                    home-cooked meals. MummyMeals is my way of ensuring that no one has to compromise on the taste, nutrition, 
                    and love that comes with homemade food. We're not just delivering meals; we're delivering emotions, 
                    memories, and the warmth of home."
                  </p>
                  
                  <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start space-y-4 sm:space-y-0 sm:space-x-6">
                    <div className="text-center">
                      <div className="text-sm text-gray-500 dark:text-gray-400 warm:text-gray-600 green:text-gray-500">Location</div>
                      <div className="font-medium text-gray-900 dark:text-white warm:text-gray-800 green:text-gray-900">New Delhi, India</div>
                    </div>
                    
                    <div className="flex space-x-4">
                      <motion.a
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        href="https://in.linkedin.com/in/neetesh-kumar-846616287"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-white dark:bg-gray-800 warm:bg-orange-50 green:bg-green-50 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <Linkedin className="h-6 w-6 text-blue-600" />
                      </motion.a>
                      <motion.a
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        href="https://github.com/Neetesh1541"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-white dark:bg-gray-800 warm:bg-orange-50 green:bg-green-50 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <Github className="h-6 w-6 text-gray-900 dark:text-white" />
                      </motion.a>
                      <motion.a
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        href="mailto:neeteshk1104@gmail.com"
                        className="p-3 bg-white dark:bg-gray-800 warm:bg-orange-50 green:bg-green-50 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <Mail className="h-6 w-6 text-orange-600 dark:text-orange-400 warm:text-orange-700 green:text-green-600" />
                      </motion.a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-600 to-pink-600 dark:from-orange-700 dark:to-pink-700 warm:from-orange-500 warm:to-pink-500 green:from-green-600 green:to-emerald-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Join Our Growing Family
            </h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
              Whether you're a food lover looking for authentic home meals or a home chef wanting to share your culinary skills, 
              MummyMeals welcomes you with open arms.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white text-orange-600 rounded-full font-semibold text-lg hover:bg-gray-100 transform transition-all duration-300 flex items-center space-x-2"
              >
                <Utensils className="h-5 w-5" />
                <span>Become a Food Buddy</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-semibold text-lg hover:bg-white hover:text-orange-600 transition-all duration-300 flex items-center space-x-2"
              >
                <ChefHat className="h-5 w-5" />
                <span>Join as Mummy Chef</span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;
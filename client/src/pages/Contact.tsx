import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  Send,
  Heart,
  MessageCircle,
  Linkedin,
  Github,
  CheckCircle
} from 'lucide-react';
import AnimatedWaves from '../components/UI/AnimatedWaves';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setIsSubmitted(false), 3000);
    }, 1000);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Us',
      details: 'neeteshk1104@gmail.com',
      description: 'Send us an email anytime',
      href: 'mailto:neeteshk1104@gmail.com',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Phone,
      title: 'Call Us',
      details: '+918218828273',
      description: 'Mon-Sat from 9am to 8pm',
      href: 'tel:+918218828273',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      details: 'New Delhi, India',
      description: 'Our headquarters location',
      href: '#',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: Clock,
      title: 'Business Hours',
      details: '9:00 AM - 8:00 PM',
      description: 'Monday to Saturday',
      href: '#',
      color: 'from-purple-500 to-pink-500'
    }
  ];

  const socialLinks = [
    {
      icon: Linkedin,
      name: 'LinkedIn',
      href: 'https://in.linkedin.com/in/neetesh-kumar-846616287',
      color: 'hover:text-blue-600'
    },
    {
      icon: Github,
      name: 'GitHub',
      href: 'https://github.com/neetesh1541',
      color: 'hover:text-gray-900 dark:hover:text-white'
    },
    {
      icon: Mail,
      name: 'Email',
      href: 'mailto:neeteshk1104@gmail.com',
      color: 'hover:text-orange-600'
    }
  ];

  const subjects = [
    'General Inquiry',
    'Food Buddy Support',
    'Mummy Chef Support',
    'Partnership Opportunity',
    'Technical Issue',
    'Feedback & Suggestions',
    'Media & Press',
    'Other'
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
                <MessageCircle className="h-12 w-12 text-white" />
              </motion.div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white warm:text-gray-800 green:text-gray-900 mb-6">
              Get in Touch
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 warm:text-gray-700 green:text-gray-600 mb-8 max-w-3xl mx-auto">
              We'd love to hear from you! Whether you have questions, feedback, or just want to say hello, 
              we're here to help and connect with our amazing community.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 bg-white dark:bg-gray-900 warm:bg-orange-50 green:bg-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <motion.a
                  key={index}
                  href={info.href}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                  className="group block"
                >
                  <div className="bg-white dark:bg-gray-800 warm:bg-orange-100 green:bg-green-100 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-center h-full">
                    <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${info.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white warm:text-gray-800 green:text-gray-900 mb-2">
                      {info.title}
                    </h3>
                    <p className="text-gray-900 dark:text-white warm:text-gray-800 green:text-gray-900 font-medium mb-1">
                      {info.details}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 warm:text-gray-700 green:text-gray-600">
                      {info.description}
                    </p>
                  </div>
                </motion.a>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800 warm:bg-orange-100 green:bg-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="bg-white dark:bg-gray-900 warm:bg-orange-50 green:bg-green-50 rounded-2xl p-8 shadow-xl">
                <div className="flex items-center mb-6">
                  <Heart className="h-6 w-6 text-orange-600 dark:text-orange-400 warm:text-orange-700 green:text-green-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white warm:text-gray-800 green:text-gray-900">
                    Send us a Message
                  </h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 warm:text-gray-800 green:text-gray-700 mb-2">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 warm:border-orange-200 green:border-green-200 rounded-xl bg-white dark:bg-gray-800 warm:bg-orange-100 green:bg-green-100 text-gray-900 dark:text-white warm:text-gray-800 green:text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 warm:text-gray-800 green:text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 warm:border-orange-200 green:border-green-200 rounded-xl bg-white dark:bg-gray-800 warm:bg-orange-100 green:bg-green-100 text-gray-900 dark:text-white warm:text-gray-800 green:text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 warm:text-gray-800 green:text-gray-700 mb-2">
                      Subject *
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 warm:border-orange-200 green:border-green-200 rounded-xl bg-white dark:bg-gray-800 warm:bg-orange-100 green:bg-green-100 text-gray-900 dark:text-white warm:text-gray-800 green:text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="">Select a subject</option>
                      {subjects.map((subject, index) => (
                        <option key={index} value={subject}>
                          {subject}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 warm:text-gray-800 green:text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 warm:border-orange-200 green:border-green-200 rounded-xl bg-white dark:bg-gray-800 warm:bg-orange-100 green:bg-green-100 text-gray-900 dark:text-white warm:text-gray-800 green:text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                      placeholder="Tell us how we can help you..."
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isSubmitted}
                    className="w-full py-4 bg-gradient-to-r from-orange-500 to-pink-500 dark:from-orange-600 dark:to-pink-600 warm:from-orange-400 warm:to-pink-400 green:from-green-500 green:to-emerald-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {isSubmitted ? (
                      <>
                        <CheckCircle className="h-5 w-5" />
                        <span>Message Sent!</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5" />
                        <span>Send Message</span>
                      </>
                    )}
                  </motion.button>
                </form>

                {/* Social Links */}
                <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 warm:border-orange-200 green:border-green-200">
                  <p className="text-sm text-gray-600 dark:text-gray-400 warm:text-gray-700 green:text-gray-600 mb-4 text-center">
                    Or connect with us on social media
                  </p>
                  <div className="flex justify-center space-x-4">
                    {socialLinks.map((social, index) => {
                      const Icon = social.icon;
                      return (
                        <motion.a
                          key={index}
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.1, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          className={`p-3 bg-gray-100 dark:bg-gray-800 warm:bg-orange-200 green:bg-green-200 rounded-full text-gray-600 dark:text-gray-400 warm:text-gray-700 green:text-gray-600 ${social.color} transition-all duration-300`}
                        >
                          <Icon className="h-5 w-5" />
                        </motion.a>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Map & Additional Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              {/* Map Placeholder */}
              <div className="bg-white dark:bg-gray-900 warm:bg-orange-50 green:bg-green-50 rounded-2xl p-8 shadow-xl">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white warm:text-gray-800 green:text-gray-900 mb-6">
                  Our Location
                </h3>
                <div className="h-64 bg-gradient-to-br from-orange-100 to-pink-100 dark:from-gray-700 dark:to-gray-600 warm:from-orange-200 warm:to-pink-200 green:from-green-100 green:to-emerald-100 rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-16 w-16 text-orange-400 dark:text-orange-300 warm:text-orange-500 green:text-green-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400 warm:text-gray-700 green:text-gray-600 font-medium">
                      New Delhi, India
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 warm:text-gray-600 green:text-gray-500 mt-2">
                      Interactive map will be displayed here
                    </p>
                  </div>
                </div>
              </div>

              {/* FAQ Quick Links */}
              <div className="bg-white dark:bg-gray-900 warm:bg-orange-50 green:bg-green-50 rounded-2xl p-8 shadow-xl">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white warm:text-gray-800 green:text-gray-900 mb-6">
                  Quick Help
                </h3>
                <div className="space-y-4">
                  <div className="p-4 bg-orange-50 dark:bg-orange-900/20 warm:bg-orange-100 green:bg-green-100 rounded-xl">
                    <h4 className="font-semibold text-gray-900 dark:text-white warm:text-gray-800 green:text-gray-900 mb-2">
                      For Food Buddies
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 warm:text-gray-700 green:text-gray-600">
                      Questions about ordering, delivery, or your account? We're here to help!
                    </p>
                  </div>
                  <div className="p-4 bg-pink-50 dark:bg-pink-900/20 warm:bg-pink-100 green:bg-emerald-100 rounded-xl">
                    <h4 className="font-semibold text-gray-900 dark:text-white warm:text-gray-800 green:text-gray-900 mb-2">
                      For Mummy Chefs
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 warm:text-gray-700 green:text-gray-600">
                      Need support with your kitchen setup, orders, or payments? Let us know!
                    </p>
                  </div>
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 warm:bg-blue-100 green:bg-blue-100 rounded-xl">
                    <h4 className="font-semibold text-gray-900 dark:text-white warm:text-gray-800 green:text-gray-900 mb-2">
                      Partnership Opportunities
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 warm:text-gray-700 green:text-gray-600">
                      Interested in partnering with us? We'd love to explore opportunities together.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Response Time Info */}
      <section className="py-16 bg-white dark:bg-gray-900 warm:bg-orange-50 green:bg-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white warm:text-gray-800 green:text-gray-900 mb-4">
              We'll Get Back to You Soon!
            </h2>
            <p className="text-gray-600 dark:text-gray-400 warm:text-gray-700 green:text-gray-600 max-w-2xl mx-auto">
              We typically respond to all inquiries within 24 hours during business days. 
              For urgent matters, please call us directly at +91 79827 41065.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
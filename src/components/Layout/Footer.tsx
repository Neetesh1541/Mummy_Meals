import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Heart,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Github,
  Instagram,
  Twitter,
  Facebook
} from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Linkedin, href: 'https://in.linkedin.com/in/neetesh-kumar-846616287', label: 'LinkedIn' },
    { icon: Github, href: 'https://github.com/neetesh1541', label: 'GitHub' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Facebook, href: '#', label: 'Facebook' },
  ];

  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'Menu', href: '/menu' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 dark:from-black dark:via-gray-900 dark:to-black warm:from-orange-900 warm:via-orange-800 warm:to-orange-900 green:from-green-900 green:via-green-800 green:to-green-900 text-white">
      {/* Wave decoration */}
      <div className="relative">
        <svg
          className="w-full h-16 text-white dark:text-gray-100 warm:text-orange-50 green:text-green-50 fill-current"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            opacity=".25"
          />
          <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
            opacity=".5"
          />
          <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="p-2 rounded-full bg-gradient-to-r from-orange-400 to-pink-400"
              >
                <Heart className="h-6 w-6 text-white" />
              </motion.div>
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">
                MummyMeals
              </span>
            </div>
            <p className="text-gray-300 dark:text-gray-400 warm:text-orange-100 green:text-green-100 mb-6 max-w-md">
              Connecting hearts through homemade meals. Experience the warmth of a mother's love, 
              delivered fresh to your doorstep every day. <em>"Ghar se door, maa ke haathon ka pyaar."</em>
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
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
                    className="p-2 rounded-full bg-gray-800 dark:bg-gray-700 warm:bg-orange-800 green:bg-green-800 hover:bg-gradient-to-r hover:from-orange-500 hover:to-pink-500 transition-all duration-300"
                    aria-label={social.label}
                  >
                    <Icon className="h-5 w-5" />
                  </motion.a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-orange-400 warm:text-orange-300 green:text-green-300">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.href}
                    className="text-gray-300 dark:text-gray-400 warm:text-orange-100 green:text-green-100 hover:text-orange-400 warm:hover:text-orange-300 green:hover:text-green-300 transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-orange-400 warm:text-orange-300 green:text-green-300">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-gray-300 dark:text-gray-400 warm:text-orange-100 green:text-green-100">
                <Mail className="h-4 w-4 text-orange-400 warm:text-orange-300 green:text-green-300" />
                <a 
                  href="mailto:neeteshk1104@gmail.com"
                  className="hover:text-orange-400 warm:hover:text-orange-300 green:hover:text-green-300 transition-colors"
                >
                  neeteshk1104@gmail.com
                </a>
              </div>
              <div className="flex items-center space-x-2 text-gray-300 dark:text-gray-400 warm:text-orange-100 green:text-green-100">
                <Phone className="h-4 w-4 text-orange-400 warm:text-orange-300 green:text-green-300" />
                <a 
                  href="tel:+918218828273"
                  className="hover:text-orange-400 warm:hover:text-orange-300 green:hover:text-green-300 transition-colors"
                >
                  +91 8218828273
                </a>
              </div>
              <div className="flex items-center space-x-2 text-gray-300 dark:text-gray-400 warm:text-orange-100 green:text-green-100">
                <MapPin className="h-4 w-4 text-orange-400 warm:text-orange-300 green:text-green-300" />
                <span>New Delhi, India</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 dark:border-gray-600 warm:border-orange-700 green:border-green-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 dark:text-gray-500 warm:text-orange-200 green:text-green-200 text-sm">
              © {currentYear} MummyMeals. Made with ❤️ by Neetesh Sharma. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0 flex space-x-6 text-sm">
              <Link to="/privacy" className="text-gray-400 dark:text-gray-500 warm:text-orange-200 green:text-green-200 hover:text-orange-400 warm:hover:text-orange-300 green:hover:text-green-300 transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-400 dark:text-gray-500 warm:text-orange-200 green:text-green-200 hover:text-orange-400 warm:hover:text-orange-300 green:hover:text-green-300 transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
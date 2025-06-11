import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Menu, 
  X, 
  Sun, 
  Moon, 
  Palette, 
  Leaf,
  Heart,
  User,
  LogOut,
  Home,
  Info,
  Contact,
  UtensilsCrossed,
  Settings
} from 'lucide-react';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();
  const location = useLocation();

  const themeIcons = {
    light: Sun,
    dark: Moon,
    warm: Heart,
    green: Leaf
  };

  const themeLabels = {
    light: 'Light',
    dark: 'Dark', 
    warm: 'Warm',
    green: 'Green'
  };

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Menu', href: '/menu', icon: UtensilsCrossed },
    { name: 'About', href: '/about', icon: Info },
    { name: 'Contact', href: '/contact', icon: Contact },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 warm:bg-orange-50/80 green:bg-green-50/80 backdrop-blur-lg border-b border-orange-100 dark:border-gray-700 warm:border-orange-200 green:border-green-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-full bg-gradient-to-r from-orange-400 to-pink-400 dark:from-orange-500 dark:to-pink-500 warm:from-orange-300 warm:to-pink-300 green:from-green-400 green:to-emerald-400"
            >
              <Heart className="h-5 w-5 text-white" />
            </motion.div>
            <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 dark:from-orange-400 dark:to-pink-400 warm:from-orange-700 warm:to-pink-700 green:from-green-600 green:to-emerald-600 bg-clip-text text-transparent">
              MummyMeals
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-all duration-200 ${
                    isActive(item.href)
                      ? 'bg-orange-100 dark:bg-gray-800 warm:bg-orange-200 green:bg-green-100 text-orange-600 dark:text-orange-400 warm:text-orange-700 green:text-green-600'
                      : 'text-gray-600 dark:text-gray-300 warm:text-gray-700 green:text-gray-600 hover:text-orange-600 dark:hover:text-orange-400 warm:hover:text-orange-700 green:hover:text-green-600 hover:bg-orange-50 dark:hover:bg-gray-800 warm:hover:bg-orange-100 green:hover:bg-green-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Right side buttons */}
          <div className="flex items-center space-x-2">
            {/* Theme Selector */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
                className="p-2 rounded-lg bg-orange-100 dark:bg-gray-800 warm:bg-orange-200 green:bg-green-100 text-orange-600 dark:text-orange-400 warm:text-orange-700 green:text-green-600 hover:bg-orange-200 dark:hover:bg-gray-700 warm:hover:bg-orange-300 green:hover:bg-green-200 transition-colors"
              >
                {React.createElement(themeIcons[theme], { className: "h-5 w-5" })}
              </motion.button>

              <AnimatePresence>
                {isThemeMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 warm:bg-orange-50 green:bg-green-50 rounded-xl shadow-lg border border-orange-100 dark:border-gray-700 warm:border-orange-200 green:border-green-200 py-2"
                  >
                    {Object.entries(themeIcons).map(([themeName, Icon]) => (
                      <button
                        key={themeName}
                        onClick={() => {
                          setTheme(themeName as any);
                          setIsThemeMenuOpen(false);
                        }}
                        className={`w-full flex items-center space-x-2 px-4 py-2 text-left hover:bg-orange-100 dark:hover:bg-gray-700 warm:hover:bg-orange-200 green:hover:bg-green-100 ${
                          theme === themeName 
                            ? 'text-orange-600 dark:text-orange-400 warm:text-orange-700 green:text-green-600 bg-orange-50 dark:bg-gray-700 warm:bg-orange-100 green:bg-green-100' 
                            : 'text-gray-700 dark:text-gray-300 warm:text-gray-700 green:text-gray-700'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span className="capitalize">{themeLabels[themeName as keyof typeof themeLabels]}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User Menu or Auth Buttons */}
            {user ? (
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg bg-orange-100 dark:bg-gray-800 warm:bg-orange-200 green:bg-green-100 text-orange-600 dark:text-orange-400 warm:text-orange-700 green:text-green-600 hover:bg-orange-200 dark:hover:bg-gray-700 warm:hover:bg-orange-300 green:hover:bg-green-200 transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-orange-400 to-pink-400 dark:from-orange-500 dark:to-pink-500 warm:from-orange-300 warm:to-pink-300 green:from-green-400 green:to-emerald-400 flex items-center justify-center">
                    <User className="h-3 w-3 text-white" />
                  </div>
                  <span className="hidden sm:block text-sm font-medium">{user.name.split(' ')[0]}</span>
                </motion.button>

                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 warm:bg-orange-50 green:bg-green-50 rounded-xl shadow-lg border border-orange-100 dark:border-gray-700 warm:border-orange-200 green:border-green-200 py-2"
                    >
                      <Link
                        to="/dashboard"
                        className="flex items-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-300 warm:text-gray-700 green:text-gray-700 hover:bg-orange-100 dark:hover:bg-gray-700 warm:hover:bg-orange-200 green:hover:bg-green-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Settings className="h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full flex items-center space-x-2 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/auth"
                className="hidden sm:flex items-center space-x-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-500 dark:from-orange-600 dark:to-pink-600 warm:from-orange-400 warm:to-pink-400 green:from-green-500 green:to-emerald-500 text-white rounded-lg hover:shadow-lg transition-all duration-200 font-medium"
              >
                <User className="h-4 w-4" />
                <span>Login</span>
              </Link>
            )}

            {/* Mobile menu button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-orange-100 dark:bg-gray-800 warm:bg-orange-200 green:bg-green-100 text-orange-600 dark:text-orange-400 warm:text-orange-700 green:text-green-600"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-orange-100 dark:border-gray-700 warm:border-orange-200 green:border-green-200 py-4 space-y-2"
            >
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive(item.href)
                        ? 'bg-orange-100 dark:bg-gray-800 warm:bg-orange-200 green:bg-green-100 text-orange-600 dark:text-orange-400 warm:text-orange-700 green:text-green-600'
                        : 'text-gray-600 dark:text-gray-300 warm:text-gray-700 green:text-gray-600 hover:bg-orange-50 dark:hover:bg-gray-800 warm:hover:bg-orange-100 green:hover:bg-green-50'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
              {!user && (
                <Link
                  to="/auth"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-2 px-4 py-3 bg-gradient-to-r from-orange-500 to-pink-500 dark:from-orange-600 dark:to-pink-600 warm:from-orange-400 warm:to-pink-400 green:from-green-500 green:to-emerald-500 text-white rounded-lg font-medium"
                >
                  <User className="h-5 w-5" />
                  <span>Login / Sign Up</span>
                </Link>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};

export default Header;
import React from 'react';
import { motion } from 'framer-motion';
import { Heart, ChefHat, Utensils } from 'lucide-react';

interface MummyMealsLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
  showText?: boolean;
  className?: string;
}

const MummyMealsLogo: React.FC<MummyMealsLogoProps> = ({
  size = 'md',
  animated = true,
  showText = true,
  className = ''
}) => {
  const sizeConfig = {
    sm: { container: 'w-8 h-8', icon: 'h-4 w-4', text: 'text-sm' },
    md: { container: 'w-12 h-12', icon: 'h-6 w-6', text: 'text-lg' },
    lg: { container: 'w-16 h-16', icon: 'h-8 w-8', text: 'text-xl' },
    xl: { container: 'w-24 h-24', icon: 'h-12 w-12', text: 'text-3xl' }
  };

  const config = sizeConfig[size];

  const logoVariants = {
    initial: { scale: 1, rotate: 0 },
    hover: { scale: 1.1, rotate: 5 },
    tap: { scale: 0.95 }
  };

  const heartVariants = {
    initial: { scale: 1 },
    animate: { 
      scale: [1, 1.2, 1],
      rotate: [0, 5, -5, 0]
    }
  };

  const iconVariants = {
    initial: { opacity: 0, scale: 0 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: { delay: 0.2, duration: 0.5 }
    }
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Logo Icon */}
      <motion.div
        variants={animated ? logoVariants : {}}
        initial="initial"
        whileHover="hover"
        whileTap="tap"
        className={`${config.container} relative rounded-full bg-gradient-to-br from-orange-400 via-pink-400 to-red-400 dark:from-orange-500 dark:via-pink-500 dark:to-red-500 warm:from-orange-300 warm:via-pink-300 warm:to-red-300 green:from-green-400 green:via-emerald-400 green:to-teal-400 shadow-lg flex items-center justify-center overflow-hidden`}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
        
        {/* Main Heart Icon */}
        <motion.div
          variants={animated ? heartVariants : {}}
          initial="initial"
          animate={animated ? "animate" : "initial"}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="relative z-10"
        >
          <Heart className={`${config.icon} text-white fill-current`} />
        </motion.div>

        {/* Floating Chef Hat */}
        <motion.div
          variants={animated ? iconVariants : {}}
          initial="initial"
          animate={animated ? "animate" : "initial"}
          className="absolute top-0 right-0 transform translate-x-1 -translate-y-1"
        >
          <div className="w-3 h-3 bg-white rounded-full flex items-center justify-center shadow-sm">
            <ChefHat className="h-2 w-2 text-orange-500" />
          </div>
        </motion.div>

        {/* Floating Utensils */}
        <motion.div
          variants={animated ? iconVariants : {}}
          initial="initial"
          animate={animated ? "animate" : "initial"}
          transition={{ delay: 0.4 }}
          className="absolute bottom-0 left-0 transform -translate-x-1 translate-y-1"
        >
          <div className="w-3 h-3 bg-white rounded-full flex items-center justify-center shadow-sm">
            <Utensils className="h-2 w-2 text-pink-500" />
          </div>
        </motion.div>

        {/* Sparkle Effects */}
        {animated && (
          <>
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  top: `${20 + i * 20}%`,
                  left: `${20 + i * 20}%`,
                }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.5,
                  ease: "easeInOut"
                }}
              />
            ))}
          </>
        )}
      </motion.div>

      {/* Logo Text */}
      {showText && (
        <motion.div
          initial={animated ? { opacity: 0, x: -20 } : {}}
          animate={animated ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex flex-col"
        >
          <span className={`${config.text} font-bold bg-gradient-to-r from-orange-600 via-pink-600 to-red-600 dark:from-orange-400 dark:via-pink-400 dark:to-red-400 warm:from-orange-700 warm:via-pink-700 warm:to-red-700 green:from-green-600 green:via-emerald-600 green:to-teal-600 bg-clip-text text-transparent`}>
            MummyMeals
          </span>
          {size === 'xl' && (
            <span className="text-xs text-gray-600 dark:text-gray-400 warm:text-gray-700 green:text-gray-600 font-medium">
              Ghar ka pyaar
            </span>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default MummyMealsLogo;
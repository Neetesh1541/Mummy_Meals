import React from 'react';
import { motion } from 'framer-motion';

interface EnhancedWavesProps {
  className?: string;
  variant?: 'hero' | 'section' | 'footer';
  theme?: 'light' | 'dark' | 'warm' | 'green';
}

const EnhancedWaves: React.FC<EnhancedWavesProps> = ({ 
  className = "", 
  variant = 'hero',
  theme = 'light'
}) => {
  const waveVariants = {
    hero: {
      colors: {
        light: ['#fed7aa', '#fdba74', '#fb923c', '#f97316'],
        dark: ['#1f2937', '#374151', '#4b5563', '#6b7280'],
        warm: ['#ffedd5', '#fed7aa', '#fdba74', '#fb923c'],
        green: ['#dcfce7', '#bbf7d0', '#86efac', '#4ade80']
      },
      heights: ['140px', '120px', '100px', '80px'],
      speeds: [8, 12, 16, 20]
    },
    section: {
      colors: {
        light: ['#fed7aa', '#fdba74', '#fb923c'],
        dark: ['#374151', '#4b5563', '#6b7280'],
        warm: ['#fed7aa', '#fdba74', '#fb923c'],
        green: ['#bbf7d0', '#86efac', '#4ade80']
      },
      heights: ['100px', '80px', '60px'],
      speeds: [10, 14, 18]
    },
    footer: {
      colors: {
        light: ['#9a3412', '#c2410c', '#ea580c'],
        dark: ['#111827', '#1f2937', '#374151'],
        warm: ['#c2410c', '#ea580c', '#f97316'],
        green: ['#166534', '#15803d', '#16a34a']
      },
      heights: ['120px', '100px', '80px'],
      speeds: [6, 10, 14]
    }
  };

  const config = waveVariants[variant];
  const themeColors = config.colors[theme];

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {/* Animated Background Gradient */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            `linear-gradient(45deg, ${themeColors[0]}, ${themeColors[1]})`,
            `linear-gradient(135deg, ${themeColors[1]}, ${themeColors[2]})`,
            `linear-gradient(225deg, ${themeColors[2] || themeColors[0]}, ${themeColors[0]})`,
            `linear-gradient(315deg, ${themeColors[0]}, ${themeColors[1]})`
          ]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Wave Layer 1 - Primary */}
      <motion.div
        className="absolute bottom-0 w-full"
        style={{ height: config.heights[0] }}
        animate={{
          x: [-200, 200, -200],
        }}
        transition={{
          duration: config.speeds[0],
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <svg
          className="w-full h-full"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <motion.path
            d="M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z"
            fill={themeColors[0]}
            opacity="0.4"
            animate={{
              d: [
                "M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z",
                "M0,80 C300,20 900,100 1200,40 L1200,120 L0,120 Z",
                "M0,40 C300,100 900,20 1200,80 L1200,120 L0,120 Z",
                "M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z"
              ]
            }}
            transition={{
              duration: config.speeds[0],
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </svg>
      </motion.div>

      {/* Wave Layer 2 - Secondary */}
      <motion.div
        className="absolute bottom-0 w-full"
        style={{ height: config.heights[1] }}
        animate={{
          x: [150, -150, 150],
        }}
        transition={{
          duration: config.speeds[1],
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <svg
          className="w-full h-full"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <motion.path
            d="M0,40 C400,100 800,20 1200,80 L1200,120 L0,120 Z"
            fill={themeColors[1]}
            opacity="0.6"
            animate={{
              d: [
                "M0,40 C400,100 800,20 1200,80 L1200,120 L0,120 Z",
                "M0,70 C400,10 800,90 1200,30 L1200,120 L0,120 Z",
                "M0,50 C400,80 800,40 1200,70 L1200,120 L0,120 Z",
                "M0,40 C400,100 800,20 1200,80 L1200,120 L0,120 Z"
              ]
            }}
            transition={{
              duration: config.speeds[1],
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
        </svg>
      </motion.div>

      {/* Wave Layer 3 - Tertiary */}
      <motion.div
        className="absolute bottom-0 w-full"
        style={{ height: config.heights[2] }}
        animate={{
          x: [-100, 250, -100],
        }}
        transition={{
          duration: config.speeds[2],
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <svg
          className="w-full h-full"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <motion.path
            d="M0,80 C200,40 600,100 1200,20 L1200,120 L0,120 Z"
            fill={themeColors[2] || themeColors[0]}
            opacity="0.8"
            animate={{
              d: [
                "M0,80 C200,40 600,100 1200,20 L1200,120 L0,120 Z",
                "M0,20 C200,80 600,30 1200,90 L1200,120 L0,120 Z",
                "M0,60 C200,60 600,60 1200,60 L1200,120 L0,120 Z",
                "M0,80 C200,40 600,100 1200,20 L1200,120 L0,120 Z"
              ]
            }}
            transition={{
              duration: config.speeds[2],
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          />
        </svg>
      </motion.div>

      {/* Wave Layer 4 - Quaternary (for hero variant) */}
      {variant === 'hero' && themeColors[3] && (
        <motion.div
          className="absolute bottom-0 w-full"
          style={{ height: config.heights[3] }}
          animate={{
            x: [75, -200, 75],
          }}
          transition={{
            duration: config.speeds[3],
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <svg
            className="w-full h-full"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <motion.path
              d="M0,60 C150,20 450,80 600,40 C750,0 1050,60 1200,30 L1200,120 L0,120 Z"
              fill={themeColors[3]}
              opacity="0.9"
              animate={{
                d: [
                  "M0,60 C150,20 450,80 600,40 C750,0 1050,60 1200,30 L1200,120 L0,120 Z",
                  "M0,30 C150,70 450,10 600,50 C750,90 1050,20 1200,60 L1200,120 L0,120 Z",
                  "M0,45 C150,45 450,45 600,45 C750,45 1050,45 1200,45 L1200,120 L0,120 Z",
                  "M0,60 C150,20 450,80 600,40 C750,0 1050,60 1200,30 L1200,120 L0,120 Z"
                ]
              }}
              transition={{
                duration: config.speeds[3],
                repeat: Infinity,
                ease: "easeInOut",
                delay: 3
              }}
            />
          </svg>
        </motion.div>
      )}

      {/* Floating Particles */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 8 + 4,
              height: Math.random() * 8 + 4,
              backgroundColor: themeColors[Math.floor(Math.random() * themeColors.length)],
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: 0.3,
            }}
            animate={{
              y: [-30, 30, -30],
              x: [-20, 20, -20],
              opacity: [0.1, 0.4, 0.1],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 6 + Math.random() * 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 4,
            }}
          />
        ))}
      </div>

      {/* Gradient Overlay for better text readability */}
      <div className={`absolute inset-0 ${
        theme === 'dark' 
          ? 'bg-gradient-to-t from-gray-900/80 via-gray-800/40 to-gray-700/20' 
          : 'bg-gradient-to-t from-transparent via-transparent to-white/10'
      }`} />
    </div>
  );
};

export default EnhancedWaves;
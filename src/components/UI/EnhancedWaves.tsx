import React from 'react';
import { motion } from 'framer-motion';

interface EnhancedWavesProps {
  className?: string;
  variant?: 'hero' | 'section' | 'footer';
}

const EnhancedWaves: React.FC<EnhancedWavesProps> = ({ 
  className = "", 
  variant = 'hero' 
}) => {
  const waveVariants = {
    hero: {
      colors: ['#fb923c', '#f97316', '#ea580c'],
      heights: ['120px', '100px', '80px'],
      speeds: [8, 12, 16]
    },
    section: {
      colors: ['#fed7aa', '#fdba74', '#fb923c'],
      heights: ['80px', '60px', '40px'],
      speeds: [10, 14, 18]
    },
    footer: {
      colors: ['#9a3412', '#c2410c', '#ea580c'],
      heights: ['100px', '80px', '60px'],
      speeds: [6, 10, 14]
    }
  };

  const config = waveVariants[variant];

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {/* Wave Layer 1 */}
      <motion.div
        className="absolute bottom-0 w-full"
        style={{ height: config.heights[0] }}
        animate={{
          x: [-100, 100, -100],
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
            fill={config.colors[0]}
            opacity="0.3"
            animate={{
              d: [
                "M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z",
                "M0,80 C300,20 900,100 1200,40 L1200,120 L0,120 Z",
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

      {/* Wave Layer 2 */}
      <motion.div
        className="absolute bottom-0 w-full"
        style={{ height: config.heights[1] }}
        animate={{
          x: [100, -100, 100],
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
            fill={config.colors[1]}
            opacity="0.5"
            animate={{
              d: [
                "M0,40 C400,100 800,20 1200,80 L1200,120 L0,120 Z",
                "M0,70 C400,10 800,90 1200,30 L1200,120 L0,120 Z",
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

      {/* Wave Layer 3 */}
      <motion.div
        className="absolute bottom-0 w-full"
        style={{ height: config.heights[2] }}
        animate={{
          x: [-50, 150, -50],
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
            fill={config.colors[2]}
            opacity="0.7"
            animate={{
              d: [
                "M0,80 C200,40 600,100 1200,20 L1200,120 L0,120 Z",
                "M0,20 C200,80 600,30 1200,90 L1200,120 L0,120 Z",
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

      {/* Floating Particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              x: [-10, 10, -10],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 4 + Math.random() * 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default EnhancedWaves;
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils.js';

function DrawBall({ number, isMatched = false, size = 'md', delay = 0 }) {
  const sizes = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-base',
    lg: 'w-16 h-16 text-xl',
  };

  return (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{
        type: 'spring',
        stiffness: 200,
        damping: 15,
        delay,
      }}
      className={cn(
        'rounded-full flex items-center justify-center font-bold font-display shadow-lg border-2 transition-all',
        sizes[size],
        isMatched
          ? 'bg-gold-500 text-forest-900 border-gold-400 shadow-gold-500/40'
          : 'bg-forest-700 text-white border-forest-600'
      )}
    >
      {number}
    </motion.div>
  );
}

export default DrawBall;

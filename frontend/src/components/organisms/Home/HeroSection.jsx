import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, Heart, Target, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-hero-pattern">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-gold-500/20"
            style={{
              top: `${10 + i * 12}%`,
              left: `${5 + i * 12}%`,
              width: `${3 + i * 2}px`,
              height: `${3 + i * 2}px`,
            }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.5,
            }}
          />
        ))}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/4 w-64 h-64 bg-forest-500/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        className="relative z-10 text-center px-4 max-w-5xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Eyebrow */}
        <motion.div variants={itemVariants} className="flex items-center justify-center gap-2 mb-6">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold-500/50" />
          <span className="text-gold-400 text-sm font-medium uppercase tracking-widest">
            Golf. Charity. Community.
          </span>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold-500/50" />
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={itemVariants}
          className="font-display text-5xl md:text-7xl font-bold text-white leading-tight mb-6"
        >
          Play Golf.{' '}
          <span className="relative">
            <span className="gold-gradient">Win Prizes.</span>
            <motion.div
              className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-gold-600 to-gold-400"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
            />
          </span>
          <br />
          Fund Charities.
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Subscribe monthly, enter your Stableford scores, and join the monthly draw for real prize pools.
          A portion of every subscription goes to the charity of your choice.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/subscribe">
            <Button size="lg" className="text-base px-8 animate-pulse-gold">
              <Trophy className="w-5 h-5 mr-2" />
              Start Playing
            </Button>
          </Link>
          <Link to="/charities">
            <Button size="lg" variant="outline" className="text-base px-8">
              <Heart className="w-5 h-5 mr-2" />
              Explore Charities
            </Button>
          </Link>
        </motion.div>

        {/* Stats row */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-3 gap-6 mt-20 max-w-md mx-auto"
        >
          {[
            { label: 'Monthly Draws', value: '12+' },
            { label: 'Prize Pool', value: '£5,000' },
            { label: 'Charities', value: '30+' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl font-bold font-display text-gold-400">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ChevronDown className="w-6 h-6 text-gray-500" />
      </motion.div>
    </section>
  );
}

export default HeroSection;

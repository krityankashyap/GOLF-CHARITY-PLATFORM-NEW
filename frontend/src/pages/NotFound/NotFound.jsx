import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';

function NotFound() {
  return (
    <div className="min-h-screen bg-forest-900 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <motion.div
          animate={{ rotate: [0, -10, 10, -5, 5, 0] }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-9xl font-bold font-display text-forest-700 mb-4 select-none"
        >
          404
        </motion.div>

        <div className="w-16 h-16 rounded-2xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center mx-auto mb-6">
          <Trophy className="w-8 h-8 text-gold-400" />
        </div>

        <h1 className="font-display text-3xl font-bold text-white mb-3">
          Hole Not Found
        </h1>
        <p className="text-gray-400 mb-8 leading-relaxed">
          Looks like you've wandered off the fairway. The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/">
            <Button size="lg">
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button size="lg" variant="outline">
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default NotFound;

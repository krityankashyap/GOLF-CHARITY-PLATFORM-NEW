import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, Trophy, Heart, Target, Zap } from 'lucide-react';
import SubscriptionCard from '@/components/molecules/SubscriptionCard/SubscriptionCard.jsx';
import useCreateSubscription from '@/hooks/apis/subscriptions/useCreateSubscription.js';
import useAuth from '@/hooks/context/useAuth.js';

const features = [
  'Monthly & yearly prize draws',
  'Track up to 5 Stableford scores',
  'Charity contributions from your subscription',
  'Winner verification system',
  'Access to full draw history',
  'Monthly newsletter & updates',
];

function Subscription() {
  const { createCheckout, loading } = useCreateSubscription();
  const { isAuthenticated } = useAuth();

  const handleSelect = (plan) => {
    if (!isAuthenticated) {
      window.location.href = '/auth';
      return;
    }
    createCheckout(plan);
  };

  return (
    <div className="min-h-screen bg-forest-900 text-white">
      {/* Header */}
      <div className="border-b border-forest-700/50 bg-forest-800/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          <span className="font-display font-bold text-white">Golf Charity</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-gold-500/10 border border-gold-500/20 rounded-full px-4 py-1.5 mb-4">
            <Zap className="w-4 h-4 text-gold-500" />
            <span className="text-gold-400 text-sm">Simple, transparent pricing</span>
          </div>
          <h1 className="font-display text-4xl font-bold text-white mb-3">Choose Your Plan</h1>
          <p className="text-gray-400 max-w-lg mx-auto">
            30% of every subscription goes into the prize pool. At least 10% goes directly to your chosen charity.
          </p>
        </motion.div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-12">
          <SubscriptionCard
            plan="monthly"
            price={1000}
            features={features}
            onSelect={handleSelect}
          />
          <SubscriptionCard
            plan="yearly"
            price={10000}
            yearlyPrice={12000}
            features={[...features, 'Save vs monthly billing', 'Priority support']}
            onSelect={handleSelect}
            recommended
          />
        </div>

        {/* Trust indicators */}
        <div className="grid sm:grid-cols-3 gap-6 border-t border-forest-700/50 pt-12">
          {[
            {
              icon: Shield,
              title: 'Secure Payments',
              desc: 'Powered by Stripe. Your payment details are never stored on our servers.',
            },
            {
              icon: Trophy,
              title: 'Monthly Draws',
              desc: 'Every month, 5 numbers are drawn. Match your scores to win your share.',
            },
            {
              icon: Heart,
              title: 'Charity Impact',
              desc: 'Minimum 10% goes directly to your chosen charity every billing cycle.',
            },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-5 h-5 text-gold-400" />
                </div>
                <h3 className="font-semibold text-white mb-1 text-sm">{item.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Subscription;

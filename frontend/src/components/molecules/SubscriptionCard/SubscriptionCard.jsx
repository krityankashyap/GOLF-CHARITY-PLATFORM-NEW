import React from 'react';
import { motion } from 'framer-motion';
import { Check, Crown, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { formatCurrency } from '@/lib/utils.js';

function SubscriptionCard({ plan, price, yearlyPrice, features, onSelect, recommended = false }) {
  const isYearly = plan === 'yearly';

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      <Card
        className={`h-full flex flex-col relative overflow-hidden ${
          recommended
            ? 'border-gold-500/60 shadow-gold-500/20 shadow-xl'
            : 'border-forest-700/50'
        }`}
      >
        {recommended && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold-600 via-gold-400 to-gold-600" />
        )}

        {recommended && (
          <div className="absolute top-4 right-4">
            <div className="flex items-center gap-1 bg-gold-500/20 border border-gold-500/30 rounded-full px-2.5 py-1 text-xs font-semibold text-gold-400">
              <Crown className="w-3 h-3" />
              Best Value
            </div>
          </div>
        )}

        <CardHeader className="pb-4">
          <div className="flex items-center gap-2 mb-1">
            <Zap className={`w-5 h-5 ${recommended ? 'text-gold-500' : 'text-forest-500'}`} />
            <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">
              {plan} plan
            </span>
          </div>
          <CardTitle className="text-3xl font-bold">
            <span className="text-gold-400">{formatCurrency(price)}</span>
            <span className="text-sm text-gray-500 font-normal ml-1">
              /{isYearly ? 'year' : 'month'}
            </span>
          </CardTitle>
          {isYearly && (
            <p className="text-xs text-emerald-400">
              Save {formatCurrency(yearlyPrice - price)} vs monthly billing
            </p>
          )}
        </CardHeader>

        <CardContent className="flex-1 flex flex-col">
          <ul className="space-y-3 flex-1">
            {features.map((feature, i) => (
              <li key={i} className="flex items-start gap-3">
                <Check className="w-4 h-4 text-gold-500 mt-0.5 shrink-0" />
                <span className="text-sm text-gray-300">{feature}</span>
              </li>
            ))}
          </ul>

          <Button
            onClick={() => onSelect(plan)}
            className="w-full mt-6"
            variant={recommended ? 'default' : 'outline'}
            size="lg"
          >
            Get Started
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default SubscriptionCard;

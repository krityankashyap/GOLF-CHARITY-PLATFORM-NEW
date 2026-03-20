import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Award, Medal } from 'lucide-react';
import { formatCurrency } from '@/lib/utils.js';

function PrizePool({ prizePool, activeSubscribers = 0 }) {
  if (!prizePool) return null;

  const tiers = [
    {
      icon: Trophy,
      label: '5 Number Match',
      sublabel: 'Jackpot',
      amount: prizePool.jackpot?.amount || 0,
      color: 'text-gold-400',
      bg: 'bg-gold-500/10',
      border: 'border-gold-500/30',
    },
    {
      icon: Award,
      label: '4 Number Match',
      sublabel: 'Second Tier',
      amount: prizePool.fourMatch || 0,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/30',
    },
    {
      icon: Medal,
      label: '3 Number Match',
      sublabel: 'Third Tier',
      amount: prizePool.threeMatch || 0,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30',
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider">Total Prize Pool</p>
          <p className="text-2xl font-bold font-display text-gold-400">
            {formatCurrency(prizePool.total || 0)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">Active subscribers</p>
          <p className="text-lg font-semibold text-white">{activeSubscribers}</p>
        </div>
      </div>

      {tiers.map((tier, i) => {
        const Icon = tier.icon;
        return (
          <motion.div
            key={tier.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`flex items-center justify-between p-3 rounded-xl border ${tier.bg} ${tier.border}`}
          >
            <div className="flex items-center gap-3">
              <Icon className={`w-5 h-5 ${tier.color}`} />
              <div>
                <p className="text-sm font-medium text-white">{tier.label}</p>
                <p className="text-xs text-gray-500">{tier.sublabel}</p>
              </div>
            </div>
            <p className={`font-bold font-display ${tier.color}`}>
              {formatCurrency(tier.amount)}
            </p>
          </motion.div>
        );
      })}

      {prizePool.jackpot?.rollover > 0 && (
        <div className="p-3 rounded-xl border border-amber-500/30 bg-amber-500/10">
          <p className="text-amber-400 text-sm font-medium">
            + {formatCurrency(prizePool.jackpot.rollover)} Jackpot Rollover
          </p>
          <p className="text-amber-400/60 text-xs">From previous month with no 5-match winner</p>
        </div>
      )}
    </div>
  );
}

export default PrizePool;

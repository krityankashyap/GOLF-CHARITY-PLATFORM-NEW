import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, ArrowLeft, Award } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card.jsx';
import StatusBadge from '@/components/atoms/StatusBadge/StatusBadge.jsx';
import useGetWinners from '@/hooks/apis/winners/useGetWinners.js';
import { formatCurrency, formatDate, getMonthName } from '@/lib/utils.js';

function Winners() {
  const { winners, loading } = useGetWinners();

  return (
    <div className="min-h-screen bg-forest-900 text-white">
      <div className="border-b border-forest-700/50 bg-forest-800/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          <span className="font-display font-bold text-white">Golf Charity</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-gold-500/10 border border-gold-500/20 rounded-full px-4 py-1.5 mb-4">
            <Trophy className="w-4 h-4 text-gold-500" />
            <span className="text-gold-400 text-sm">Hall of Champions</span>
          </div>
          <h1 className="font-display text-4xl font-bold text-white mb-3">Recent Winners</h1>
          <p className="text-gray-400">
            Verified winners from our monthly draws
          </p>
        </motion.div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 rounded-xl bg-forest-800/50 animate-pulse" />
            ))}
          </div>
        ) : winners.length > 0 ? (
          <div className="space-y-4">
            {winners.map((winner, i) => (
              <motion.div
                key={winner._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card>
                  <CardContent className="p-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center border-2 ${
                        winner.matchType === '5-match'
                          ? 'bg-gold-500/10 border-gold-500/40'
                          : winner.matchType === '4-match'
                          ? 'bg-emerald-500/10 border-emerald-500/40'
                          : 'bg-blue-500/10 border-blue-500/40'
                      }`}>
                        <Award className={`w-6 h-6 ${
                          winner.matchType === '5-match'
                            ? 'text-gold-400'
                            : winner.matchType === '4-match'
                            ? 'text-emerald-400'
                            : 'text-blue-400'
                        }`} />
                      </div>
                      <div>
                        <p className="font-semibold text-white">
                          {winner.userId?.name || 'Anonymous'}
                        </p>
                        <p className="text-xs text-gray-400">
                          {winner.drawId
                            ? `${getMonthName(winner.drawId.month)} ${winner.drawId.year}`
                            : 'Unknown draw'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <StatusBadge status={winner.matchType} />
                      <div className="text-right">
                        <p className="font-bold text-gold-400 font-display">
                          {formatCurrency(winner.prizeAmount)}
                        </p>
                        <p className="text-xs text-gray-500">{formatDate(winner.createdAt)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Trophy className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500">No verified winners yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Winners;

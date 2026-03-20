import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Target } from 'lucide-react';
import { formatDate } from '@/lib/utils.js';

function ScoreCard({ score, index, onDelete }) {
  const getScoreColor = (value) => {
    if (value >= 35) return 'text-gold-400 border-gold-500/40 bg-gold-500/10';
    if (value >= 25) return 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10';
    if (value >= 15) return 'text-blue-400 border-blue-500/40 bg-blue-500/10';
    return 'text-gray-400 border-gray-500/40 bg-gray-500/10';
  };

  const getLabel = (value) => {
    if (value >= 35) return 'Excellent';
    if (value >= 25) return 'Good';
    if (value >= 15) return 'Average';
    return 'Below Average';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex items-center justify-between p-4 rounded-xl border border-forest-700/50 bg-forest-800/50 hover:bg-forest-700/40 transition-colors group"
    >
      <div className="flex items-center gap-4">
        <div
          className={`w-14 h-14 rounded-xl border-2 flex items-center justify-center font-bold text-xl font-display transition-all ${getScoreColor(score.value)}`}
        >
          {score.value}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <Target className="w-3.5 h-3.5 text-gold-500" />
            <span className="text-sm font-semibold text-white">
              {getLabel(score.value)} Score
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <Calendar className="w-3 h-3 text-gray-500" />
            <span className="text-xs text-gray-400">{formatDate(score.date)}</span>
          </div>
        </div>
      </div>

      {onDelete && (
        <button
          onClick={() => onDelete(index)}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300 text-xs px-3 py-1.5 rounded-lg border border-red-500/30 hover:border-red-400/50 hover:bg-red-500/10"
        >
          Remove
        </button>
      )}
    </motion.div>
  );
}

export default ScoreCard;

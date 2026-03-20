import React from 'react';
import DrawBall from '@/components/atoms/DrawBall/DrawBall.jsx';
import { formatCurrency, getMonthName } from '@/lib/utils.js';
import StatusBadge from '@/components/atoms/StatusBadge/StatusBadge.jsx';

function DrawResult({ draw, userMatchedNumbers = [] }) {
  if (!draw || draw.status !== 'published') {
    return (
      <div className="p-6 text-center text-gray-400">
        <p>Draw results not yet published</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display text-lg font-semibold text-white">
            {getMonthName(draw.month)} {draw.year} Draw
          </h3>
          <p className="text-sm text-gray-400">
            Prize Pool: {formatCurrency(draw.prizePool?.total || 0)}
          </p>
        </div>
        <StatusBadge status={draw.status} />
      </div>

      <div>
        <p className="text-xs text-gray-500 mb-3 uppercase tracking-wider">Winning Numbers</p>
        <div className="flex gap-2 flex-wrap">
          {draw.drawNumbers?.map((num, i) => (
            <DrawBall
              key={num}
              number={num}
              isMatched={userMatchedNumbers.includes(num)}
              delay={i * 0.1}
            />
          ))}
        </div>
      </div>

      {userMatchedNumbers.length > 0 && (
        <div className="p-3 rounded-lg bg-gold-500/10 border border-gold-500/20">
          <p className="text-gold-400 text-sm font-medium">
            You matched {userMatchedNumbers.length} number{userMatchedNumbers.length !== 1 ? 's' : ''}!
          </p>
          <p className="text-gold-300/70 text-xs mt-0.5">
            Matched: {userMatchedNumbers.join(', ')}
          </p>
        </div>
      )}
    </div>
  );
}

export default DrawResult;

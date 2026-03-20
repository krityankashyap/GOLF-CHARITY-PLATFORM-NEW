import React from 'react';
import { Heart } from 'lucide-react';

function CharityBadge({ name, featured = false }) {
  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
        featured
          ? 'bg-gold-500/10 text-gold-400 border-gold-500/30'
          : 'bg-forest-700/50 text-gray-300 border-forest-600/50'
      }`}
    >
      <Heart className={`w-3 h-3 ${featured ? 'text-gold-500 fill-gold-500' : 'text-gray-400'}`} />
      {name}
    </div>
  );
}

export default CharityBadge;

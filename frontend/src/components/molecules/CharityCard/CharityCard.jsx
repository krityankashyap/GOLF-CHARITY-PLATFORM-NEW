import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Star, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { formatCurrency, truncate } from '@/lib/utils.js';

function CharityCard({ charity, onSelect, selected = false }) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className={`relative overflow-hidden cursor-pointer transition-all duration-300 ${
          selected
            ? 'border-gold-500/60 shadow-gold-500/20 shadow-lg ring-1 ring-gold-500/30'
            : 'hover:border-forest-600'
        }`}
        onClick={onSelect ? () => onSelect(charity) : undefined}
      >
        {charity.featured && (
          <div className="absolute top-3 right-3 z-10">
            <div className="flex items-center gap-1 bg-gold-500/20 border border-gold-500/30 rounded-full px-2 py-0.5">
              <Star className="w-3 h-3 text-gold-400 fill-gold-400" />
              <span className="text-xs text-gold-400 font-medium">Featured</span>
            </div>
          </div>
        )}

        {charity.images?.[0] && (
          <div className="h-36 overflow-hidden">
            <img
              src={charity.images[0]}
              alt={charity.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {!charity.images?.[0] && (
          <div className="h-20 bg-gradient-to-br from-forest-700 to-forest-800 flex items-center justify-center">
            <Heart className="w-8 h-8 text-gold-500/40" />
          </div>
        )}

        <CardContent className="p-4">
          <h3 className="font-display font-semibold text-white mb-1">{charity.name}</h3>
          <p className="text-xs text-gray-400 mb-3 leading-relaxed">
            {truncate(charity.description, 80)}
          </p>

          <div className="flex items-center justify-between text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Heart className="w-3 h-3 text-gold-500" />
              Total raised: {formatCurrency(charity.totalContributed || 0)}
            </span>
            {selected && (
              <span className="text-gold-400 font-medium">Selected</span>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default CharityCard;

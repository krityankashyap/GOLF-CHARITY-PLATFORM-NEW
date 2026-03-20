import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Heart, ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input.jsx';
import CharityCard from '@/components/molecules/CharityCard/CharityCard.jsx';
import useGetCharities from '@/hooks/apis/charities/useGetCharities.js';

function Charities() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const { charities, loading, total } = useGetCharities({ search: debouncedSearch });

  const handleSearch = useCallback((e) => {
    setSearch(e.target.value);
    clearTimeout(window._searchTimeout);
    window._searchTimeout = setTimeout(() => {
      setDebouncedSearch(e.target.value);
    }, 400);
  }, []);

  return (
    <div className="min-h-screen bg-forest-900 text-white">
      {/* Header */}
      <div className="border-b border-forest-700/50 bg-forest-800/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>
          <div className="font-display font-bold text-white">Golf Charity</div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-gold-500/10 border border-gold-500/20 rounded-full px-4 py-1.5 mb-4">
            <Heart className="w-4 h-4 text-gold-500" />
            <span className="text-gold-400 text-sm">Make an impact</span>
          </div>
          <h1 className="font-display text-4xl font-bold text-white mb-3">
            Our Charity Partners
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            Choose a charity to support with your subscription. A minimum of 10% of every payment goes directly to your chosen cause.
          </p>
        </motion.div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-8 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <Input
            placeholder="Search charities..."
            value={search}
            onChange={handleSearch}
            className="pl-10"
          />
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-52 rounded-xl bg-forest-800/50 animate-pulse" />
            ))}
          </div>
        ) : charities.length > 0 ? (
          <>
            <p className="text-xs text-gray-500 mb-4">
              Showing {charities.length} of {total} charities
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {charities.map((charity, i) => (
                <motion.div
                  key={charity._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <CharityCard charity={charity} />
                </motion.div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <Heart className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500">No charities found</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Charities;

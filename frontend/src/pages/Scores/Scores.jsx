import React from 'react';
import { motion } from 'framer-motion';
import { Target, Info } from 'lucide-react';
import DashboardLayout from '@/components/organisms/Dashboard/DashboardLayout.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import ScoreCard from '@/components/atoms/ScoreCard/ScoreCard.jsx';
import ScoreEntry from '@/components/molecules/ScoreEntry/ScoreEntry.jsx';
import useGetScores from '@/hooks/apis/scores/useGetScores.js';
import useAddScore from '@/hooks/apis/scores/useAddScore.js';
import scoresApi from '@/apis/scores/index.js';
import { toast } from 'sonner';

function Scores() {
  const { scores, loading, refetch } = useGetScores();

  const { addScore, loading: addLoading } = useAddScore((newScores) => {
    refetch();
  });

  const handleDelete = async (index) => {
    try {
      await scoresApi.deleteScore(index);
      toast.success('Score removed');
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove score');
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-3xl font-bold text-white">My Golf Scores</h1>
          <p className="text-gray-400 mt-1">Track your last 5 Stableford scores</p>
        </motion.div>

        {/* Info card */}
        <div className="flex items-start gap-3 p-4 rounded-xl bg-forest-800/50 border border-forest-700/50">
          <Info className="w-4 h-4 text-gold-500 shrink-0 mt-0.5" />
          <div className="text-xs text-gray-400 leading-relaxed">
            <p className="font-medium text-gray-300 mb-1">How scores work</p>
            <p>You can keep up to 5 Stableford scores (range: 1–45). When you add a 6th score, the oldest is automatically removed. Your scores are used to match against monthly draw numbers.</p>
          </div>
        </div>

        {/* Add score */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Target className="w-4 h-4 text-gold-400" />
              Add New Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScoreEntry
              onAdd={addScore}
              loading={addLoading}
              currentCount={scores.length}
            />
          </CardContent>
        </Card>

        {/* Score list */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Your Scores ({scores.length}/5)</CardTitle>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-all ${
                      i < scores.length ? 'bg-gold-500' : 'bg-forest-700'
                    }`}
                  />
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-16 rounded-xl bg-forest-700/30 animate-pulse" />
                ))}
              </div>
            ) : scores.length > 0 ? (
              <div className="space-y-3">
                {scores.map((score, i) => (
                  <ScoreCard
                    key={`${score.value}-${score.date}-${i}`}
                    score={score}
                    index={i}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <Target className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500">No scores yet. Add your first score above!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default Scores;

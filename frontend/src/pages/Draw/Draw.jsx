import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Calendar } from 'lucide-react';
import DashboardLayout from '@/components/organisms/Dashboard/DashboardLayout.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import DrawResult from '@/components/molecules/DrawResult/DrawResult.jsx';
import PrizePool from '@/components/molecules/PrizePool/PrizePool.jsx';
import DrawBall from '@/components/atoms/DrawBall/DrawBall.jsx';
import StatusBadge from '@/components/atoms/StatusBadge/StatusBadge.jsx';
import useGetDraws from '@/hooks/apis/draws/useGetDraws.js';
import useGetCurrentDraw from '@/hooks/apis/draws/useGetCurrentDraw.js';
import { getMonthName, formatDate } from '@/lib/utils.js';
import drawsApi from '@/apis/draws/index.js';

function Draw() {
  const { draw: currentDraw, loading: currentLoading } = useGetCurrentDraw();
  const { draws, loading: drawsLoading } = useGetDraws();
  const [myResult, setMyResult] = useState(null);
  const [resultLoading, setResultLoading] = useState(false);
  const [selectedDrawId, setSelectedDrawId] = useState(null);

  const fetchMyResult = async (drawId) => {
    try {
      setResultLoading(true);
      setSelectedDrawId(drawId);
      const res = await drawsApi.getMyResult(drawId);
      setMyResult(res.data.data);
    } catch (err) {
      setMyResult(null);
    } finally {
      setResultLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-3xl font-bold text-white">Monthly Draws</h1>
          <p className="text-gray-400 mt-1">View draw results and check your matches</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Current draw */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Trophy className="w-4 h-4 text-gold-400" />
                Current Draw
              </CardTitle>
            </CardHeader>
            <CardContent>
              {currentLoading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-8 rounded-lg bg-forest-700/30 animate-pulse" />
                  ))}
                </div>
              ) : currentDraw ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-semibold">
                      {getMonthName(currentDraw.month)} {currentDraw.year}
                    </span>
                    <StatusBadge status={currentDraw.status} />
                  </div>
                  <PrizePool
                    prizePool={currentDraw.prizePool}
                    activeSubscribers={currentDraw.activeSubscribers}
                  />
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No draw configured for this month</p>
              )}
            </CardContent>
          </Card>

          {/* My result for selected draw */}
          {myResult && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Your Result</CardTitle>
              </CardHeader>
              <CardContent>
                <DrawResult
                  draw={myResult.draw}
                  userMatchedNumbers={myResult.matchedNumbers}
                />
                <div className="mt-4">
                  <p className="text-xs text-gray-500 mb-2">Your Scores</p>
                  <div className="flex gap-2 flex-wrap">
                    {myResult.userScores.map((score) => (
                      <DrawBall
                        key={score}
                        number={score}
                        isMatched={myResult.matchedNumbers.includes(score)}
                        size="sm"
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Past draws */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gold-400" />
              Past Draws
            </CardTitle>
          </CardHeader>
          <CardContent>
            {drawsLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-16 rounded-xl bg-forest-700/30 animate-pulse" />
                ))}
              </div>
            ) : draws.length > 0 ? (
              <div className="space-y-3">
                {draws.map((draw) => (
                  <div
                    key={draw._id}
                    className="flex items-center justify-between p-4 rounded-xl border border-forest-700/50 bg-forest-800/30 hover:bg-forest-700/30 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-white text-sm">
                        {getMonthName(draw.month)} {draw.year}
                      </p>
                      <div className="flex gap-1.5 mt-1">
                        {draw.drawNumbers?.map((n) => (
                          <span
                            key={n}
                            className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-forest-700 text-white text-xs font-bold border border-forest-600"
                          >
                            {n}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge status={draw.status} />
                      <button
                        onClick={() => fetchMyResult(draw._id)}
                        disabled={resultLoading && selectedDrawId === draw._id}
                        className="text-xs text-gold-500 hover:text-gold-400 transition-colors border border-gold-500/30 hover:bg-gold-500/10 px-3 py-1.5 rounded-lg"
                      >
                        My Result
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <Trophy className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500">No published draws yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default Draw;

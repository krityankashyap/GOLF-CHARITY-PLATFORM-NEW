import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, Target, Heart, Trophy, ChevronRight, AlertCircle } from 'lucide-react';
import DashboardLayout from '@/components/organisms/Dashboard/DashboardLayout.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import StatusBadge from '@/components/atoms/StatusBadge/StatusBadge.jsx';
import useAuth from '@/hooks/context/useAuth.js';
import useGetSubscription from '@/hooks/apis/subscriptions/useGetSubscription.js';
import useGetScores from '@/hooks/apis/scores/useGetScores.js';
import useGetCurrentDraw from '@/hooks/apis/draws/useGetCurrentDraw.js';
import { formatCurrency, formatDate, getMonthName } from '@/lib/utils.js';

function Dashboard() {
  const { user } = useAuth();
  const { subscription, loading: subLoading } = useGetSubscription();
  const { scores, loading: scoresLoading } = useGetScores();
  const { draw } = useGetCurrentDraw();

  const isActive = subscription?.status === 'active';

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-5xl mx-auto">
        {/* Welcome */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-3xl font-bold text-white">
            Welcome back, {user?.name?.split(' ')[0]}
          </h1>
          <p className="text-gray-400 mt-1">Here's your golf charity overview</p>
        </motion.div>

        {/* Subscription alert */}
        {!isActive && !subLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20"
          >
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-amber-300 font-medium text-sm">No active subscription</p>
              <p className="text-amber-400/70 text-xs mt-0.5">
                Subscribe to enter scores and participate in draws.
              </p>
            </div>
            <Link to="/subscribe" className="ml-auto shrink-0">
              <Button size="sm">Subscribe Now</Button>
            </Link>
          </motion.div>
        )}

        {/* Stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              icon: CreditCard,
              label: 'Subscription',
              value: subscription?.status || 'None',
              sub: subscription?.plan ? `${subscription.plan} plan` : 'Not subscribed',
              color: 'text-gold-400',
              isStatus: true,
            },
            {
              icon: Target,
              label: 'Scores on File',
              value: scores.length,
              sub: `${5 - scores.length} slots remaining`,
              color: 'text-blue-400',
            },
            {
              icon: Trophy,
              label: 'Current Draw',
              value: draw ? `${getMonthName(draw.month)} ${draw.year}` : 'N/A',
              sub: draw ? `Status: ${draw.status}` : 'No draw configured',
              color: 'text-emerald-400',
            },
            {
              icon: Heart,
              label: 'Charity',
              value: user?.selectedCharity?.name || 'Not selected',
              sub: `${user?.charityContributionPercent || 10}% contribution`,
              color: 'text-rose-400',
            },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card>
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <Icon className={`w-5 h-5 ${stat.color}`} />
                      {stat.isStatus && subscription?.status && (
                        <StatusBadge status={subscription.status} />
                      )}
                    </div>
                    <p className="text-lg font-bold text-white font-display truncate">{stat.value}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{stat.sub}</p>
                    <p className="text-xs text-gray-600 mt-1">{stat.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Two column layout */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Recent scores */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Recent Scores</CardTitle>
                <Link to="/dashboard/scores">
                  <Button variant="ghost" size="sm" className="text-xs">
                    Manage <ChevronRight className="w-3 h-3 ml-1" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {scoresLoading ? (
                <div className="space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-10 rounded-lg bg-forest-700/30 animate-pulse" />
                  ))}
                </div>
              ) : scores.length > 0 ? (
                <div className="space-y-2">
                  {scores.slice(0, 3).map((score, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-2 px-3 rounded-lg bg-forest-700/30"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gold-500/10 border border-gold-500/20 flex items-center justify-center">
                          <span className="text-gold-400 text-sm font-bold">{score.value}</span>
                        </div>
                        <span className="text-xs text-gray-400">{formatDate(score.date)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Target className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No scores yet</p>
                  {isActive && (
                    <Link to="/dashboard/scores">
                      <Button size="sm" variant="outline" className="mt-3 text-xs">
                        Add your first score
                      </Button>
                    </Link>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Subscription detail */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Subscription</CardTitle>
                {!isActive && (
                  <Link to="/subscribe">
                    <Button size="sm">Subscribe</Button>
                  </Link>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {subscription ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Plan</span>
                    <span className="text-sm text-white capitalize">{subscription.plan}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Status</span>
                    <StatusBadge status={subscription.status} />
                  </div>
                  {subscription.nextRenewalDate && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Renews</span>
                      <span className="text-sm text-white">{formatDate(subscription.nextRenewalDate)}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Amount</span>
                    <span className="text-sm text-white">{formatCurrency(subscription.amount || 0)}</span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <CreditCard className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No active subscription</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick actions */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { to: '/dashboard/scores', label: 'Add Score', icon: Target },
                { to: '/draws', label: 'View Draws', icon: Trophy },
                { to: '/charities', label: 'Charities', icon: Heart },
                { to: '/subscribe', label: isActive ? 'Manage Plan' : 'Subscribe', icon: CreditCard },
              ].map((action) => {
                const Icon = action.icon;
                return (
                  <Link key={action.to} to={action.to}>
                    <button className="w-full flex flex-col items-center gap-2 p-4 rounded-xl border border-forest-700/50 hover:border-gold-500/30 hover:bg-gold-500/5 transition-all duration-200 text-center">
                      <Icon className="w-5 h-5 text-gold-400" />
                      <span className="text-xs text-gray-300">{action.label}</span>
                    </button>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;

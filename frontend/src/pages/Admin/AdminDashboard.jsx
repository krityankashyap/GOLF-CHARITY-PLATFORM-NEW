import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Trophy, Heart, Award, TrendingUp } from 'lucide-react';
import AdminLayout from '@/components/organisms/Admin/AdminLayout.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import adminApi from '@/apis/admin/index.js';
import { formatCurrency } from '@/lib/utils.js';

function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getAnalytics()
      .then((res) => setAnalytics(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const stats = analytics
    ? [
        { icon: Users, label: 'Total Users', value: analytics.totalUsers, color: 'text-blue-400' },
        { icon: TrendingUp, label: 'Active Subscribers', value: analytics.activeSubscriptions, color: 'text-emerald-400' },
        { icon: Trophy, label: 'Monthly Revenue', value: formatCurrency(analytics.monthlyRevenue || 0), color: 'text-gold-400' },
        { icon: Heart, label: 'Yearly Revenue', value: formatCurrency(analytics.yearlyRevenue || 0), color: 'text-rose-400' },
      ]
    : [];

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-3xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-gray-400 mt-1">Platform overview and analytics</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {loading
            ? [...Array(4)].map((_, i) => (
                <div key={i} className="h-28 rounded-xl bg-forest-800/50 animate-pulse" />
              ))
            : stats.map((stat, i) => {
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
                        <Icon className={`w-5 h-5 ${stat.color} mb-3`} />
                        <p className="text-2xl font-bold text-white font-display">{stat.value}</p>
                        <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  { label: 'Configure monthly draw', href: '/admin/draws' },
                  { label: 'Review pending winners', href: '/admin/winners' },
                  { label: 'Add new charity', href: '/admin/charities' },
                  { label: 'Manage users', href: '/admin/users' },
                ].map((action) => (
                  <a
                    key={action.href}
                    href={action.href}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-forest-700/30 transition-colors border border-transparent hover:border-forest-700/50"
                  >
                    <span className="text-sm text-gray-300">{action.label}</span>
                    <span className="text-xs text-gold-500">→</span>
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Platform Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { label: 'API Server', status: 'Operational' },
                  { label: 'Payment Processing', status: 'Operational' },
                  { label: 'Email Service', status: 'Operational' },
                  { label: 'File Storage', status: 'Operational' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">{item.label}</span>
                    <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminDashboard;

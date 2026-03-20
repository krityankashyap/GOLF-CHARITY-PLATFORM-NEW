import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, CheckCircle, XCircle, DollarSign } from 'lucide-react';
import AdminLayout from '@/components/organisms/Admin/AdminLayout.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.jsx';
import StatusBadge from '@/components/atoms/StatusBadge/StatusBadge.jsx';
import adminApi from '@/apis/admin/index.js';
import { toast } from 'sonner';
import { formatCurrency, formatDate, getMonthName } from '@/lib/utils.js';

function AdminWinners() {
  const [winners, setWinners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');

  const fetchWinners = async () => {
    try {
      setLoading(true);
      const params = { page: 1, limit: 50 };
      if (filter !== 'all') params.verificationStatus = filter;
      const res = await adminApi.getAllWinners(params);
      setWinners(res.data.data?.winners || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWinners();
  }, [filter]);

  const handleVerify = async (winnerId, status) => {
    try {
      await adminApi.verifyWinner(winnerId, { status });
      toast.success(`Winner ${status}`);
      fetchWinners();
    } catch (err) {
      toast.error('Failed to update winner');
    }
  };

  const handleMarkPaid = async (winnerId) => {
    try {
      await adminApi.markPaid(winnerId);
      toast.success('Marked as paid');
      fetchWinners();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to mark as paid');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-3xl font-bold text-white">Winner Management</h1>
          <p className="text-gray-400 mt-1">Verify proofs and manage payouts</p>
        </motion.div>

        {/* Filter tabs */}
        <div className="flex gap-2">
          {['pending', 'approved', 'rejected', 'all'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                filter === f
                  ? 'bg-gold-500/20 text-gold-400 border border-gold-500/30'
                  : 'text-gray-400 hover:text-white border border-forest-700/50 hover:bg-forest-700/30'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Award className="w-4 h-4 text-gold-400" />
              Winners ({winners.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-14 rounded-lg bg-forest-700/30 animate-pulse" />
                ))}
              </div>
            ) : winners.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Draw</TableHead>
                    <TableHead>Match</TableHead>
                    <TableHead>Prize</TableHead>
                    <TableHead>Proof</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {winners.map((winner) => (
                    <TableRow key={winner._id}>
                      <TableCell className="font-medium text-white">
                        {winner.userId?.name || 'N/A'}
                      </TableCell>
                      <TableCell>
                        {winner.drawId
                          ? `${getMonthName(winner.drawId.month)} ${winner.drawId.year}`
                          : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={winner.matchType} />
                      </TableCell>
                      <TableCell className="text-gold-400 font-semibold">
                        {formatCurrency(winner.prizeAmount)}
                      </TableCell>
                      <TableCell>
                        {winner.proofUrl ? (
                          <a
                            href={winner.proofUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-gold-500 hover:underline"
                          >
                            View Proof
                          </a>
                        ) : (
                          <span className="text-xs text-gray-500">Not uploaded</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={winner.verificationStatus} />
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={winner.paymentStatus} />
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {winner.verificationStatus === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleVerify(winner._id, 'approved')}
                                className="h-7 px-2 text-emerald-400 hover:text-emerald-300"
                              >
                                <CheckCircle className="w-3.5 h-3.5" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleVerify(winner._id, 'rejected')}
                                className="h-7 px-2 text-red-400 hover:text-red-300"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                              </Button>
                            </>
                          )}
                          {winner.verificationStatus === 'approved' && winner.paymentStatus === 'pending' && (
                            <Button
                              size="sm"
                              onClick={() => handleMarkPaid(winner._id)}
                              className="h-7 px-2 text-xs"
                            >
                              <DollarSign className="w-3 h-3 mr-1" />
                              Pay
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8">
                <Award className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">No winners with this status</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

export default AdminWinners;

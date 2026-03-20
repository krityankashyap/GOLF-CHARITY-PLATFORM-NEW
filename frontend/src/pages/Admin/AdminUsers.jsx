import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, Users, Edit } from 'lucide-react';
import AdminLayout from '@/components/organisms/Admin/AdminLayout.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.jsx';
import StatusBadge from '@/components/atoms/StatusBadge/StatusBadge.jsx';
import adminApi from '@/apis/admin/index.js';
import { formatDate } from '@/lib/utils.js';

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await adminApi.getUsers({ page, limit: 20, search });
      const data = res.data.data;
      setUsers(data?.users || []);
      setTotal(data?.total || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    const timeout = setTimeout(fetchUsers, 300);
    return () => clearTimeout(timeout);
  }, [fetchUsers]);

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-3xl font-bold text-white">User Management</h1>
          <p className="text-gray-400 mt-1">{total} total users</p>
        </motion.div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="w-4 h-4 text-gold-400" />
                All Users
              </CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input
                  placeholder="Search users..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-12 rounded-lg bg-forest-700/30 animate-pulse" />
                ))}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Subscription</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell className="font-medium text-white">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${
                          user.role === 'admin'
                            ? 'bg-red-500/10 text-red-400 border-red-500/30'
                            : 'bg-forest-700 text-gray-400 border-forest-600'
                        }`}>
                          {user.role}
                        </span>
                      </TableCell>
                      <TableCell>
                        {user.subscriptionId ? (
                          <StatusBadge status={user.subscriptionId.status} />
                        ) : (
                          <span className="text-xs text-gray-500">None</span>
                        )}
                      </TableCell>
                      <TableCell>{formatDate(user.createdAt)}</TableCell>
                      <TableCell>
                        <Button size="sm" variant="ghost" className="h-7 px-2">
                          <Edit className="w-3.5 h-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            {/* Pagination */}
            {total > 20 && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-forest-700/50">
                <p className="text-xs text-gray-500">
                  Page {page} of {Math.ceil(total / 20)}
                </p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setPage((p) => p + 1)}
                    disabled={page >= Math.ceil(total / 20)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

export default AdminUsers;

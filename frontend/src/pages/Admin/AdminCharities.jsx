import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Plus, Edit, Trash2, Star } from 'lucide-react';
import AdminLayout from '@/components/organisms/Admin/AdminLayout.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog.jsx';
import adminApi from '@/apis/admin/index.js';
import charitiesApi from '@/apis/charities/index.js';
import { toast } from 'sonner';
import { formatCurrency } from '@/lib/utils.js';

function AdminCharities() {
  const [charities, setCharities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCharity, setEditingCharity] = useState(null);
  const [form, setForm] = useState({ name: '', description: '' });
  const [saving, setSaving] = useState(false);

  const fetchCharities = async () => {
    try {
      const res = await charitiesApi.getCharities({ limit: 100 });
      setCharities(res.data.data?.charities || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCharities();
  }, []);

  const openCreate = () => {
    setEditingCharity(null);
    setForm({ name: '', description: '' });
    setDialogOpen(true);
  };

  const openEdit = (charity) => {
    setEditingCharity(charity);
    setForm({ name: charity.name, description: charity.description });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.description) {
      toast.error('Name and description are required');
      return;
    }
    try {
      setSaving(true);
      if (editingCharity) {
        await adminApi.updateCharity(editingCharity._id, form);
        toast.success('Charity updated');
      } else {
        await adminApi.createCharity(form);
        toast.success('Charity created');
      }
      setDialogOpen(false);
      fetchCharities();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save charity');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (charityId) => {
    if (!window.confirm('Delete this charity? This cannot be undone.')) return;
    try {
      await adminApi.deleteCharity(charityId);
      toast.success('Charity deleted');
      fetchCharities();
    } catch (err) {
      toast.error('Failed to delete charity');
    }
  };

  const handleToggleFeatured = async (charityId) => {
    try {
      await adminApi.toggleFeatured(charityId);
      fetchCharities();
    } catch (err) {
      toast.error('Failed to update charity');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-3xl font-bold text-white">Charity Management</h1>
              <p className="text-gray-400 mt-1">Manage platform charity partners</p>
            </div>
            <Button onClick={openCreate}>
              <Plus className="w-4 h-4 mr-2" />
              Add Charity
            </Button>
          </div>
        </motion.div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Heart className="w-4 h-4 text-gold-400" />
              All Charities ({charities.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-16 rounded-xl bg-forest-700/30 animate-pulse" />
                ))}
              </div>
            ) : charities.length > 0 ? (
              <div className="space-y-3">
                {charities.map((charity) => (
                  <div
                    key={charity._id}
                    className="flex items-center justify-between p-4 rounded-xl border border-forest-700/50 bg-forest-800/30"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-white text-sm truncate">{charity.name}</p>
                        {charity.featured && (
                          <Star className="w-3.5 h-3.5 text-gold-400 fill-gold-400 shrink-0" />
                        )}
                        {!charity.active && (
                          <span className="text-xs text-gray-500">(inactive)</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Raised: {formatCurrency(charity.totalContributed || 0)}
                      </p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleToggleFeatured(charity._id)}
                        className={charity.featured ? 'text-gold-400' : ''}
                      >
                        <Star className="w-3.5 h-3.5" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => openEdit(charity)}>
                        <Edit className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(charity._id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Heart className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">No charities yet. Add one above.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCharity ? 'Edit Charity' : 'Add New Charity'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Charity Name</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Cancer Research UK"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Describe the charity's mission..."
                className="w-full min-h-[100px] rounded-lg border border-forest-700 bg-forest-900/80 px-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-gold-500 resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : editingCharity ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}

export default AdminCharities;

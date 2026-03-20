import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Play, Send, Settings } from 'lucide-react';
import AdminLayout from '@/components/organisms/Admin/AdminLayout.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import StatusBadge from '@/components/atoms/StatusBadge/StatusBadge.jsx';
import adminApi from '@/apis/admin/index.js';
import { toast } from 'sonner';
import { getMonthName } from '@/lib/utils.js';

function AdminDraws() {
  const [draws, setDraws] = useState([]);
  const [loading, setLoading] = useState(true);
  const [configuring, setConfiguring] = useState(false);
  const [form, setForm] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    drawType: 'random',
  });

  const fetchDraws = async () => {
    try {
      const res = await adminApi.getAllDraws({ page: 1, limit: 20 });
      setDraws(res.data.data?.draws || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDraws();
  }, []);

  const handleConfigure = async () => {
    try {
      setConfiguring(true);
      await adminApi.configureDraw({
        month: parseInt(form.month),
        year: parseInt(form.year),
        drawType: form.drawType,
      });
      toast.success('Draw configured successfully');
      fetchDraws();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to configure draw');
    } finally {
      setConfiguring(false);
    }
  };

  const handleSimulate = async (drawId) => {
    try {
      await adminApi.simulateDraw(drawId);
      toast.success('Draw simulated');
      fetchDraws();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Simulation failed');
    }
  };

  const handlePublish = async (drawId) => {
    if (!window.confirm('Are you sure you want to publish this draw? This cannot be undone.')) return;
    try {
      await adminApi.publishDraw(drawId);
      toast.success('Draw published and winners recorded!');
      fetchDraws();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to publish draw');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-3xl font-bold text-white">Draw Management</h1>
          <p className="text-gray-400 mt-1">Configure, simulate, and publish monthly draws</p>
        </motion.div>

        {/* Configure draw */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Settings className="w-4 h-4 text-gold-400" />
              Configure New Draw
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-3 gap-4 mb-4">
              <div className="space-y-2">
                <Label>Month</Label>
                <Select
                  value={String(form.month)}
                  onValueChange={(v) => setForm((f) => ({ ...f, month: parseInt(v) }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[...Array(12)].map((_, i) => (
                      <SelectItem key={i + 1} value={String(i + 1)}>
                        {getMonthName(i + 1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Year</Label>
                <Input
                  type="number"
                  value={form.year}
                  onChange={(e) => setForm((f) => ({ ...f, year: parseInt(e.target.value) }))}
                  min={2024}
                  max={2100}
                />
              </div>

              <div className="space-y-2">
                <Label>Draw Type</Label>
                <Select
                  value={form.drawType}
                  onValueChange={(v) => setForm((f) => ({ ...f, drawType: v }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="random">Random</SelectItem>
                    <SelectItem value="algorithmic">Algorithmic (Weighted)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button onClick={handleConfigure} disabled={configuring}>
              {configuring ? 'Configuring...' : 'Configure Draw'}
            </Button>
          </CardContent>
        </Card>

        {/* Draws list */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Trophy className="w-4 h-4 text-gold-400" />
              All Draws
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-16 rounded-xl bg-forest-700/30 animate-pulse" />
                ))}
              </div>
            ) : draws.length > 0 ? (
              <div className="space-y-3">
                {draws.map((draw) => (
                  <div
                    key={draw._id}
                    className="flex items-center justify-between p-4 rounded-xl border border-forest-700/50 bg-forest-800/30"
                  >
                    <div>
                      <p className="font-medium text-white text-sm">
                        {getMonthName(draw.month)} {draw.year}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <StatusBadge status={draw.status} />
                        <span className="text-xs text-gray-500">{draw.drawType}</span>
                        {draw.drawNumbers?.length > 0 && (
                          <span className="text-xs text-gray-500">
                            Numbers: {draw.drawNumbers.join(', ')}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {draw.status === 'pending' && (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleSimulate(draw._id)}
                        >
                          <Play className="w-3.5 h-3.5 mr-1" />
                          Simulate
                        </Button>
                      )}
                      {(draw.status === 'pending' || draw.status === 'simulated') && (
                        <Button
                          size="sm"
                          onClick={() => handlePublish(draw._id)}
                        >
                          <Send className="w-3.5 h-3.5 mr-1" />
                          Publish
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Trophy className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">No draws yet. Configure one above.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

export default AdminDraws;

import React from 'react';
import { Badge } from '@/components/ui/badge.jsx';

const statusConfig = {
  active: { label: 'Active', variant: 'success' },
  inactive: { label: 'Inactive', variant: 'secondary' },
  lapsed: { label: 'Lapsed', variant: 'warning' },
  cancelled: { label: 'Cancelled', variant: 'destructive' },
  pending: { label: 'Pending', variant: 'warning' },
  approved: { label: 'Approved', variant: 'success' },
  rejected: { label: 'Rejected', variant: 'destructive' },
  paid: { label: 'Paid', variant: 'success' },
  published: { label: 'Published', variant: 'success' },
  simulated: { label: 'Simulated', variant: 'secondary' },
  '5-match': { label: 'Jackpot!', variant: 'default' },
  '4-match': { label: '4 Match', variant: 'success' },
  '3-match': { label: '3 Match', variant: 'secondary' },
};

function StatusBadge({ status }) {
  const config = statusConfig[status] || { label: status, variant: 'secondary' };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}

export default StatusBadge;

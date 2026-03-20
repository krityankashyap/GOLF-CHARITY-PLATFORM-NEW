import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '@/pages/Home/Home.jsx';
import Auth from '@/pages/Auth/Auth.jsx';
import Dashboard from '@/pages/Dashboard/Dashboard.jsx';
import Scores from '@/pages/Scores/Scores.jsx';
import Draw from '@/pages/Draw/Draw.jsx';
import Charities from '@/pages/Charities/Charities.jsx';
import Subscription from '@/pages/Subscription/Subscription.jsx';
import Winners from '@/pages/Winners/Winners.jsx';
import AdminDashboard from '@/pages/Admin/AdminDashboard.jsx';
import AdminUsers from '@/pages/Admin/AdminUsers.jsx';
import AdminDraws from '@/pages/Admin/AdminDraws.jsx';
import AdminCharities from '@/pages/Admin/AdminCharities.jsx';
import AdminWinners from '@/pages/Admin/AdminWinners.jsx';
import NotFound from '@/pages/NotFound/NotFound.jsx';
import ProtectedRoute from '@/components/molecules/ProtectedRoute/ProtectedRoute.jsx';

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/charities" element={<Charities />} />
      <Route path="/subscribe" element={<Subscription />} />
      <Route path="/winners" element={<Winners />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/scores" element={<Scores />} />
        <Route path="/draws" element={<Draw />} />
      </Route>

      <Route element={<ProtectedRoute requireAdmin />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/draws" element={<AdminDraws />} />
        <Route path="/admin/charities" element={<AdminCharities />} />
        <Route path="/admin/winners" element={<AdminWinners />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRouter;

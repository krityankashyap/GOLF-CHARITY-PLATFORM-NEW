import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '@/hooks/context/useAuth.js';

function ProtectedRoute({ requireAdmin = false }) {
  const { isAuthenticated, isAdmin, initialized } = useAuth();

  if (!initialized) {
    return (
      <div className="min-h-screen bg-forest-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-gold-500/30 border-t-gold-500 rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;

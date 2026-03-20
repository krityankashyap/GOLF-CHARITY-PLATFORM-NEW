import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Trophy,
  Heart,
  Award,
  LogOut,
  Menu,
  X,
  ShieldCheck,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar.jsx';
import useAuth from '@/hooks/context/useAuth.js';

const navItems = [
  { path: '/admin', icon: LayoutDashboard, label: 'Overview' },
  { path: '/admin/users', icon: Users, label: 'Users' },
  { path: '/admin/draws', icon: Trophy, label: 'Draws' },
  { path: '/admin/charities', icon: Heart, label: 'Charities' },
  { path: '/admin/winners', icon: Award, label: 'Winners' },
];

function AdminLayout({ children }) {
  const { user, clearAuth } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignout = () => {
    clearAuth();
    navigate('/');
  };

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-forest-900 flex">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 bottom-0 w-64 bg-forest-800 border-r border-forest-700/50 z-50 transition-transform duration-300 flex flex-col ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:relative`}
      >
        <div className="p-6 border-b border-forest-700/50">
          <Link to="/admin" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-500/20 border border-red-500/30 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-red-400" />
            </div>
            <div>
              <p className="font-display font-bold text-white text-sm">Admin Panel</p>
              <p className="text-xs text-gray-500">Golf Charity</p>
            </div>
          </Link>
        </div>

        <nav className="p-4 space-y-1 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium ${
                  isActive
                    ? 'bg-gold-500/15 text-gold-400 border border-gold-500/20'
                    : 'text-gray-400 hover:text-white hover:bg-forest-700/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-forest-700/50">
          <div className="flex items-center gap-3 mb-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.name}</p>
              <p className="text-xs text-red-400">Administrator</p>
            </div>
          </div>
          <button
            onClick={handleSignout}
            className="flex items-center gap-2 text-xs text-gray-400 hover:text-red-400 transition-colors w-full px-2 py-1.5 rounded-lg hover:bg-red-500/10"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign out
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden flex items-center justify-between p-4 border-b border-forest-700/50 bg-forest-800">
          <span className="font-display font-bold text-white">Admin Panel</span>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-400 hover:text-white">
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </header>
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}

export default AdminLayout;

import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Target,
  Trophy,
  Heart,
  CreditCard,
  LogOut,
  Menu,
  X,
  User,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar.jsx';
import { Button } from '@/components/ui/button.jsx';
import useAuth from '@/hooks/context/useAuth.js';

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/dashboard/scores', icon: Target, label: 'My Scores' },
  { path: '/draws', icon: Trophy, label: 'Draws' },
  { path: '/charities', icon: Heart, label: 'Charities' },
  { path: '/subscribe', icon: CreditCard, label: 'Subscription' },
];

function DashboardLayout({ children }) {
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
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ x: sidebarOpen ? 0 : '-100%' }}
        className="fixed left-0 top-0 bottom-0 w-64 bg-forest-800 border-r border-forest-700/50 z-50 lg:relative lg:translate-x-0 lg:block"
        style={{ transform: undefined }}
      >
        <div
          className={`fixed left-0 top-0 bottom-0 w-64 bg-forest-800 border-r border-forest-700/50 z-50 transition-transform duration-300 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 lg:relative`}
        >
          {/* Logo */}
          <div className="p-6 border-b border-forest-700/50">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gold-500/20 border border-gold-500/30 flex items-center justify-center">
                <span className="text-gold-400 font-bold text-sm">G</span>
              </div>
              <div>
                <p className="font-display font-bold text-white text-sm">Golf Charity</p>
                <p className="text-xs text-gray-500">Platform</p>
              </div>
            </Link>
          </div>

          {/* Nav */}
          <nav className="p-4 space-y-1 flex-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium ${
                    isActive
                      ? 'bg-gold-500/15 text-gold-400 border border-gold-500/20'
                      : 'text-gray-400 hover:text-white hover:bg-forest-700/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-gold-400' : ''}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* User section */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-forest-700/50">
            <div className="flex items-center gap-3 mb-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs">{initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
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
      </motion.aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <header className="lg:hidden flex items-center justify-between p-4 border-b border-forest-700/50 bg-forest-800">
          <Link to="/" className="font-display font-bold text-white">Golf Charity</Link>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-400 hover:text-white">
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;

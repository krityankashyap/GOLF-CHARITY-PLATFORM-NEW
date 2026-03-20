import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs.jsx';
import SigninCard from '@/components/organisms/Auth/SigninCard.jsx';
import SignupCard from '@/components/organisms/Auth/SignupCard.jsx';
import useAuth from '@/hooks/context/useAuth.js';

function Auth() {
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate(isAdmin ? '/admin' : '/dashboard', { replace: true });
    }
  }, [isAuthenticated, isAdmin, navigate]);

  return (
    <div className="min-h-screen bg-hero-pattern flex items-center justify-center px-4 py-12">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gold-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-forest-500/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gold-500/20 border border-gold-500/30 flex items-center justify-center">
                <span className="text-gold-400 font-bold text-lg font-display">G</span>
              </div>
              <span className="font-display font-bold text-white text-xl">Golf Charity</span>
            </div>
          </Link>
          <p className="text-gray-400 text-sm">Sign in to your account or create a new one</p>
        </div>

        {/* Auth card */}
        <div className="bg-forest-800/80 backdrop-blur-sm border border-forest-700/50 rounded-2xl p-8 shadow-2xl">
          <Tabs defaultValue="signin">
            <TabsList className="w-full mb-6">
              <TabsTrigger value="signin" className="flex-1">Sign In</TabsTrigger>
              <TabsTrigger value="signup" className="flex-1">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <SigninCard />
            </TabsContent>

            <TabsContent value="signup">
              <SignupCard />
            </TabsContent>
          </Tabs>
        </div>

        <p className="text-center text-xs text-gray-500 mt-6">
          <Link to="/" className="text-gold-500 hover:underline">Back to home</Link>
        </p>
      </motion.div>
    </div>
  );
}

export default Auth;

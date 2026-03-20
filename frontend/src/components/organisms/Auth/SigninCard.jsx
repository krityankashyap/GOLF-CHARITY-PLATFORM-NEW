import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Lock, Mail, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import useSignin from '@/hooks/apis/auth/useSignin.js';

const signinSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

function SigninCard() {
  const { signin, loading } = useSignin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(signinSchema) });

  return (
    <form onSubmit={handleSubmit(signin)} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="signin-email">Email address</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <Input
            id="signin-email"
            type="email"
            placeholder="you@example.com"
            className="pl-10"
            {...register('email')}
          />
        </div>
        {errors.email && (
          <p className="text-xs text-red-400">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="signin-password">Password</Label>
          <a href="/forgot-password" className="text-xs text-gold-500 hover:text-gold-400">
            Forgot password?
          </a>
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <Input
            id="signin-password"
            type="password"
            placeholder="••••••••"
            className="pl-10"
            {...register('password')}
          />
        </div>
        {errors.password && (
          <p className="text-xs text-red-400">{errors.password.message}</p>
        )}
      </div>

      <Button type="submit" disabled={loading} className="w-full" size="lg">
        {loading ? (
          <span className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-forest-900/30 border-t-forest-900 rounded-full animate-spin" />
            Signing in...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <LogIn className="w-4 h-4" />
            Sign In
          </span>
        )}
      </Button>
    </form>
  );
}

export default SigninCard;

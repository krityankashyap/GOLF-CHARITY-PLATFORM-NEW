import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Mail, Lock, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import useSignup from '@/hooks/apis/auth/useSignup.js';

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

function SignupCard() {
  const { signup, loading } = useSignup();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(signupSchema) });

  const onSubmit = ({ name, email, password }) => {
    signup({ name, email, password });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="signup-name">Full Name</Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <Input
            id="signup-name"
            type="text"
            placeholder="John Smith"
            className="pl-10"
            {...register('name')}
          />
        </div>
        {errors.name && <p className="text-xs text-red-400">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="signup-email">Email address</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <Input
            id="signup-email"
            type="email"
            placeholder="you@example.com"
            className="pl-10"
            {...register('email')}
          />
        </div>
        {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="signup-password">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <Input
            id="signup-password"
            type="password"
            placeholder="Min. 6 characters"
            className="pl-10"
            {...register('password')}
          />
        </div>
        {errors.password && <p className="text-xs text-red-400">{errors.password.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="signup-confirm">Confirm Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <Input
            id="signup-confirm"
            type="password"
            placeholder="Repeat your password"
            className="pl-10"
            {...register('confirmPassword')}
          />
        </div>
        {errors.confirmPassword && (
          <p className="text-xs text-red-400">{errors.confirmPassword.message}</p>
        )}
      </div>

      <Button type="submit" disabled={loading} className="w-full" size="lg">
        {loading ? (
          <span className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-forest-900/30 border-t-forest-900 rounded-full animate-spin" />
            Creating account...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <UserPlus className="w-4 h-4" />
            Create Account
          </span>
        )}
      </Button>

      <p className="text-xs text-center text-gray-500">
        By creating an account, you agree to our{' '}
        <a href="#" className="text-gold-500 hover:underline">Terms of Service</a> and{' '}
        <a href="#" className="text-gold-500 hover:underline">Privacy Policy</a>.
      </p>
    </form>
  );
}

export default SignupCard;

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import authApi from '@/apis/auth/index.js';
import useAuth from '@/hooks/context/useAuth.js';

const useSignup = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { persistAuth } = useAuth();
  const navigate = useNavigate();

  const signup = async (data) => {
    try {
      setLoading(true);
      setError(null);
      const res = await authApi.signup(data);
      const { user, token } = res.data.data;
      persistAuth(user, token);
      toast.success('Account created! Welcome to Golf Charity Platform.');
      navigate('/dashboard');
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Sign up failed';
      setError(message);
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  return { signup, loading, error };
};

export default useSignup;

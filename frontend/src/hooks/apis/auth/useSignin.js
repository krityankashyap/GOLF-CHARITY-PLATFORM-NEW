import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import authApi from '@/apis/auth/index.js';
import useAuth from '@/hooks/context/useAuth.js';

const useSignin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { persistAuth } = useAuth();
  const navigate = useNavigate();

  const signin = async (data) => {
    try {
      setLoading(true);
      setError(null);
      const res = await authApi.signin(data);
      const { user, token } = res.data.data;
      persistAuth(user, token);
      toast.success(`Welcome back, ${user.name}!`);
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Sign in failed';
      setError(message);
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  return { signin, loading, error };
};

export default useSignin;

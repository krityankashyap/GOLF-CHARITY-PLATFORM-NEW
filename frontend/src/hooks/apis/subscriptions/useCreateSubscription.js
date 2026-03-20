import { useState } from 'react';
import { toast } from 'sonner';
import subscriptionsApi from '@/apis/subscriptions/index.js';

const useCreateSubscription = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createCheckout = async (plan) => {
    try {
      setLoading(true);
      setError(null);
      const res = await subscriptionsApi.createCheckout(plan);
      const { url } = res.data.data;
      if (url) {
        window.location.href = url;
      }
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to create checkout';
      setError(message);
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  return { createCheckout, loading, error };
};

export default useCreateSubscription;

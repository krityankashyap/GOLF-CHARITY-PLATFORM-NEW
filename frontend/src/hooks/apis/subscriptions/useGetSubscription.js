import { useState, useEffect } from 'react';
import subscriptionsApi from '@/apis/subscriptions/index.js';

const useGetSubscription = () => {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetch = async () => {
    try {
      setLoading(true);
      const res = await subscriptionsApi.getMySubscription();
      setSubscription(res.data.data);
    } catch (err) {
      if (err.response?.status !== 404) {
        setError(err.response?.data?.message || 'Failed to load subscription');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  return { subscription, loading, error, refetch: fetch };
};

export default useGetSubscription;

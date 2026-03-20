import React, { createContext, useState, useCallback } from 'react';
import subscriptionsApi from '@/apis/subscriptions/index.js';

export const SubscriptionContext = createContext(null);

export function SubscriptionContextProvider({ children }) {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSubscription = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await subscriptionsApi.getMySubscription();
      setSubscription(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load subscription');
      setSubscription(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const isActive = subscription?.status === 'active';

  const value = {
    subscription,
    setSubscription,
    loading,
    error,
    isActive,
    fetchSubscription,
  };

  return <SubscriptionContext.Provider value={value}>{children}</SubscriptionContext.Provider>;
}

import { useContext } from 'react';
import { SubscriptionContext } from '@/context/SubscriptionContext.jsx';

const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionContextProvider');
  }
  return context;
};

export default useSubscription;

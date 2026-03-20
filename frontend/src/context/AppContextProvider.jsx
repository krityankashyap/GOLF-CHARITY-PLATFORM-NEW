import React from 'react';
import CombineContext from '@/utils/CombineContext.jsx';
import { AuthContextProvider } from './AuthContext.jsx';
import { SubscriptionContextProvider } from './SubscriptionContext.jsx';
import { DrawContextProvider } from './DrawContext.jsx';
import { CharityContextProvider } from './CharityContext.jsx';

function AppContextProvider({ children }) {
  const providers = [
    AuthContextProvider,
    SubscriptionContextProvider,
    DrawContextProvider,
    CharityContextProvider,
  ];

  return <CombineContext providers={providers}>{children}</CombineContext>;
}

export default AppContextProvider;

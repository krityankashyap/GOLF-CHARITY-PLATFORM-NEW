import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';
import AppContextProvider from '@/context/AppContextProvider.jsx';
import AppRouter from '@/Router.jsx';

function App() {
  return (
    <BrowserRouter>
      <AppContextProvider>
        <AppRouter />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1a3a2a',
              border: '1px solid #2d6647',
              color: '#fff',
            },
          }}
        />
      </AppContextProvider>
    </BrowserRouter>
  );
}

export default App;

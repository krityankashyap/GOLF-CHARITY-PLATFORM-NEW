import { useContext } from 'react';
import { DrawContext } from '@/context/DrawContext.jsx';

const useCurrentDraw = () => {
  const context = useContext(DrawContext);
  if (!context) {
    throw new Error('useCurrentDraw must be used within a DrawContextProvider');
  }
  return context;
};

export default useCurrentDraw;

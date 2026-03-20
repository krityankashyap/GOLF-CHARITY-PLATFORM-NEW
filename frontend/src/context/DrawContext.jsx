import React, { createContext, useState, useCallback } from 'react';
import drawsApi from '@/apis/draws/index.js';

export const DrawContext = createContext(null);

export function DrawContextProvider({ children }) {
  const [currentDraw, setCurrentDraw] = useState(null);
  const [draws, setDraws] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCurrentDraw = useCallback(async () => {
    try {
      setLoading(true);
      const res = await drawsApi.getCurrentDraw();
      setCurrentDraw(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load draw');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDraws = useCallback(async () => {
    try {
      setLoading(true);
      const res = await drawsApi.getDraws();
      setDraws(res.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load draws');
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    currentDraw,
    draws,
    loading,
    error,
    fetchCurrentDraw,
    fetchDraws,
  };

  return <DrawContext.Provider value={value}>{children}</DrawContext.Provider>;
}

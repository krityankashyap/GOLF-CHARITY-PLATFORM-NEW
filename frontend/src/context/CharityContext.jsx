import React, { createContext, useState, useCallback } from 'react';
import charitiesApi from '@/apis/charities/index.js';

export const CharityContext = createContext(null);

export function CharityContextProvider({ children }) {
  const [charities, setCharities] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCharities = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      const res = await charitiesApi.getCharities(params);
      setCharities(res.data.data?.charities || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load charities');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchFeatured = useCallback(async () => {
    try {
      const res = await charitiesApi.getFeatured();
      setFeatured(res.data.data || []);
    } catch {
      // Silent fail for featured
    }
  }, []);

  const value = {
    charities,
    featured,
    loading,
    error,
    fetchCharities,
    fetchFeatured,
  };

  return <CharityContext.Provider value={value}>{children}</CharityContext.Provider>;
}

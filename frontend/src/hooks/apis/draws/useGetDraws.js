import { useState, useEffect } from 'react';
import drawsApi from '@/apis/draws/index.js';

const useGetDraws = () => {
  const [draws, setDraws] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await drawsApi.getDraws();
        setDraws(res.data.data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load draws');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return { draws, loading, error };
};

export default useGetDraws;

import { useState, useEffect } from 'react';
import drawsApi from '@/apis/draws/index.js';

const useGetCurrentDraw = () => {
  const [draw, setDraw] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await drawsApi.getCurrentDraw();
        setDraw(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load current draw');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return { draw, loading, error };
};

export default useGetCurrentDraw;

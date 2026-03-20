import { useState, useEffect } from 'react';
import winnersApi from '@/apis/winners/index.js';

const useGetWinners = () => {
  const [winners, setWinners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await winnersApi.getPublicWinners();
        setWinners(res.data.data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load winners');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return { winners, loading, error };
};

export default useGetWinners;

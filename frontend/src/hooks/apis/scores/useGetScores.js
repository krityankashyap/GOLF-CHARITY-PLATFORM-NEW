import { useState, useEffect } from 'react';
import scoresApi from '@/apis/scores/index.js';

const useGetScores = () => {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchScores = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await scoresApi.getScores();
      setScores(res.data.data?.scores || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load scores');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScores();
  }, []);

  return { scores, loading, error, refetch: fetchScores };
};

export default useGetScores;

import { useState } from 'react';
import { toast } from 'sonner';
import scoresApi from '@/apis/scores/index.js';

const useAddScore = (onSuccess) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addScore = async (data) => {
    try {
      setLoading(true);
      setError(null);
      const res = await scoresApi.addScore(data);
      toast.success('Score added successfully!');
      if (onSuccess) onSuccess(res.data.data?.scores || []);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to add score';
      setError(message);
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  return { addScore, loading, error };
};

export default useAddScore;

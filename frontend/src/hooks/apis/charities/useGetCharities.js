import { useState, useEffect } from 'react';
import charitiesApi from '@/apis/charities/index.js';

const useGetCharities = (params = {}) => {
  const [charities, setCharities] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await charitiesApi.getCharities(params);
        const data = res.data.data;
        setCharities(data?.charities || []);
        setTotal(data?.total || 0);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load charities');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [JSON.stringify(params)]);

  return { charities, total, loading, error };
};

export default useGetCharities;

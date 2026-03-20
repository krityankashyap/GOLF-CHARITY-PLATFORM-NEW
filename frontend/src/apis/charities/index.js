import apiClient from '@/config/axiosConfig.js';

const charitiesApi = {
  getCharities: (params) => apiClient.get('/charities', { params }),
  getFeatured: () => apiClient.get('/charities/featured'),
  getById: (charityId) => apiClient.get(`/charities/${charityId}`),
  donate: (charityId, amount) => apiClient.post('/charities/donate', { charityId, amount }),
};

export default charitiesApi;

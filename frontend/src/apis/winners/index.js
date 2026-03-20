import apiClient from '@/config/axiosConfig.js';

const winnersApi = {
  getPublicWinners: () => apiClient.get('/winners'),
  getMyWins: () => apiClient.get('/winners/my-wins'),
  uploadProof: (winnerId, formData) =>
    apiClient.post(`/winners/${winnerId}/upload-proof`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

export default winnersApi;

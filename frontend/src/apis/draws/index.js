import apiClient from '@/config/axiosConfig.js';

const drawsApi = {
  getDraws: () => apiClient.get('/draws'),
  getCurrentDraw: () => apiClient.get('/draws/current'),
  getDrawById: (drawId) => apiClient.get(`/draws/${drawId}`),
  getMyResult: (drawId) => apiClient.get(`/draws/${drawId}/my-result`),
};

export default drawsApi;

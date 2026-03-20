import apiClient from '@/config/axiosConfig.js';

const scoresApi = {
  getScores: () => apiClient.get('/scores'),
  addScore: (data) => apiClient.post('/scores', data),
  deleteScore: (scoreIndex) => apiClient.delete(`/scores/${scoreIndex}`),
};

export default scoresApi;

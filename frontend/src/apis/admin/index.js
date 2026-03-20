import apiClient from '@/config/axiosConfig.js';

const adminApi = {
  // Users
  getUsers: (params) => apiClient.get('/admin/users', { params }),
  getUserById: (userId) => apiClient.get(`/admin/users/${userId}`),
  updateUser: (userId, data) => apiClient.put(`/admin/users/${userId}`, data),
  updateUserScores: (userId, scores) =>
    apiClient.put(`/admin/users/${userId}/scores`, { scores }),
  updateUserSubscription: (userId, data) =>
    apiClient.put(`/admin/users/${userId}/subscription`, data),

  // Draws
  configureDraw: (data) => apiClient.post('/admin/draws/configure', data),
  simulateDraw: (drawId) => apiClient.post(`/admin/draws/${drawId}/simulate`),
  publishDraw: (drawId) => apiClient.post(`/admin/draws/${drawId}/publish`),
  getAllDraws: (params) => apiClient.get('/admin/draws', { params }),

  // Charities
  createCharity: (data) => apiClient.post('/admin/charities', data),
  updateCharity: (charityId, data) => apiClient.put(`/admin/charities/${charityId}`, data),
  deleteCharity: (charityId) => apiClient.delete(`/admin/charities/${charityId}`),
  toggleFeatured: (charityId) => apiClient.put(`/admin/charities/${charityId}/feature`),

  // Winners
  getAllWinners: (params) => apiClient.get('/admin/winners', { params }),
  verifyWinner: (winnerId, data) => apiClient.put(`/admin/winners/${winnerId}/verify`, data),
  markPaid: (winnerId) => apiClient.put(`/admin/winners/${winnerId}/pay`),

  // Analytics
  getAnalytics: () => apiClient.get('/admin/analytics'),
};

export default adminApi;

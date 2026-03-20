import apiClient from '@/config/axiosConfig.js';

const authApi = {
  signup: (data) => apiClient.post('/auth/signup', data),
  signin: (data) => apiClient.post('/auth/signin', data),
  signout: () => apiClient.post('/auth/signout'),
  getMe: () => apiClient.get('/auth/me'),
  updateMe: (data) => apiClient.put('/auth/me', data),
  forgotPassword: (email) => apiClient.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => apiClient.post('/auth/reset-password', { token, password }),
  verifyEmail: (token) => apiClient.get(`/auth/verify-email?token=${token}`),
};

export default authApi;

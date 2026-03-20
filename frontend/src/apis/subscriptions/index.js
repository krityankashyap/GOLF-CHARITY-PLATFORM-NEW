import apiClient from '@/config/axiosConfig.js';

const subscriptionsApi = {
  createCheckout: (plan) => apiClient.post('/subscriptions/create-checkout', { plan }),
  getMySubscription: () => apiClient.get('/subscriptions/my-subscription'),
  cancel: () => apiClient.post('/subscriptions/cancel'),
  updateCharity: (charityId) => apiClient.put('/subscriptions/charity', { charityId }),
  updateCharityPercent: (percent) =>
    apiClient.put('/subscriptions/charity-percent', { percent }),
};

export default subscriptionsApi;

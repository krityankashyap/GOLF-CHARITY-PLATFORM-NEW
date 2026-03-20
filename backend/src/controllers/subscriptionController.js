import subscriptionService from '../service/subscriptionService.js';
import { successResponse, errorResponse } from '../utils/common/responseObject.js';

const subscriptionController = {
  async createCheckout(req, res) {
    try {
      const { plan } = req.body;
      if (!['monthly', 'yearly'].includes(plan)) {
        return res.status(400).json(errorResponse('Plan must be monthly or yearly', null, 400));
      }
      const result = await subscriptionService.createCheckoutSession(req.user._id, plan);
      return res.status(200).json(successResponse('Checkout session created', result, 200));
    } catch (error) {
      return res
        .status(error.statusCode || 500)
        .json(errorResponse(error.message, null, error.statusCode || 500));
    }
  },

  async webhook(req, res) {
    try {
      const signature = req.headers['stripe-signature'];
      const result = await subscriptionService.handleWebhook(req.body, signature);
      return res.status(200).json(result);
    } catch (error) {
      return res
        .status(error.statusCode || 400)
        .json(errorResponse(error.message, null, error.statusCode || 400));
    }
  },

  async getMySubscription(req, res) {
    try {
      const sub = await subscriptionService.getMySubscription(req.user._id);
      return res.status(200).json(successResponse('Subscription retrieved', sub, 200));
    } catch (error) {
      return res
        .status(error.statusCode || 500)
        .json(errorResponse(error.message, null, error.statusCode || 500));
    }
  },

  async cancel(req, res) {
    try {
      const result = await subscriptionService.cancelSubscription(req.user._id);
      return res.status(200).json(successResponse('Subscription cancelled', result, 200));
    } catch (error) {
      return res
        .status(error.statusCode || 500)
        .json(errorResponse(error.message, null, error.statusCode || 500));
    }
  },

  async updateCharity(req, res) {
    try {
      const { charityId } = req.body;
      const user = await subscriptionService.updateCharity(req.user._id, charityId);
      return res.status(200).json(successResponse('Charity updated', user, 200));
    } catch (error) {
      return res
        .status(error.statusCode || 500)
        .json(errorResponse(error.message, null, error.statusCode || 500));
    }
  },

  async updateCharityPercent(req, res) {
    try {
      const { percent } = req.body;
      const user = await subscriptionService.updateCharityPercent(req.user._id, percent);
      return res.status(200).json(successResponse('Charity contribution updated', user, 200));
    } catch (error) {
      return res
        .status(error.statusCode || 500)
        .json(errorResponse(error.message, null, error.statusCode || 500));
    }
  },
};

export default subscriptionController;

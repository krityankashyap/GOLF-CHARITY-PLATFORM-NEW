import charityService from '../service/charityService.js';
import { successResponse, errorResponse } from '../utils/common/responseObject.js';

const charityController = {
  async getAllCharities(req, res) {
    try {
      const { search = '', page = 1, limit = 20 } = req.query;
      const result = await charityService.getAllCharities(search, parseInt(page), parseInt(limit));
      return res.status(200).json(successResponse('Charities retrieved', result, 200));
    } catch (error) {
      return res
        .status(error.statusCode || 500)
        .json(errorResponse(error.message, null, error.statusCode || 500));
    }
  },

  async getFeaturedCharities(_req, res) {
    try {
      const charities = await charityService.getFeaturedCharities();
      return res.status(200).json(successResponse('Featured charities retrieved', charities, 200));
    } catch (error) {
      return res
        .status(error.statusCode || 500)
        .json(errorResponse(error.message, null, error.statusCode || 500));
    }
  },

  async getCharityById(req, res) {
    try {
      const charity = await charityService.getCharityById(req.params.charityId);
      return res.status(200).json(successResponse('Charity retrieved', charity, 200));
    } catch (error) {
      return res
        .status(error.statusCode || 500)
        .json(errorResponse(error.message, null, error.statusCode || 500));
    }
  },

  async donate(req, res) {
    try {
      const { charityId, amount } = req.body;
      const result = await charityService.recordDonation(charityId, amount);
      return res.status(200).json(successResponse('Donation recorded', result, 200));
    } catch (error) {
      return res
        .status(error.statusCode || 500)
        .json(errorResponse(error.message, null, error.statusCode || 500));
    }
  },
};

export default charityController;

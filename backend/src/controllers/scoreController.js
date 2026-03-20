import scoreService from '../service/scoreService.js';
import { successResponse, errorResponse } from '../utils/common/responseObject.js';

const scoreController = {
  async getScores(req, res) {
    try {
      const result = await scoreService.getScores(req.user._id);
      return res.status(200).json(successResponse('Scores retrieved', result, 200));
    } catch (error) {
      return res
        .status(error.statusCode || 500)
        .json(errorResponse(error.message, null, error.statusCode || 500));
    }
  },

  async addScore(req, res) {
    try {
      const { value, date } = req.body;
      const result = await scoreService.addScore(req.user._id, value, date);
      return res.status(201).json(successResponse('Score added successfully', result, 201));
    } catch (error) {
      return res
        .status(error.statusCode || 500)
        .json(errorResponse(error.message, null, error.statusCode || 500));
    }
  },

  async deleteScore(req, res) {
    try {
      const scoreIndex = parseInt(req.params.scoreIndex, 10);
      const result = await scoreService.deleteScore(req.user._id, scoreIndex);
      return res.status(200).json(successResponse('Score deleted', result, 200));
    } catch (error) {
      return res
        .status(error.statusCode || 500)
        .json(errorResponse(error.message, null, error.statusCode || 500));
    }
  },
};

export default scoreController;

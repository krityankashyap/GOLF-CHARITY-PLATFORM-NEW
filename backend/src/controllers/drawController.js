import drawService from '../service/drawService.js';
import { successResponse, errorResponse } from '../utils/common/responseObject.js';

const drawController = {
  async getAllDraws(_req, res) {
    try {
      const draws = await drawService.getAllPublishedDraws();
      return res.status(200).json(successResponse('Draws retrieved', draws, 200));
    } catch (error) {
      return res
        .status(error.statusCode || 500)
        .json(errorResponse(error.message, null, error.statusCode || 500));
    }
  },

  async getCurrentDraw(_req, res) {
    try {
      const draw = await drawService.getCurrentDraw();
      return res.status(200).json(successResponse('Current draw retrieved', draw, 200));
    } catch (error) {
      return res
        .status(error.statusCode || 500)
        .json(errorResponse(error.message, null, error.statusCode || 500));
    }
  },

  async getDrawById(req, res) {
    try {
      const draw = await drawService.getDrawById(req.params.drawId);
      return res.status(200).json(successResponse('Draw retrieved', draw, 200));
    } catch (error) {
      return res
        .status(error.statusCode || 500)
        .json(errorResponse(error.message, null, error.statusCode || 500));
    }
  },

  async getMyResult(req, res) {
    try {
      const result = await drawService.getMyResult(req.params.drawId, req.user._id);
      return res.status(200).json(successResponse('Your draw result', result, 200));
    } catch (error) {
      return res
        .status(error.statusCode || 500)
        .json(errorResponse(error.message, null, error.statusCode || 500));
    }
  },
};

export default drawController;

import winnerService from '../service/winnerService.js';
import { successResponse, errorResponse } from '../utils/common/responseObject.js';

const winnerController = {
  async getMyWins(req, res) {
    try {
      const wins = await winnerService.getMyWins(req.user._id);
      return res.status(200).json(successResponse('Your wins retrieved', wins, 200));
    } catch (error) {
      return res
        .status(error.statusCode || 500)
        .json(errorResponse(error.message, null, error.statusCode || 500));
    }
  },

  async uploadProof(req, res) {
    try {
      const proofUrl = req.file ? req.file.location : null;
      if (!proofUrl) {
        return res.status(400).json(errorResponse('No file uploaded', null, 400));
      }
      const winner = await winnerService.uploadProof(
        req.params.winnerId,
        req.user._id,
        proofUrl
      );
      return res.status(200).json(successResponse('Proof uploaded successfully', winner, 200));
    } catch (error) {
      return res
        .status(error.statusCode || 500)
        .json(errorResponse(error.message, null, error.statusCode || 500));
    }
  },

  async getPublicWinners(_req, res) {
    try {
      const winners = await winnerService.getPublicWinners();
      return res.status(200).json(successResponse('Winners retrieved', winners, 200));
    } catch (error) {
      return res
        .status(error.statusCode || 500)
        .json(errorResponse(error.message, null, error.statusCode || 500));
    }
  },
};

export default winnerController;

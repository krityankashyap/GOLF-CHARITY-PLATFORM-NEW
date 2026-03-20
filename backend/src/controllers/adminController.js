import userRepository from '../repositories/userRepository.js';
import subscriptionRepository from '../repositories/subscriptionRepository.js';
import scoreService from '../service/scoreService.js';
import drawService from '../service/drawService.js';
import charityService from '../service/charityService.js';
import winnerService from '../service/winnerService.js';
import { successResponse, errorResponse } from '../utils/common/responseObject.js';

const adminController = {
  // Users
  async getUsers(req, res) {
    try {
      const { page = 1, limit = 20, search = '' } = req.query;
      const result = await userRepository.findAllPaginated(
        parseInt(page),
        parseInt(limit),
        search
      );
      return res.status(200).json(successResponse('Users retrieved', result, 200));
    } catch (error) {
      return res
        .status(error.statusCode || 500)
        .json(errorResponse(error.message, null, error.statusCode || 500));
    }
  },

  async getUserById(req, res) {
    try {
      const user = await userRepository.findById(req.params.userId, {
        populate: [
          { path: 'selectedCharity', select: 'name' },
          { path: 'subscriptionId', select: 'status plan nextRenewalDate amount' },
        ],
      });
      return res.status(200).json(successResponse('User retrieved', user, 200));
    } catch (error) {
      return res
        .status(error.statusCode || 500)
        .json(errorResponse(error.message, null, error.statusCode || 500));
    }
  },

  async updateUser(req, res) {
    try {
      const allowed = ['name', 'email', 'role', 'isVerified', 'selectedCharity', 'charityContributionPercent'];
      const update = {};
      for (const key of allowed) {
        if (req.body[key] !== undefined) update[key] = req.body[key];
      }
      const user = await userRepository.update(req.params.userId, update);
      return res.status(200).json(successResponse('User updated', user, 200));
    } catch (error) {
      return res
        .status(error.statusCode || 500)
        .json(errorResponse(error.message, null, error.statusCode || 500));
    }
  },

  async updateUserScores(req, res) {
    try {
      const result = await scoreService.adminUpdateScores(req.params.userId, req.body.scores);
      return res.status(200).json(successResponse('Scores updated', result, 200));
    } catch (error) {
      return res
        .status(error.statusCode || 500)
        .json(errorResponse(error.message, null, error.statusCode || 500));
    }
  },

  async updateUserSubscription(req, res) {
    try {
      const sub = await subscriptionRepository.findByUserId(req.params.userId);
      if (!sub) {
        return res.status(404).json(errorResponse('No subscription found for this user', null, 404));
      }
      const allowed = ['status', 'plan', 'nextRenewalDate'];
      const update = {};
      for (const key of allowed) {
        if (req.body[key] !== undefined) update[key] = req.body[key];
      }
      const updated = await subscriptionRepository.update(sub._id, update);
      return res.status(200).json(successResponse('Subscription updated', updated, 200));
    } catch (error) {
      return res
        .status(error.statusCode || 500)
        .json(errorResponse(error.message, null, error.statusCode || 500));
    }
  },

  // Draws
  async configureDraw(req, res) {
    try {
      const { month, year, drawType } = req.body;
      const draw = await drawService.configureDraw(month, year, drawType);
      return res.status(201).json(successResponse('Draw configured', draw, 201));
    } catch (error) {
      return res
        .status(error.statusCode || 500)
        .json(errorResponse(error.message, null, error.statusCode || 500));
    }
  },

  async simulateDraw(req, res) {
    try {
      const draw = await drawService.simulateDraw(req.params.drawId);
      return res.status(200).json(successResponse('Draw simulated', draw, 200));
    } catch (error) {
      return res
        .status(error.statusCode || 500)
        .json(errorResponse(error.message, null, error.statusCode || 500));
    }
  },

  async publishDraw(req, res) {
    try {
      const result = await drawService.publishDraw(req.params.drawId);
      return res.status(200).json(successResponse('Draw published successfully', result, 200));
    } catch (error) {
      return res
        .status(error.statusCode || 500)
        .json(errorResponse(error.message, null, error.statusCode || 500));
    }
  },

  async getAllDraws(req, res) {
    try {
      const { page = 1, limit = 20 } = req.query;
      const result = await drawService.adminGetAllDraws(parseInt(page), parseInt(limit));
      return res.status(200).json(successResponse('Draws retrieved', result, 200));
    } catch (error) {
      return res
        .status(error.statusCode || 500)
        .json(errorResponse(error.message, null, error.statusCode || 500));
    }
  },

  // Charities
  async createCharity(req, res) {
    try {
      const charity = await charityService.createCharity(req.body);
      return res.status(201).json(successResponse('Charity created', charity, 201));
    } catch (error) {
      return res
        .status(error.statusCode || 500)
        .json(errorResponse(error.message, null, error.statusCode || 500));
    }
  },

  async updateCharity(req, res) {
    try {
      const charity = await charityService.updateCharity(req.params.charityId, req.body);
      return res.status(200).json(successResponse('Charity updated', charity, 200));
    } catch (error) {
      return res
        .status(error.statusCode || 500)
        .json(errorResponse(error.message, null, error.statusCode || 500));
    }
  },

  async deleteCharity(req, res) {
    try {
      await charityService.deleteCharity(req.params.charityId);
      return res.status(200).json(successResponse('Charity deleted', null, 200));
    } catch (error) {
      return res
        .status(error.statusCode || 500)
        .json(errorResponse(error.message, null, error.statusCode || 500));
    }
  },

  async toggleFeaturedCharity(req, res) {
    try {
      const charity = await charityService.toggleFeatured(req.params.charityId);
      return res.status(200).json(successResponse('Charity feature status toggled', charity, 200));
    } catch (error) {
      return res
        .status(error.statusCode || 500)
        .json(errorResponse(error.message, null, error.statusCode || 500));
    }
  },

  // Winners
  async getAllWinners(req, res) {
    try {
      const { page = 1, limit = 20, verificationStatus, paymentStatus } = req.query;
      const filter = {};
      if (verificationStatus) filter.verificationStatus = verificationStatus;
      if (paymentStatus) filter.paymentStatus = paymentStatus;
      const result = await winnerService.getAllWinners(parseInt(page), parseInt(limit), filter);
      return res.status(200).json(successResponse('Winners retrieved', result, 200));
    } catch (error) {
      return res
        .status(error.statusCode || 500)
        .json(errorResponse(error.message, null, error.statusCode || 500));
    }
  },

  async verifyWinner(req, res) {
    try {
      const { status, adminNote } = req.body;
      const winner = await winnerService.verifyWinner(req.params.winnerId, status, adminNote);
      return res.status(200).json(successResponse('Winner verification updated', winner, 200));
    } catch (error) {
      return res
        .status(error.statusCode || 500)
        .json(errorResponse(error.message, null, error.statusCode || 500));
    }
  },

  async markWinnerPaid(req, res) {
    try {
      const winner = await winnerService.markAsPaid(req.params.winnerId);
      return res.status(200).json(successResponse('Winner marked as paid', winner, 200));
    } catch (error) {
      return res
        .status(error.statusCode || 500)
        .json(errorResponse(error.message, null, error.statusCode || 500));
    }
  },

  // Analytics
  async getAnalytics(_req, res) {
    try {
      const [totalUsers, activeSubscriptions] = await Promise.all([
        userRepository.count({}),
        subscriptionRepository.countActive(),
      ]);

      return res.status(200).json(
        successResponse(
          'Analytics retrieved',
          {
            totalUsers,
            activeSubscriptions,
            monthlyRevenue: activeSubscriptions * 1000,
            yearlyRevenue: activeSubscriptions * 12000,
          },
          200
        )
      );
    } catch (error) {
      return res
        .status(error.statusCode || 500)
        .json(errorResponse(error.message, null, error.statusCode || 500));
    }
  },
};

export default adminController;

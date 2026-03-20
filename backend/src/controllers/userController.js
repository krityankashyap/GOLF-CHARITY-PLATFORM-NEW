import userService from '../service/userService.js';
import { successResponse, errorResponse } from '../utils/common/responseObject.js';

const userController = {
  async signup(req, res) {
    try {
      const result = await userService.signup(req.body);
      return res.status(201).json(successResponse('Account created successfully', result, 201));
    } catch (error) {
      return res
        .status(error.statusCode || 500)
        .json(errorResponse(error.message, error.explanation || null, error.statusCode || 500));
    }
  },

  async signin(req, res) {
    try {
      const { email, password } = req.body;
      const result = await userService.signin(email, password);
      return res.status(200).json(successResponse('Signed in successfully', result, 200));
    } catch (error) {
      return res
        .status(error.statusCode || 500)
        .json(errorResponse(error.message, null, error.statusCode || 500));
    }
  },

  async signout(_req, res) {
    return res.status(200).json(successResponse('Signed out successfully', null, 200));
  },

  async getMe(req, res) {
    try {
      const user = await userService.getMe(req.user._id);
      return res.status(200).json(successResponse('User profile retrieved', user, 200));
    } catch (error) {
      return res
        .status(error.statusCode || 500)
        .json(errorResponse(error.message, null, error.statusCode || 500));
    }
  },

  async updateMe(req, res) {
    try {
      const user = await userService.updateProfile(req.user._id, req.body);
      return res.status(200).json(successResponse('Profile updated successfully', user, 200));
    } catch (error) {
      return res
        .status(error.statusCode || 500)
        .json(errorResponse(error.message, null, error.statusCode || 500));
    }
  },

  async forgotPassword(req, res) {
    try {
      await userService.forgotPassword(req.body.email);
      return res
        .status(200)
        .json(successResponse('If that email exists, a reset link has been sent', null, 200));
    } catch (error) {
      return res
        .status(error.statusCode || 500)
        .json(errorResponse(error.message, null, error.statusCode || 500));
    }
  },

  async resetPassword(req, res) {
    try {
      const result = await userService.resetPassword(req.body.token, req.body.password);
      return res.status(200).json(successResponse(result.message, null, 200));
    } catch (error) {
      return res
        .status(error.statusCode || 500)
        .json(errorResponse(error.message, null, error.statusCode || 500));
    }
  },

  async verifyEmail(req, res) {
    try {
      const result = await userService.verifyEmail(req.query.token);
      return res.status(200).json(successResponse(result.message, null, 200));
    } catch (error) {
      return res
        .status(error.statusCode || 500)
        .json(errorResponse(error.message, null, error.statusCode || 500));
    }
  },
};

export default userController;

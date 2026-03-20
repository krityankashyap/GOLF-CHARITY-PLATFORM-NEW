import { verifyToken } from '../utils/common/authUtils.js';
import userRepository from '../repositories/userRepository.js';
import { errorResponse } from '../utils/common/responseObject.js';

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json(errorResponse('Authentication required', null, 401));
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    const user = await userRepository.findById(decoded.id, {
      populate: { path: 'subscriptionId', select: 'status plan nextRenewalDate' },
    });

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json(errorResponse('Invalid or expired token', null, 401));
  }
};

export default authMiddleware;

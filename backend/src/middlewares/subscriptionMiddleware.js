import subscriptionRepository from '../repositories/subscriptionRepository.js';
import { errorResponse } from '../utils/common/responseObject.js';

const subscriptionMiddleware = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user.subscriptionId) {
      return res.status(403).json(errorResponse('Active subscription required to access this resource', null, 403));
    }

    const sub = await subscriptionRepository.findByUserId(user._id);
    if (!sub || sub.status !== 'active') {
      return res.status(403).json(errorResponse('Your subscription is not active. Please subscribe to continue.', null, 403));
    }

    req.subscription = sub;
    next();
  } catch (error) {
    return res.status(500).json(errorResponse('Failed to verify subscription', null, 500));
  }
};

export default subscriptionMiddleware;

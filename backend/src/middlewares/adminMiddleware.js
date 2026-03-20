import { errorResponse } from '../utils/common/responseObject.js';

const adminMiddleware = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json(errorResponse('Admin access required', null, 403));
  }
  next();
};

export default adminMiddleware;

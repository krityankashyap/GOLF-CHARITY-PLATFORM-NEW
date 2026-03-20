import jwt from 'jsonwebtoken';
import serverConfig from '../../config/serverConfig.js';

const generateToken = (payload) => {
  return jwt.sign(payload, serverConfig.JWT_SECRET, { expiresIn: serverConfig.JWT_EXPIRY });
};

const verifyToken = (token) => {
  return jwt.verify(token, serverConfig.JWT_SECRET);
};

export { generateToken, verifyToken };

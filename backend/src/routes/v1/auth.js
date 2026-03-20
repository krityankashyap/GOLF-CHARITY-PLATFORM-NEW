import { Router } from 'express';
import userController from '../../controllers/userController.js';
import authMiddleware from '../../middlewares/authMiddleware.js';
import validate from '../../validators/zodValidators.js';
import {
  signupSchema,
  signinSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../../validators/userSchema.js';

const router = Router();

router.post('/signup', validate(signupSchema), userController.signup);
router.post('/signin', validate(signinSchema), userController.signin);
router.post('/signout', userController.signout);
router.get('/me', authMiddleware, userController.getMe);
router.put('/me', authMiddleware, userController.updateMe);
router.post('/forgot-password', validate(forgotPasswordSchema), userController.forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema), userController.resetPassword);
router.get('/verify-email', userController.verifyEmail);

export default router;

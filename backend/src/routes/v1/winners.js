import { Router } from 'express';
import winnerController from '../../controllers/winnerController.js';
import authMiddleware from '../../middlewares/authMiddleware.js';
import subscriptionMiddleware from '../../middlewares/subscriptionMiddleware.js';
import { proofUpload } from '../../config/awsConfig.js';

const router = Router();

router.get('/', winnerController.getPublicWinners);
router.get('/my-wins', authMiddleware, subscriptionMiddleware, winnerController.getMyWins);
router.post(
  '/:winnerId/upload-proof',
  authMiddleware,
  subscriptionMiddleware,
  proofUpload.single('proof'),
  winnerController.uploadProof
);

export default router;

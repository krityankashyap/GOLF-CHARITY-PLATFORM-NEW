import { Router } from 'express';
import drawController from '../../controllers/drawController.js';
import authMiddleware from '../../middlewares/authMiddleware.js';
import subscriptionMiddleware from '../../middlewares/subscriptionMiddleware.js';

const router = Router();

router.get('/', authMiddleware, drawController.getAllDraws);
router.get('/current', authMiddleware, drawController.getCurrentDraw);
router.get('/:drawId', authMiddleware, drawController.getDrawById);
router.get('/:drawId/my-result', authMiddleware, subscriptionMiddleware, drawController.getMyResult);

export default router;

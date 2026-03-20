import { Router } from 'express';
import charityController from '../../controllers/charityController.js';
import authMiddleware from '../../middlewares/authMiddleware.js';

const router = Router();

router.get('/', charityController.getAllCharities);
router.get('/featured', charityController.getFeaturedCharities);
router.get('/:charityId', charityController.getCharityById);
router.post('/donate', authMiddleware, charityController.donate);

export default router;

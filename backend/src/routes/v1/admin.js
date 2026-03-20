import { Router } from 'express';
import adminController from '../../controllers/adminController.js';
import authMiddleware from '../../middlewares/authMiddleware.js';
import adminMiddleware from '../../middlewares/adminMiddleware.js';
import validate from '../../validators/zodValidators.js';
import { configureDrawSchema, verifyWinnerSchema } from '../../validators/drawSchema.js';

const router = Router();

router.use(authMiddleware, adminMiddleware);

// Users
router.get('/users', adminController.getUsers);
router.get('/users/:userId', adminController.getUserById);
router.put('/users/:userId', adminController.updateUser);
router.put('/users/:userId/scores', adminController.updateUserScores);
router.put('/users/:userId/subscription', adminController.updateUserSubscription);

// Draws
router.post('/draws/configure', validate(configureDrawSchema), adminController.configureDraw);
router.post('/draws/:drawId/simulate', adminController.simulateDraw);
router.post('/draws/:drawId/publish', adminController.publishDraw);
router.get('/draws', adminController.getAllDraws);
router.get('/draws/:drawId', adminController.configureDraw);

// Charities
router.post('/charities', adminController.createCharity);
router.put('/charities/:charityId', adminController.updateCharity);
router.delete('/charities/:charityId', adminController.deleteCharity);
router.put('/charities/:charityId/feature', adminController.toggleFeaturedCharity);

// Winners
router.get('/winners', adminController.getAllWinners);
router.put('/winners/:winnerId/verify', validate(verifyWinnerSchema), adminController.verifyWinner);
router.put('/winners/:winnerId/pay', adminController.markWinnerPaid);

// Analytics
router.get('/analytics', adminController.getAnalytics);

export default router;

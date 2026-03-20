import { Router } from 'express';
import subscriptionController from '../../controllers/subscriptionController.js';
import authMiddleware from '../../middlewares/authMiddleware.js';
import express from 'express';

const router = Router();

// Stripe webhook requires raw body - must be before any json parsing middleware
router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  subscriptionController.webhook
);

router.use(authMiddleware);

router.post('/create-checkout', subscriptionController.createCheckout);
router.get('/my-subscription', subscriptionController.getMySubscription);
router.post('/cancel', subscriptionController.cancel);
router.put('/charity', subscriptionController.updateCharity);
router.put('/charity-percent', subscriptionController.updateCharityPercent);

export default router;

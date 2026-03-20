import { Router } from 'express';
import scoreController from '../../controllers/scoreController.js';
import authMiddleware from '../../middlewares/authMiddleware.js';
import subscriptionMiddleware from '../../middlewares/subscriptionMiddleware.js';
import validate from '../../validators/zodValidators.js';
import { addScoreSchema } from '../../validators/scoreSchema.js';

const router = Router();

router.use(authMiddleware, subscriptionMiddleware);

router.get('/', scoreController.getScores);
router.post('/', validate(addScoreSchema), scoreController.addScore);
router.delete('/:scoreIndex', scoreController.deleteScore);

export default router;

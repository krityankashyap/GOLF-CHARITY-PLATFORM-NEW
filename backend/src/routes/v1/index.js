import { Router } from 'express';
import authRouter from './auth.js';
import scoresRouter from './scores.js';
import drawsRouter from './draws.js';
import charitiesRouter from './charities.js';
import subscriptionsRouter from './subscriptions.js';
import winnersRouter from './winners.js';
import adminRouter from './admin.js';

const v1Router = Router();

v1Router.use('/auth', authRouter);
v1Router.use('/scores', scoresRouter);
v1Router.use('/draws', drawsRouter);
v1Router.use('/charities', charitiesRouter);
v1Router.use('/subscriptions', subscriptionsRouter);
v1Router.use('/winners', winnersRouter);
v1Router.use('/admin', adminRouter);

export default v1Router;

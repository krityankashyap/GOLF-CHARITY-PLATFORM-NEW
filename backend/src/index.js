import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import connectDB from './config/dbConfig.js';
import serverConfig from './config/serverConfig.js';
import apiRouter from './routes/index.js';
import { errorResponse } from './utils/common/responseObject.js';
import './processors/mailProcessor.js';

const app = express();

// Connect to MongoDB
connectDB();

// Security
app.use(helmet());

// CORS
const allowedOrigins = serverConfig.FRONTEND_URL
  ? serverConfig.FRONTEND_URL.split(',').map((o) => o.trim())
  : ['http://localhost:5173'];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const isAllowed =
        allowedOrigins.includes(origin) ||
        /^https:\/\/golf-charity-platform-new[a-z0-9-]*\.vercel\.app$/.test(origin);
      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: origin ${origin} not allowed`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Logging
if (serverConfig.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Body parsing (webhook route uses raw body, set in subscriptions router)
app.use((req, res, next) => {
  if (req.originalUrl === '/api/v1/subscriptions/webhook') {
    next();
  } else {
    express.json()(req, res, next);
  }
});
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api', apiRouter);

// 404 handler
app.use((_req, res) => {
  res.status(404).json(errorResponse('Route not found', null, 404));
});

// Global error handler
app.use((err, _req, res, _next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  if (err.name === 'ValidationError') {
    return res.status(422).json({
      success: false,
      message: 'Validation failed',
      errors: err.errors,
      statusCode: 422,
    });
  }

  return res.status(statusCode).json(errorResponse(message, err.explanation || null, statusCode));
});

app.listen(serverConfig.PORT, () => {
  console.log(`Golf Charity Platform API running on port ${serverConfig.PORT}`);
  console.log(`Environment: ${serverConfig.NODE_ENV}`);
});

export default app;

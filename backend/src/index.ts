import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { config } from './config';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import { rateLimiter } from './middleware/rateLimiter';
import { checkDatabaseHealth, closeDatabasePool } from './config/database';


// Routes
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import moduleRoutes from './routes/module.routes';
import assessmentRoutes from './routes/assessment.routes';
import certificationRoutes from './routes/certification.routes';
import analyticsRoutes from './routes/analytics.routes';
import providerRoutes from './routes/provider.routes';
import subscriptionRoutes from './routes/subscription.routes';
import adminRoutes from './routes/admin.routes';
import newsRoutes from './routes/news.routes';

dotenv.config();

const app: Application = express();
const PORT = config.port || 5000;

// Middleware
app.use(helmet());
app.use(cors(config.cors));
app.use(compression());
app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
app.use(rateLimiter);

// Health check
app.get('/health', async (_req: Request, res: Response) => {
  const dbHealthy = await checkDatabaseHealth();
  res.json({
    status: dbHealthy ? 'ok' : 'degraded',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.nodeEnv,
    database: dbHealthy ? 'connected' : 'disconnected'
  });
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/modules', moduleRoutes);
app.use('/api/v1/assessments', assessmentRoutes);
app.use('/api/v1/certifications', certificationRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/providers', providerRoutes);
app.use('/api/v1/subscriptions', subscriptionRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/news', newsRoutes);

// API Documentation
app.get('/api/docs', (_req: Request, res: Response) => {
  res.json({
    title: 'Nurse Delegation Network API Documentation',
    version: '1.0.0',
    description: 'Washington Nurse Delegation Network API',
    endpoints: {
      auth: '/api/v1/auth',
      users: '/api/v1/users',
      providers: '/api/v1/providers',
      subscriptions: '/api/v1/subscriptions',
      admin: '/api/v1/admin',
      news: '/api/v1/news',
      modules: '/api/v1/modules',
      assessments: '/api/v1/assessments',
      certifications: '/api/v1/certifications',
      analytics: '/api/v1/analytics'
    }
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path
  });
});

// Error handler
app.use(errorHandler);

// Start server
const server = app.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT} in ${config.nodeEnv} mode`);
  logger.info(`📚 API Documentation: http://localhost:${PORT}/api/docs`);
  logger.info(`❤️  Health check: http://localhost:${PORT}/health`);
});

// Graceful shutdown
const shutdown = async () => {
  logger.info('Received shutdown signal, closing gracefully...');

  server.close(async () => {
    await closeDatabasePool();
    logger.info('Server closed');
    process.exit(0);
  });

  // Force close after 10 seconds
  setTimeout(() => {
    logger.error('Could not close connections in time, forcing shutdown');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

export default app;

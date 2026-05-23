import { Server } from 'http';
import mongoose from 'mongoose';
import app from './app';
import config from './app/config/index';
import { logger } from './app/utils/logger';

let server: Server;

async function bootstrap() {
  try {
    await mongoose.connect(config.database_url as string);
    logger.info('Connected to MongoDB successfully.');

    server = app.listen(config.port, () => {
      logger.info(`Server running on port ${config.port}.`);
    });
  } catch (err) {
    logger.error('Critical system failure initializing server.', err);
    process.exit(1);
  }
}

// Intercept unexpected system crashes gracefully
process.on('uncaughtException', (err) => {
  logger.error('Uncaught exception triggered.', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled rejection detected.', { promise, reason });
  if (server) {
    server.close(() => process.exit(1));
  } else {
    process.exit(1);
  }
});

bootstrap();
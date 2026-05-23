import colors from 'colors';
import { Server } from 'http';
import mongoose from 'mongoose';
import app from './app.js';
import config from './app/config/index.js';

let server: Server;

async function bootstrap() {
  try {
    await mongoose.connect(config.database_url as string);
    console.log(colors.green.bold('📊 Connected to MongoDB successfully.'));

    server = app.listen(config.port, () => {
      console.log(colors.cyan.bold(`🚀 Server running dynamically on port: ${config.port}`));
    });
  } catch (err) {
    console.error(colors.red.bold('CRITICAL SYSTEM FAILURE INITIALIZING SERVER:'), err);
    process.exit(1);
  }
}

// Intercept unexpected system crashes gracefully
process.on('uncaughtException', (err) => {
  console.error(colors.bgRed.white('UNCAUGHT EXCEPTION TRIGGERED:'), err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error(colors.bgRed.yellow('UNHANDLED REJECTION AT:'), promise, 'REASON:', reason);
  if (server) {
    server.close(() => process.exit(1));
  } else {
    process.exit(1);
  }
});

bootstrap();
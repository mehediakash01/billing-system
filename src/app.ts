import cookieExtractor from 'cookie-parser';
import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import { globalErrorHandler } from './app/middlewares/globalErrorHandler.js';
import globalRouterRegistry from './app/routes/index.js';

const app: Application = express();

// Security Armor Layer Middlewares
app.use(cors());
app.use(cookieExtractor());
app.use(express.json());

// Application API Modules Mounting Points
app.use('/api/v1', globalRouterRegistry);

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ success: true, message: 'SaaS Billing Engine Core operational.' });
});

// Post-routing centralized execution handlers
app.use(globalErrorHandler);

// Catch-all route for unhandled requests
app.use((req: Request, res: Response) => {
  res.status(404).json({ success: false, message: 'Requested endpoint resources do not exist.' });
});

export default app;
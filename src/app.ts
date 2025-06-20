import express from 'express';
import { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import globalErrorHandler from './middlewares/error.middleware';
import notFound from './middlewares/errors/notFound';
import { UserRoutes } from './routes/user.route';

const app: Application = express();

// parsers
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ['http://localhost:3000'],
    credentials: true,
  }),
);
app.use(bodyParser.json());

// application route
app.use('/api/user', UserRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send({
    status: true,
    message: 'Server is running...',
  });
});

// Error handlers
app.use(globalErrorHandler);
app.use(notFound);

export default app;

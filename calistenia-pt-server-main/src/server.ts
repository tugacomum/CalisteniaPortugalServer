import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors';
import morgan from 'morgan';
import { AppError } from './errors/AppError';

import { router } from './routes';

const app = express();

app.use(morgan('tiny'));
app.use(express.json());
app.use(router);

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message
    });
  }

  return res.status(500).json({
    status: 'Error',
    message: `Internal server error ${err.message}`
  });
});

app.listen(3333, () => {
  console.log('Server started on port 3333!');
});
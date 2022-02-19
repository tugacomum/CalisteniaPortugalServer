import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export async function ensureAuth(req: Request, res: Response, next: NextFunction) {
  const authToken = req.headers.authorization;

  if (!authToken) {
    return res.status(401).json({
      error: 'Missing authorization token.'
    });
  }

  const [, token] = authToken.split(' ');

  try {
    const { jti: userId } = jwt.verify(token, process.env.JWT_SECRET) as { jti: string };

    req.userId = Number(userId);

    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid authorization token.' });
  }
}
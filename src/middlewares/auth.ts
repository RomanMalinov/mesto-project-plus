import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import UnauthorizedError from '../errors/UnauthorizedError';

export interface AuthRequest extends Request {
  user?: { _id: string | jwt.JwtPayload };
}

const userAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const { token } = req.cookies;
  if (!token) {
    next(new UnauthorizedError('Необходима авторизация'));
    return;
  }

  let payload;

  try {
    payload = jwt.verify(token, 'secret_code') as JwtPayload;
  } catch (error) {
    next(new UnauthorizedError('Авторизуйтесь для выполнения запроса'));
    return;
  }
  req.user = { _id: payload._id };
  next();
};

export default userAuth;

import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

interface AuthRequest extends Request {
  user?: string | JwtPayload;
}

const userAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Необходима авторизация' });
    return;
  }
  const token = authorization.replace('Bearer ', '');

  let payload;

  try {
    payload = jwt.verify(token, 'secret-key');
  } catch (error) {
    res.status(401).json({ message: 'Авторизуйтесь для выполнения запроса' });
    return;
  }
  req.user = payload;
  next();
};

export default userAuth;

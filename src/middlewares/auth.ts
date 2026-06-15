import type { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import type { JwtPayload } from 'jsonwebtoken';
import BadRequest from '../common/exceptions/badRequest';
import Unauthorized from '../common/exceptions/unauthorized';
import { decrypt } from '../utils/encryption.js';
import { UserService } from '../services/userService';
import type { User } from '../entities/userEntity';

interface AuthenticatedRequest extends Request {
  user?: User;
  token?: string;
}

interface CookieTokens {
  access_token?: string;
  refresh_token?: string;
}

type Audience = 'access' | 'refresh';

const verifyToken = async (
  req: AuthenticatedRequest,
  res: Response,
  audience: Audience,
): Promise<void> => {
  let token: string | undefined;

  // For testing - Allows both cookie-based and token-based authentication for development
  const authHeader = req.header('Authorization');
  if (authHeader) {
    token = authHeader.replace('Bearer ', '');
  } else {
    // Fall back to cookies if Authorization header is not present
    const cookies = req.cookies as CookieTokens | undefined;
    token = audience === 'access' ? cookies?.access_token : cookies?.refresh_token;
  }

  if (!token) {
    throw new Unauthorized('Access denied. No token provided.');
  }

  let decryptedToken: string;
  try {
    decryptedToken = decrypt(token);
  } catch (error) {
    throw new Unauthorized('Failed to decrypt token.');
  }

  let decoded: JwtPayload;
  try {
    decoded = jwt.verify(decryptedToken, process.env.JWT_SECRET as string, {
      audience,
    }) as JwtPayload;
  } catch (error) {
    throw new Unauthorized('Invalid token.');
  }

  // Type guard for decoded JWT payload with id
  if (!decoded.id || typeof decoded.id !== 'string') {
    throw new Unauthorized('Invalid token payload.');
  }

  let user: User;
  try {
    user = await UserService.getUserById(decoded.id);
  } catch (error) {
    if (error instanceof BadRequest) {
      throw new Unauthorized('Invalid token.');
    }
    throw error;
  }

  if (!user) {
    throw new Unauthorized('Invalid token.');
  }

  req.user = user;
  req.token = token;
};

const auth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  await verifyToken(req, res, 'access');
  next();
};

auth.refresh = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  await verifyToken(req, res, 'refresh');
  next();
};

export default auth;

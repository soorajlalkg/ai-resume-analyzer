import type { Request, Response, NextFunction } from 'express';
import { Forbidden } from '../common/exceptions/index';
import { UserType } from '../common/enum/userTypeEnum';
import type { User } from '../entities/userEntity';

interface AuthenticatedRequest extends Request {
  user?: User;
  token?: string;
}

const authAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  if (req.user && req.user.type === UserType.ADMIN) {
    next();
  } else {
    throw new Forbidden('Access denied. No permission to access this resource.', 'FORBIDDEN');
  }
};

export default authAdmin;

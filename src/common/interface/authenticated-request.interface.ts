import type { Request } from 'express';
import type { User } from '../../entities/userEntity';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface AuthenticatedRequest<TBody = any>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    extends Request<Record<string, never>, any, TBody> {
    user: User;
    /** Encrypted JWT cookie value, populated by `auth` middleware. */
    token?: string;
}

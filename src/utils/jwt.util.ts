import jwt from 'jsonwebtoken';
import type { SignOptions } from 'jsonwebtoken';
import { encrypt } from './encryption';
import config from '../config/config';

const JWT_SECRET = config.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
}

export const createToken = (
    userId: string,
    email: string,
    type: string,
    expiresIn: SignOptions['expiresIn'] = '1h',
    tokenType: string = 'access'
): string => {
    const payload = { id: userId, email, type, date: new Date() };
    const options: SignOptions = { expiresIn, audience: tokenType };
    const token = jwt.sign(payload, JWT_SECRET, options);
    const encryptedToken = encrypt(token);
    return encryptedToken;
};

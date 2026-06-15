import type { Request, Response } from 'express';
import { AuthService } from '../services/authServie';
import { goodResponse } from '../utils/response';
import type { RegisterDTO, LoginDTO, VerifyOtpDTO } from '../types/authInterface';

const allowedSameSiteValues = ['strict', 'lax', 'none'] as const;
const sameSiteEnv = process.env.COOKIE_SAME_SITE?.toLowerCase();
const sameSite = allowedSameSiteValues.includes(sameSiteEnv as 'strict' | 'lax' | 'none')
    ? (sameSiteEnv as 'strict' | 'lax' | 'none')
    : 'strict';
export class AuthController {
    static login = async (
        req: Request<Record<string, never>, object, LoginDTO>,
        res: Response
    ): Promise<void> => {
        const { email, password, rememberMe } = req.body;
        const { user, token } = await AuthService.login(email, password, rememberMe);

        res.cookie('access_token', token.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite,
            maxAge: 24 * 60 * 60 * 1000,
            domain: process.env.COOKIE_DOMAIN,
        });

        const maxAge = rememberMe
            ? 30 * 24 * 60 * 60 * 1000 // 30 days in ms
            : 7 * 24 * 60 * 60 * 1000; // 7 days in ms

        res.cookie('refresh_token', token.refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite,
            maxAge,
            domain: process.env.COOKIE_DOMAIN,
        });

        res.json(goodResponse({ user, token }, 'Login successful'));
    };

    static register = async (
        req: Request<Record<string, never>, object, RegisterDTO>,
        res: Response
    ): Promise<void> => {
        const userData = req.body;
        const user = await AuthService.register(userData);
        res.json(goodResponse({ user }, 'Registration successful', 201));
    };

    static verifyOtp = async (
        req: Request<Record<string, never>, object, VerifyOtpDTO>,
        res: Response
    ): Promise<void> => {
        const userData = req.body;
        const user = await AuthService.verifyEmailOtp(userData);
        res.json(goodResponse({ ...user }, 'Email verification successful'));
    };

    static logout = (req: Request, res: Response): void => {
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite,
            domain: process.env.COOKIE_DOMAIN,
        };

        res.clearCookie('access_token', cookieOptions);
        res.clearCookie('refresh_token', cookieOptions);

        res.json(goodResponse({}, 'Logout successful'));
    };
}

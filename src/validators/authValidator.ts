import type { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import type { LoginDTO, RegisterDTO } from '../types/authInterface';

const emailField = Joi.string().email().trim().required().messages({
    'string.empty': 'Email is required',
    'string.email': 'Email must be a valid email address',
});

const passwordField = Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};:"\\|,.<>/?]).{8,}$/)
    .required()
    .messages({
        'string.empty': 'Password is required',
        'string.min': 'Password must be at least 8 characters long',
        'string.pattern.base':
            'Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, one number, and one special character',
    });

export const validateRegisterUserInput = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const schema = Joi.object({
        email: emailField,
        password: passwordField,
        name: Joi.string().min(1).max(50).trim().required().messages({
            'string.empty': 'Name is required',
            'string.min': 'Name must be at least 1 character long',
            'string.max': 'Name must be at most 50 characters long',
        }),
    }).options({ stripUnknown: true });

    const validatedBody = (await schema.validateAsync(req.body, {
        abortEarly: false,
    })) as RegisterDTO;

    req.body = validatedBody;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    req.body.email = req.body.email.toLowerCase();

    return next();
};

export const validateLoginInput = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const schema = Joi.object({
        email: emailField,
        password: Joi.string().required().messages({
            'string.empty': 'Password is required',
        }),
    }).options({ stripUnknown: true });

    const validatedBody = (await schema.validateAsync(req.body, { abortEarly: false })) as LoginDTO;

    req.body = validatedBody;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    req.body.email = req.body.email.toLowerCase();

    return next();
};

export const validateVerifyOtpInput = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const schema = Joi.object({
        email: emailField,
        otp: Joi.string()
            .length(6)
            .required()
            .messages({
                'string.empty': 'OTP is required',
                'string.length': 'OTP must be 6 digits',
            }),
    }).options({ stripUnknown: true });

    const validatedBody = await schema.validateAsync(req.body, {
        abortEarly: false,
    });

    req.body = validatedBody;
    req.body.email = req.body.email.toLowerCase();

    next();
};

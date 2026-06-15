import type { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const validateChangePassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const schema = Joi.object({
    oldPassword: Joi.string().min(6).required().label('Old Password'),
    newPassword: Joi.string()
      .min(8)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};:"\\|,.<>/?]).{8,}$/)
      .required()
      .messages({
        'string.empty': 'New Password is required',
        'string.min': 'New Password must be at least 8 characters long',
        'string.pattern.base':
          'New Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, one number, and one special character',
      }),
  }).options({ stripUnknown: true });

  const validatedBody = (await schema.validateAsync(req.body, { abortEarly: false })) as {
    oldPassword: string;
    newPassword: string;
  };
  req.body = validatedBody;

  return next();
};

export const validateEditProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const schema = Joi.object({
    name: Joi.string().trim().min(1).max(50).optional().label('Name'),
    profile_url: Joi.string().trim().min(1).max(50).optional().label('Profile URL'),
  })
    .min(1)
    .messages({
      'object.min': 'At least one field must be provided for update',
    })
    .options({ stripUnknown: true });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const validatedBody = await schema.validateAsync(req.body, { abortEarly: false });
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  req.body = validatedBody;

  return next();
};

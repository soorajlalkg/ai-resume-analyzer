import * as bcrypt from 'bcrypt';
import { AppDataSource } from '../data-source';
import { User } from '../entities/userEntity';
import type { RegisterDTO, AuthResponse, UserResponse, VerifyOtpDTO } from '../types/authInterface';
import { BadRequest, Forbidden } from '../common/exceptions/index';
import { UserType } from '../common/enum/userTypeEnum';
import { createToken } from '../utils/jwt.util';
import {
  JWT_ACCESS_TOKEN_EXPIRATION,
  JWT_REFRESH_TOKEN_EXPIRATION,
  JWT_REFRESH_TOKEN_EXPIRATION_REMEMBER_ME,
} from '../constants/index';
import sendEmails from '../utils/sendEmails';
import { UserVerification } from '../entities/userVerificationEntity';

export class AuthService {
  public static async register(userData: RegisterDTO): Promise<UserResponse> {
    try {
      const userRepo = AppDataSource.getRepository(User);
      const userVerificationRepo = AppDataSource.getRepository(UserVerification);

      const existingUser = await userRepo.findOne({
        where: {
          email: userData.email,
        },
      });

      if (existingUser) {
        throw new BadRequest('User with this email already exists', 'ALREADY_EXISTS');
      }

      const newUser = userRepo.create({
        email: userData.email,
        password: userData.password,
        name: userData.name,
        type: UserType.USER,
      });

      const savedUser = await userRepo.save(newUser);

      // Generate 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      // OTP expiry (10 minutes)
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 10);

      // Save OTP record
      const verification = userVerificationRepo.create({
        user: savedUser,
        otp,
        expires_at: expiresAt,
        is_verified: false,
      });

      await userVerificationRepo.save(verification);

      // Send email
      await sendEmails({
        mailOptions: {
          to: savedUser.email,
          subject: 'Verify Your Email',
        },
        fileName: 'verify-email.ejs',
        contentVariables: {
          name: savedUser.name,
          otp,
          expireMinutes: 10,
        },
      });

      const { password: _, ...userWithoutPassword } = savedUser;

      return userWithoutPassword;
    } catch (error: unknown) {
      if (error instanceof BadRequest) {
        throw error;
      }
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new BadRequest(errorMessage, 'REGISTRATION_FAILED');
    }
  }

  public static async login(
    email: string,
    password: string,
    rememberMe: boolean,
  ): Promise<AuthResponse> {
    const userRepo = AppDataSource.getRepository(User);

    const user = await userRepo.findOne({
      where: {
        email,
      },
      select: {
        id: true,
        email: true,
        password: true,
        type: true,
        is_email_verified: true,
      },
    });

    if (!user) {
      throw new BadRequest('Invalid email or password', 'INVALID_CREDENTIALS');
    }

    if (!user.is_email_verified) {
      throw new Forbidden('Please verify your email before logging in.', 'EMAIL_NOT_VERIFIED');
    }

    if (!user.password) {
      throw new BadRequest('Invalid email or password', 'INVALID_CREDENTIALS');
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new BadRequest('Invalid email or password');
    }

    const accessToken = createToken(
      user.id,
      user.email,
      user.type,
      JWT_ACCESS_TOKEN_EXPIRATION,
      'access',
    );
    const refreshToken = createToken(
      user.id,
      user.email,
      user.type,
      rememberMe ? JWT_REFRESH_TOKEN_EXPIRATION_REMEMBER_ME : JWT_REFRESH_TOKEN_EXPIRATION,
      'refresh',
    );

    const { password: _, ...userWithoutPassword } = user;

    return {
      token: {
        access_token: accessToken,
        refresh_token: refreshToken,
      },
      user: userWithoutPassword,
    };
  }

  public static async verifyEmailOtp(userData: VerifyOtpDTO): Promise<{ message: string }> {
    const userRepo = AppDataSource.getRepository(User);
    const verificationRepo = AppDataSource.getRepository(UserVerification);

    const { email, otp } = userData;

    const user = await userRepo.findOne({
      where: { email },
    });

    if (!user) {
      throw new BadRequest('Invalid verification request', 'INVALID_REQUEST');
    }

    const verification = await verificationRepo.findOne({
      where: {
        user: {
          id: user.id,
        },
        is_verified: false,
      },
      order: {
        created_at: 'DESC',
      },
      relations: {
        user: true,
      },
    });

    if (!verification) {
      throw new BadRequest('Verification code not found', 'OTP_NOT_FOUND');
    }

    if (verification.expires_at < new Date()) {
      throw new BadRequest('Verification code has expired', 'OTP_EXPIRED');
    }

    if (verification.otp !== otp) {
      throw new BadRequest('Invalid verification code', 'INVALID_OTP');
    }

    verification.is_verified = true;
    verification.verified_at = new Date();

    user.is_email_verified = true;

    await verificationRepo.save(verification);
    await userRepo.save(user);

    return {
      message: 'Email verified successfully',
    };
  }
}

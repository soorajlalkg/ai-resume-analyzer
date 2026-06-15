import type { UserType } from '../common/enum/userTypeEnum';

export interface LoginDTO {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface RegisterDTO {
  email: string;
  password: string;
  name: string;
}

export interface VerifyOtpDTO {
  email: string;
  otp: string;
}

export interface UserResponse {
  id: string;
  email: string;
  name: string;
  type: UserType;
  profile_url: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface TokenPair {
  access_token: string;
  refresh_token: string;
}

export interface AuthResponse {
  token: TokenPair;
  user: UserResponse;
}

export type VerifyResponse = { token: TokenPair } | { message: string };

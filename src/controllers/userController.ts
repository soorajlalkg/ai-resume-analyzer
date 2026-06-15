import type { Response } from 'express';
import { UserService } from '../services/userService';
import { goodResponse } from '../utils/response';
import type { AuthenticatedRequest } from '../common/interface/authenticated-request.interface';
import type { ChangePasswordDTO, EditProfileDTO } from '../types/userInterface';

export class UserController {
  static changePassword = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    await UserService.changePassword(req.body as ChangePasswordDTO, req.user.id);
    res.json(goodResponse(null, 'Password changed successfully'));
  };

  static getUserProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const userId = req.user.id;
    const user = await UserService.getUserProfile(userId);

    res.json(goodResponse({ user }, 'User profile fetched successfully'));
  };

  static editProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const userId = req.user.id;
    const user = await UserService.editProfile(req.body as EditProfileDTO, userId);
    res.json(goodResponse({ user }, 'Profile updated successfully'));
  };
}

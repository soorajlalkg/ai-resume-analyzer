import { Response } from 'express';
import { UploadedFile } from 'express-fileupload';

import { ResumeService } from '../services/resumeService';
import { AuthenticatedRequest } from '../common/interface/authenticated-request.interface';
import { goodResponse } from '../utils/response';

export class ResumeController {
  static uploadResume = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const file = req.files?.file as UploadedFile;

    const uploadedFile = await ResumeService.uploadResume(req.user.id, file);
    res.json(goodResponse({ uploadedFile }, 'Resume uploaded successfully'));
  };

  static getResumes = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const userId = req.user.id;
    const userType = req.user.type;

    const resumes = await ResumeService.getResumes(userId, userType);

    res.json(goodResponse({ resumes }, 'Resumes fetched successfully'));
  };

  static getResume = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const userId = req.user.id;
    const userType = req.user.type;
    const { resumeId } = req.params;

    const resume = await ResumeService.getResume(userId, userType, resumeId);

    res.json(goodResponse({ resume }, 'Resume fetched successfully'));
  };

  static deleteResume = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const userId = req.user.id;
    const { resumeId } = req.params;

    await ResumeService.deleteResume(userId, resumeId);

    res.json(goodResponse({}, 'Resumes removed successfully'));
  };

  static generateAtsScore = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { resumeId } = req.params;

    const report = await ResumeService.generateAtsScore(req.user.id, resumeId);

    res.json(goodResponse({ report }, 'ATS score generated successfully'));
  };
}

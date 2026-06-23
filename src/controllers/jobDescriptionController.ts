import { Response } from 'express';
import { AuthenticatedRequest } from '../common/interface/authenticated-request.interface';
import { JobDescriptionService } from '../services/jobDescriptionService';
import { goodResponse } from '../utils/response';
import { UploadedFile } from 'express-fileupload';

export class JobDescriptionController {
  static create = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const result = await JobDescriptionService.create(req.user.id, req.body);

    res.status(201).json(goodResponse(result, 'Job description created successfully'));
  };

  static upload = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const file = req.files?.file as UploadedFile;

    const uploadedFile = await JobDescriptionService.upload(req.user.id, file);
    res.json(goodResponse({ uploadedFile }, 'JD uploaded successfully'));
  };

  static getAll = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const result = await JobDescriptionService.getAll();

    res.json(goodResponse(result, 'Job description fetched successfully'));
  };

  static getById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const result = await JobDescriptionService.getById(req.params.jobDescriptionId);

    res.json(goodResponse(result, 'Job description fetched successfully'));
  };

  static delete = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    await JobDescriptionService.delete(req.params.jobDescriptionId);

    res.json(goodResponse(null, 'Deleted successfully'));
  };
}

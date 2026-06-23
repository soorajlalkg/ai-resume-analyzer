import { Response } from 'express';
import { AuthenticatedRequest } from '../common/interface/authenticated-request.interface';
import { JobsService } from '../services/jobsService';
import { goodResponse } from '../utils/response';

export class JobsController {
  static matchedJobs = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const result = await JobsService.matchedJobs(req.user.id);

    res.json(goodResponse(result, 'Jobs fetched successfully'));
  };

  static matchedResumes = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const result = await JobsService.matchedResumes(req.params.jobId);

    res.json(goodResponse(result, 'Resumes fetched successfully'));
  };
}

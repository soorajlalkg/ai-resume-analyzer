import { Response } from 'express';
import { AuthenticatedRequest } from '../common/interface/authenticated-request.interface';
import { AnalysisService } from '../services/analysisService';
import { goodResponse } from '../utils/response';

export class AnalysisController {
  static matchResume = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { resumeId, jobDescriptionId } = req.body;

    const result = await AnalysisService.matchResume(req.user.id, resumeId, jobDescriptionId);

    res.json(goodResponse(result, 'Resume matched successfully'));
  };
}

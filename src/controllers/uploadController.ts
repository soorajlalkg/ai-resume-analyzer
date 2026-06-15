import type { Response } from 'express';
import { goodResponse } from '../utils/response';
import type { AuthenticatedRequest } from '../common/interface/authenticated-request.interface';
import { UploadService } from '../services/uploadService';
import type { FileUploadDTO } from '../types/uploadInterfaces';

export class uploadController {
    static handleFileUpload = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        const uploadedFiles = await UploadService.handleFileUploadService(
            req.files?.files,
            (req.body as FileUploadDTO).folderPath
        );
        res.json(goodResponse({ uploadedFiles }, 'Files uploaded successfully'));
    };

    static handleFileDelete = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        await UploadService.handleFileDeleteService(req.params.key);
        res.json(goodResponse({}, 'File deleted successfully'));
    };
}

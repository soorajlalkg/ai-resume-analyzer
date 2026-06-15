import type { UploadedFile } from 'express-fileupload';
import { BadRequest } from '../common/exceptions';
import { deleteFromS3, uploadToS3 } from '../utils/s3.utils';

export class UploadService {
  static async handleFileUploadService(
    files: UploadedFile | UploadedFile[] | undefined,
    folderPath: string = '',
  ): Promise<{ key: string; url: string }[]> {
    if (!files) {
      return [];
    }

    const fileArray = Array.isArray(files) ? files : [files];

    const uploadedFiles = await Promise.all(
      fileArray.map((file) =>
        uploadToS3(`${folderPath}/${file.name.trim()}`, file.data, file.mimetype, true),
      ),
    );

    return uploadedFiles.map((file) => ({
      key: file.key,
      url: file.url,
    }));
  }

  static async handleFileDeleteService(fileKey: string): Promise<unknown> {
    if (!fileKey) {
      throw new BadRequest('File key is required', 'VALIDATION_ERROR');
    }

    return deleteFromS3(fileKey);
  }
}

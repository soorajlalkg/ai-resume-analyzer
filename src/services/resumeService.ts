import type { UploadedFile } from 'express-fileupload';

import { AppDataSource } from '../data-source';
import { Resume } from '../entities/resumeEntity';
import { User } from '../entities/userEntity';
import { BadRequest } from '../common/exceptions';
import { deleteFromS3, uploadToS3 } from '../utils/s3.utils';

export class ResumeService {
  private static resumeRepo =
    AppDataSource.getRepository(Resume);

  static async uploadResume(
    userId: string,
    file?: UploadedFile,
  ): Promise<Resume> {
    if (!file) {
      throw new BadRequest('Resume file is required');
    }

    const uploadedFile = await uploadToS3(
      `resumes/${Date.now()}-${file.name.trim()}`,
      file.data,
      file.mimetype,
      true,
    );

    const resume = this.resumeRepo.create({
      user: {
        id: userId,
      } as User,
      file_name: file.name,
      file_key: uploadedFile.key,
    });

    return await this.resumeRepo.save(resume);
  }

  static async getResumes(
    userId: string
  ) {
    return this.resumeRepo.find({
      where: {
        user: {
          id: userId,
        },
      },
      order: {
        created_at: 'DESC',
      },
    });
  }

  static async getResume(
    userId: string,
    resumeId: string
  ) {
    return this.resumeRepo.findOneOrFail({
      where: {
        id: resumeId,
        user: {
          id: userId,
        },
      },
    });
  }

  static async deleteResume(
    userId: string,
    resumeId: string
  ) {
    const resume =
      await this.resumeRepo.findOneOrFail({
        where: {
          id: resumeId,
          user: {
            id: userId,
          },
        },
      });

    await deleteFromS3(resume.file_key);

    await this.resumeRepo.remove(
      resume
    );
  }
}

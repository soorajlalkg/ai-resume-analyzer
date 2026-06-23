import sanitizeHtml from 'sanitize-html';
import { AppDataSource } from '../data-source';
import { JobDescription } from '../entities/jobDescriptionEntity';
import { BadRequest } from '../common/exceptions';
import { UploadedFile } from 'express-fileupload';
import { uploadToS3 } from '../utils/s3.utils';
import { PdfService } from './pdfService';
import { User } from '../entities/userEntity';
import { JobVectorService } from './vector/jobVectorService';

export class JobDescriptionService {
  private static repo = AppDataSource.getRepository(JobDescription);

  static async create(
    userId: string,
    payload: {
      title: string;
      companyName?: string;
      description: string;
    },
  ) {
    const cleanDescription = sanitizeHtml(payload.description, {
      allowedTags: [],
      allowedAttributes: {},
    });

    const jd = this.repo.create({
      user: {
        id: userId,
      },
      title: payload.title,
      company_name: payload.companyName,
      description: cleanDescription,
    });

    const response = await this.repo.save(jd);

    await JobVectorService.store(response.id, cleanDescription);

    return response;
  }

  static async upload(userId: string, file?: UploadedFile): Promise<JobDescription> {
    if (!file) {
      throw new BadRequest('JobDescription file is required');
    }

    const uploadedFile = await uploadToS3(
      `jd/${Date.now()}-${file.name.trim()}`,
      file.data,
      file.mimetype,
      true,
    );

    const extractedText = await PdfService.extractText(file);

    const jd = this.repo.create({
      user: {
        id: userId,
      } as User,
      title: file.name,
      company_name: '',
      description: extractedText,
    });

    return await this.repo.save(jd);
  }

  static async getAll() {
    return this.repo.find({
      order: {
        created_at: 'DESC',
      },
    });
  }

  static async getById(jobDescriptionId: string) {
    const jd = await this.repo.findOne({
      where: {
        id: jobDescriptionId,
      },
    });

    if (!jd) {
      throw new BadRequest('Job description not found');
    }

    return jd;
  }

  static async delete(jobDescriptionId: string) {
    const jd = await this.getById(jobDescriptionId);

    await JobVectorService.delete(jobDescriptionId);

    await this.repo.remove(jd);
  }
}

import type { UploadedFile } from 'express-fileupload';

import { AppDataSource } from '../data-source';
import { Resume } from '../entities/resumeEntity';
import { User } from '../entities/userEntity';
import { BadRequest } from '../common/exceptions';
import { deleteFromS3, uploadToS3 } from '../utils/s3.utils';
import { openai } from '../config/openai/openai.config';
import { PdfService } from './pdfService';
import { AtsReport } from '../entities/atsReportEntity';
import { atsChain } from '../ai/chains/atsChain';
import { ResumeVectorService } from './vector/resumeVectorService';

export class ResumeService {
  private static resumeRepo = AppDataSource.getRepository(Resume);
  private static atsReportRepo = AppDataSource.getRepository(AtsReport);

  static async uploadResume(userId: string, file?: UploadedFile): Promise<Resume> {
    if (!file) {
      throw new BadRequest('Resume file is required');
    }

    const uploadedFile = await uploadToS3(
      `resumes/${Date.now()}-${file.name.trim()}`,
      file.data,
      file.mimetype,
      true,
    );

    const extractedText = await PdfService.extractText(file);

    const resume = this.resumeRepo.create({
      user: {
        id: userId,
      } as User,
      file_name: file.name,
      file_key: uploadedFile.key,
      extracted_text: extractedText,
    });

    const response = await this.resumeRepo.save(resume);

    await ResumeVectorService.store(response.id, extractedText);

    return response;
  }

  static async getResumes(userId: string) {
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

  static async getResume(userId: string, resumeId: string) {
    return this.resumeRepo.findOneOrFail({
      where: {
        id: resumeId,
        user: {
          id: userId,
        },
      },
    });
  }

  static async deleteResume(userId: string, resumeId: string) {
    const resume = await this.resumeRepo.findOneOrFail({
      where: {
        id: resumeId,
        user: {
          id: userId,
        },
      },
    });

    await deleteFromS3(resume.file_key);

    await this.resumeRepo.remove(resume);
  }

  static async generateAtsScore(userId: string, resumeId: string) {
    const resume = await this.resumeRepo.findOne({
      where: {
        id: resumeId,
        user: {
          id: userId,
        },
      },
    });

    if (!resume) {
      throw new BadRequest('Resume not found');
    }

    const existingReport = await this.atsReportRepo.findOne({
      where: {
        resume: {
          id: resumeId,
        },
      },
      relations: {
        resume: true,
      },
    });

    if (existingReport) {
      return existingReport;
    }

    if (!resume.extracted_text) {
      throw new BadRequest('Resume text not available');
    }

    /*const response = await openai.chat.completions.create({
      model: 'gpt-4.1-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an ATS resume analyzer.',
        },
        {
          role: 'user',
          content: `
Analyze the resume and return JSON only.

{
  "score": 0,
  "strengths": [],
  "missingKeywords": [],
  "recommendations": [],
  "summary": ""
}

Resume:
${resume.extracted_text}
`,
        },
      ],
      response_format: {
        type: 'json_object',
      },
    });

    const atsResult = JSON.parse(response.choices[0].message.content!);
    */

    const atsResult = await atsChain.invoke({
      resume: resume.extracted_text,
    });

    const report = this.atsReportRepo.create({
      resume,
      score: atsResult.score,
      strengths: atsResult.strengths ?? [],
      missing_skills: atsResult.missingKeywords ?? [],
      recommendations: atsResult.recommendations ?? [],
      summary: atsResult.summary ?? '',
    });

    await this.atsReportRepo.save(report);

    return report;
  }
}

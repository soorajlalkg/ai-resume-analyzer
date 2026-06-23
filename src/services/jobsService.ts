import { AppDataSource } from '../data-source';
import { Resume } from '../entities/resumeEntity';
import { JobDescription } from '../entities/jobDescriptionEntity';
import { AnalysisReport } from '../entities/analysisReportEntity';
import { BadRequest, NotFound } from '../common/exceptions';
import { openai } from '../config/openai/openai.config';
import { jobMatchChain } from '../ai/chains/jobMatchChain';
import { JobVectorService } from './vector/jobVectorService';
import { In } from 'typeorm';
import { ResumeVectorService } from './vector/resumeVectorService';

export class JobsService {
  private static resumeRepo = AppDataSource.getRepository(Resume);

  private static jdRepo = AppDataSource.getRepository(JobDescription);

  private static reportRepo = AppDataSource.getRepository(AnalysisReport);

  static async matchedJobs(userId: string) {
    // get latest resume
    const resume = await this.resumeRepo.findOneOrFail({
      where: {
        user: {
          id: userId,
        },
      },
      order: {
        created_at: 'DESC',
      },
    });

    if (!resume) {
      throw new NotFound('Resume not found');
    }
    if (!resume.extracted_text) {
      throw new NotFound('Resume content not found');
    }

    const searchResults = await JobVectorService.searchJobs(resume.extracted_text);

    const jobIds = searchResults.map((item) => item.id as string);

    const jobs = await this.jdRepo.findBy({
      id: In(jobIds),
    });

    return jobs;
  }

  static async matchedResumes(jobId: string) {
    // get latest resume
    const jd = await this.jdRepo.findOneOrFail({
      where: {
        id: jobId,
      },
    });

    if (!jd) {
      throw new NotFound('JD not found');
    }
    if (!jd.description) {
      throw new NotFound('JD description not found');
    }

    const searchResults = await ResumeVectorService.searchResumes(jd.description);

    const resumeIds = searchResults.map((item) => item.id as string);

    const resumes = await this.resumeRepo.findBy({
      id: In(resumeIds),
    });

    return resumes;
  }
}

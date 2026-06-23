import { In } from 'typeorm';
import { AppDataSource } from '../data-source';
import { Resume } from '../entities/resumeEntity';
import { JobDescription } from '../entities/jobDescriptionEntity';
import { NotFound } from '../common/exceptions';
import { jobMatchChain } from '../ai/chains/jobMatchChain';
import { JobVectorService } from './vector/jobVectorService';
import { ResumeVectorService } from './vector/resumeVectorService';
import { ResumeJobMatch } from '../entities/resumeJobMatchEntity';

export class JobsService {
  private static resumeRepo = AppDataSource.getRepository(Resume);

  private static jdRepo = AppDataSource.getRepository(JobDescription);

  private static resumeJobMatchRepo = AppDataSource.getRepository(ResumeJobMatch);

  private static getCategory(score: number): string {
    if (score >= 80) {
      return 'TOP MATCH';
    }

    if (score >= 60) {
      return 'MEDIUM MATCH';
    }

    return 'LOW MATCH';
  }

  private static async analyzeMatch(resumeText: string, jobDescription: string) {
    const analysis = await jobMatchChain.invoke({
      resume: resumeText,
      jobDescription,
    });

    return {
      matchPercentage: analysis.matchPercentage,
      strengths: analysis.strengths,
      missingSkills: analysis.missingSkills,
      recommendations: analysis.recommendations,
      summary: analysis.summary,
      category: this.getCategory(analysis.matchPercentage),
    };
  }

  static async matchedJobs(userId: string) {
    const resume = await this.resumeRepo.findOneOrFail({
      where: {
        user: { id: userId },
      },
      order: {
        created_at: 'DESC',
      },
    });

    if (!resume.extracted_text) {
      throw new NotFound('Resume content not found');
    }

    return this.resumeJobMatchRepo.find({
      where: {
        resume: {
          id: resume.id,
        },
      },
      relations: {
        jobDescription: true,
      },
      order: {
        match_percentage: 'DESC',
      },
    });

    // const resume = await this.resumeRepo.findOneOrFail({
    //   where: {
    //     user: { id: userId },
    //   },
    //   order: {
    //     created_at: 'DESC',
    //   },
    // });

    // if (!resume.extracted_text) {
    //   throw new NotFound('Resume content not found');
    // }

    // const searchResults = await JobVectorService.searchJobs(resume.extracted_text);

    // const jobIds = searchResults.map((r) => r.id as string);

    // const jobs = await this.jdRepo.find({
    //   where: {
    //     id: In(jobIds),
    //   },
    //   select: {
    //     id: true,
    //     title: true,
    //     description: true,
    //   },
    // });

    // const matches = await Promise.all(
    //   jobs.map(async (job) => {
    //     const analysis = await this.analyzeMatch(resume.extracted_text as string, job.description);

    //     return {
    //       jobId: job.id,
    //       title: job.title,
    //       description: job.description,
    //       ...analysis,
    //     };
    //   }),
    // );

    // matches.sort((a, b) => b.matchPercentage - a.matchPercentage);

    // return matches;
  }

  static async matchedResumes(jobId: string) {
    return this.resumeJobMatchRepo.find({
      where: {
        jobDescription: {
          id: jobId,
        },
      },
      relations: {
        resume: true,
      },
      order: {
        match_percentage: 'DESC',
      },
    });

    // const jd = await this.jdRepo.findOneOrFail({
    //   where: {
    //     id: jobId,
    //   },
    // });

    // if (!jd) {
    //   throw new NotFound('JD not found');
    // }
    // if (!jd.description) {
    //   throw new NotFound('JD description not found');
    // }

    // const searchResults = await ResumeVectorService.searchResumes(jd.description);

    // const resumeIds = searchResults.map((item) => item.id as string);

    // const resumes = await this.resumeRepo.findBy({
    //   id: In(resumeIds),
    // });

    // const matches = await Promise.all(
    //   resumes.map(async (resume) => {
    //     const analysis = await this.analyzeMatch(resume.extracted_text as string, jd.description);

    //     return {
    //       resumeId: resume.id,
    //       ...analysis,
    //     };
    //   }),
    // );

    // matches.sort((a, b) => b.matchPercentage - a.matchPercentage);

    // return matches;
  }

  static async generateMatchesForJob(jobId: string) {
    const job = await this.jdRepo.findOneByOrFail({
      id: jobId,
    });

    const searchResults = await ResumeVectorService.searchResumes(job.description);

    const resumeIds = searchResults.map((x) => x.id as string);

    const resumes = await this.resumeRepo.findBy({
      id: In(resumeIds),
    });

    for (const resume of resumes) {
      const exists = await this.resumeJobMatchRepo.findOne({
        where: {
          resume: {
            id: resume.id,
          },
          jobDescription: {
            id: job.id,
          },
        },
      });

      if (exists) continue;

      const analysis = await jobMatchChain.invoke({
        resume: resume.extracted_text,
        jobDescription: job.description,
      });

      await this.resumeJobMatchRepo.save({
        resume: {
          id: resume.id,
        },
        job: {
          id: job.id,
        },
        match_percentage: analysis.matchPercentage,
        category: this.getCategory(analysis.matchPercentage),
        strengths: analysis.strengths,
        missing_skills: analysis.missingSkills,
        recommendations: analysis.recommendations,
        summary: analysis.summary,
      });
    }
  }

  static async generateMatchesForResume(resumeId: string) {
    const resume = await this.resumeRepo.findOneByOrFail({
      id: resumeId,
    });

    const searchResults = await JobVectorService.searchJobs(resume.extracted_text as string);

    const jobIds = searchResults.map((x) => x.id as string);

    const jobs = await this.jdRepo.findBy({
      id: In(jobIds),
    });

    for (const job of jobs) {
      const analysis = await jobMatchChain.invoke({
        resume: resume.extracted_text,
        jobDescription: job.description,
      });

      await this.resumeJobMatchRepo.save({
        resume: {
          id: resume.id,
        },
        job: {
          id: job.id,
        },
        match_percentage: analysis.matchPercentage,
        category: this.getCategory(analysis.matchPercentage),
        strengths: analysis.strengths,
        missing_skills: analysis.missingSkills,
        recommendations: analysis.recommendations,
        summary: analysis.summary,
      });
    }
  }
}

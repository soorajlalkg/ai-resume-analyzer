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

  // Todo: remove
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
      skip: 0,
      take: 5,
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
      skip: 0,
      take: 5,
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

  static async searchJobs(query: string) {
    // Semantic Search
    const results = await JobVectorService.semanticSearch(String(query));

    const jobIds = results.map((x) => x.id as string);

    // Fetch jobs
    const jobs = await this.jdRepo.findBy({
      id: In(jobIds),
    });

    // return jobs;

    // Map semantic scores
    const scoreMap = new Map(results.map((item) => [item.id, item.score]));

    // Hybrid Ranking
    const rankedJobs = jobs.map((job) => {
      const semanticScore = scoreMap.get(job.id) ?? 0;

      const keywordScore = this.calculateKeywordScore(query, `${job.title} ${job.description}`);

      const finalScore = semanticScore * 0.7 + keywordScore * 0.3;

      return {
        ...job,
        semanticScore: Math.round(semanticScore * 100),
        keywordScore: Math.round(keywordScore * 100),
        finalScore: Math.round(finalScore * 100),
        category: this.getCategory(Math.round(finalScore * 100)),
      };
    });

    rankedJobs.sort((a, b) => b.finalScore - a.finalScore);

    return rankedJobs;
  }

  private static calculateKeywordScore(query: string, content: string): number {
    const stopWords = new Set(['with', 'for', 'and', 'or', 'the', 'a', 'an']);

    const keywords = query
      .toLowerCase()
      .split(/\s+/)
      .filter((word) => word.length > 2 && !stopWords.has(word));

    const contentWords = new Set(
      content
        .toLowerCase()
        .replace(/[^\w\s]/g, ' ')
        .split(/\s+/),
    );

    const matches = keywords.filter((keyword) => contentWords.has(keyword)).length;

    return matches / keywords.length;
  }
}

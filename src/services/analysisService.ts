import { AppDataSource } from '../data-source';
import { Resume } from '../entities/resumeEntity';
import { JobDescription } from '../entities/jobDescriptionEntity';
import { AnalysisReport } from '../entities/analysisReportEntity';
import { BadRequest } from '../common/exceptions';
import { openai } from '../config/openai/openai.config';

export class AnalysisService {
  private static resumeRepo = AppDataSource.getRepository(Resume);

  private static jdRepo = AppDataSource.getRepository(JobDescription);

  private static reportRepo = AppDataSource.getRepository(AnalysisReport);

  static async matchResume(userId: string, resumeId: string, jobDescriptionId: string) {
    const existing = await this.reportRepo.findOne({
      where: {
        resume: {
          id: resumeId,
        },
        jobDescription: {
          id: jobDescriptionId,
        },
      },
      relations: {
        resume: true,
        jobDescription: true,
      },
    });

    if (existing) {
      return existing;
    }

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

    const jd = await this.jdRepo.findOne({
      where: {
        id: jobDescriptionId,
        user: {
          id: userId,
        },
      },
    });

    if (!jd) {
      throw new BadRequest('Job description not found');
    }

    const existingReport = await this.reportRepo.findOne({
      where: {
        resume: {
          id: resumeId,
        },
        jobDescription: {
          id: jobDescriptionId,
        },
      },
    });

    if (existingReport) {
      return existingReport;
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4.1-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a resume matching expert.',
        },
        {
          role: 'user',
          content: `
Compare the resume and job description.

Return JSON:

{
 "matchPercentage":0,
 "strengths":[],
 "missingSkills":[],
 "recommendations":[],
 "summary":""
}

Resume:
${resume.extracted_text}

Job Description:
${jd.description}
`,
        },
      ],
      response_format: {
        type: 'json_object',
      },
    });

    const result = JSON.parse(response.choices[0].message.content!);

    const report = this.reportRepo.create({
      resume,
      jobDescription: jd,
      match_percentage: result.matchPercentage,
      strengths: result.strengths ?? [],
      missing_skills: result.missingSkills ?? [],
      recommendations: result.recommendations ?? [],
      summary: result.summary ?? '',
    });

    await this.reportRepo.save(report);

    return report;
  }
}

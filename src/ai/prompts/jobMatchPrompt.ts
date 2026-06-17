import { PromptTemplate, ChatPromptTemplate } from '@langchain/core/prompts';

// export const jobMatchPrompt = PromptTemplate.fromTemplate(`
// You are an expert technical recruiter.

// Compare the resume against the job description and evaluate how well the candidate matches the role.

// Provide:

// - matchPercentage: Match score between 0 and 100
// - strengths: Skills and experiences from the resume that align with the job description
// - missingSkills: Important skills, technologies, or requirements mentioned in the job description but missing from the resume
// - recommendations: Suggestions to improve the resume for this job
// - summary: A concise assessment of the candidate's suitability

// Resume:
// {resume}

// Job Description:
// {jobDescription}
// `);

export const jobMatchPrompt = ChatPromptTemplate.fromMessages([
  [
    'system',
    `You are an expert technical recruiter.

    Compare a candidate's resume against a job description and evaluate the fit.

    Provide:
    - matchPercentage: Match score between 0 and 100
    - strengths: Skills and experiences from the resume that align with the job description
    - missingSkills: Important skills, technologies, or requirements mentioned in the job description but missing from the resume
    - recommendations: Suggestions to improve the resume for this job
    - summary: A concise assessment of the candidate's suitability`,
  ],
  [
    'human',
    `Resume:
    {resume}

    Job Description:
    {jobDescription}`,
  ],
]);

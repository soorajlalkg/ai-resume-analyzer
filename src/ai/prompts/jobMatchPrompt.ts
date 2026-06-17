import { PromptTemplate } from '@langchain/core/prompts';

export const jobMatchPrompt = PromptTemplate.fromTemplate(`
Compare the resume and job description.

Resume:
{resume}

Job Description:
{jobDescription}
`);

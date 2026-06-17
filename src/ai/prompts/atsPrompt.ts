import { PromptTemplate } from '@langchain/core/prompts';

export const atsPrompt = PromptTemplate.fromTemplate(`
You are an ATS resume analyzer.

Analyze the resume.

Resume:
{resume}
`);

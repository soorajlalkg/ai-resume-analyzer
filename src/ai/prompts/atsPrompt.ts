import { PromptTemplate, ChatPromptTemplate } from '@langchain/core/prompts';

// export const atsPrompt = PromptTemplate.fromTemplate(`
// You are an ATS resume analyzer.

// Analyze the following resume and provide:

// - ATS score between 0 and 100
// - Key strengths
// - Missing keywords or skills
// - Recommendations for improvement
// - Overall summary

// Resume:
// {resume}
// `);

export const atsPrompt = ChatPromptTemplate.fromMessages([
  [
    'system',
    `You are an ATS resume analyzer.

    Evaluate the resume and provide:

    1. score: ATS score between 0 and 100
    2. strengths: Key strengths found in the resume
    3. missingKeywords: Important missing skills or keywords
    4. recommendations: Actionable improvements
    5. summary: Overall assessment`,
  ],
  ['human', '{resume}'],
]);

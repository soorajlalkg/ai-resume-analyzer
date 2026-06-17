import { llm } from '../llm/openai';
import { JobMatchSchema } from '../schemas/jobMatchSchema';
import { jobMatchPrompt } from '../prompts/jobMatchPrompt';

const jobMatchModel = llm.withStructuredOutput(JobMatchSchema);

export const jobMatchChain = jobMatchPrompt.pipe(jobMatchModel);

import { llm } from '../llm/openai';
import { ATSSchema } from '../schemas/atsSchema';
import { atsPrompt } from '../prompts/atsPrompt';

const atsModel = llm.withStructuredOutput(ATSSchema);

export const atsChain = atsPrompt.pipe(atsModel);

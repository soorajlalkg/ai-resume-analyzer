import { ChatOpenAI } from '@langchain/openai';
import config from '../../config/config';

export const llm = new ChatOpenAI({
  model: 'gpt-4.1-mini',
  temperature: 0,
  apiKey: config.OPEN_AI_KEY,
});

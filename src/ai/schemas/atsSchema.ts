import { z } from 'zod';

export const ATSSchema = z.object({
  score: z.number(),
  strengths: z.array(z.string()),
  missingKeywords: z.array(z.string()),
  recommendations: z.array(z.string()),
  summary: z.string(),
});

export type ATSResult = z.infer<typeof ATSSchema>;

import { z } from 'zod';

export const JobMatchSchema = z.object({
  matchPercentage: z.number(),
  strengths: z.array(z.string()),
  missingSkills: z.array(z.string()),
  recommendations: z.array(z.string()),
  summary: z.string(),
});

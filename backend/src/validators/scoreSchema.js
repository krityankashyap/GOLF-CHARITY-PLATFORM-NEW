import { z } from 'zod';

export const addScoreSchema = z.object({
  value: z
    .number()
    .int('Score must be an integer')
    .min(1, 'Score must be at least 1')
    .max(45, 'Score must be at most 45'),
  date: z.string().or(z.date()),
});

export const adminScoresSchema = z.object({
  scores: z
    .array(
      z.object({
        value: z.number().int().min(1).max(45),
        date: z.string().or(z.date()),
      })
    )
    .max(5, 'Maximum 5 scores allowed'),
});

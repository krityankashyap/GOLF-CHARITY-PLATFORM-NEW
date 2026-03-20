import { z } from 'zod';

export const configureDrawSchema = z.object({
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(2024).max(2100),
  drawType: z.enum(['random', 'algorithmic']).default('random'),
});

export const verifyWinnerSchema = z.object({
  status: z.enum(['approved', 'rejected']),
  adminNote: z.string().optional(),
});

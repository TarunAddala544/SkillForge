import { z } from 'zod'

export const createActivitySchema = z.object({
  date: z.string(),
  durationMinutes: z.number().positive(),
  numericProgress: z.number().optional(),
  notes: z.string().optional(),
  categoryId: z.string().uuid(),
  goalId: z.string().uuid().optional()
})
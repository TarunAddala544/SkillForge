import { z } from 'zod'
import { GoalStatus } from '@prisma/client'

export const createGoalSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  targetValue: z.number().positive().optional(),
  deadline: z.string().optional(),
  categoryId: z.string().uuid()
})

export const updateGoalSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  targetValue: z.number().positive().optional(),
  deadline: z.string().optional(),
  status: z.nativeEnum(GoalStatus).optional()
})
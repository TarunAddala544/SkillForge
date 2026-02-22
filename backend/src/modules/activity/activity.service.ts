import { prisma } from '../../config/prisma'
import { CreateActivityInput } from './activity.types'
import { GoalStatus } from '@prisma/client'
import { redis } from '../../config/redis'
import { AppError } from '../../utils/AppError'

export class ActivityService {
  static async createActivity(userId: string, input: CreateActivityInput) {
    const {
      date,
      durationMinutes,
      numericProgress,
      notes,
      categoryId,
      goalId
    } = input

    if (durationMinutes <= 0) {
      throw new AppError('Duration must be positive', 400)
    }

    return prisma.$transaction(async (tx) => {
      // 1️⃣ Validate category
      const category = await tx.category.findUnique({
        where: { id: categoryId }
      })

      if (!category || !category.isActive) {
        throw new AppError('Invalid or inactive category', 400)
      }

      let goal = null

      if (goalId) {
        goal = await tx.goal.findFirst({
          where: {
            id: goalId,
            userId
          }
        })

        if (!goal) {
          throw new AppError('Goal not found', 404)
        }

        if (goal.status === GoalStatus.ARCHIVED) {
          throw new AppError(
            'Cannot log activity for archived goal',
            400
          )
        }
      }

      // 2️⃣ Create ActivityLog
      const activity = await tx.activityLog.create({
        data: {
          date: new Date(date),
          durationMinutes,
          numericProgress,
          notes,
          userId,
          categoryId,
          goalId
        }
      })

      // 🔥 Emit event (outside transaction safety consideration noted)
      await redis.lpush(
        'activity_events',
        JSON.stringify({
          type: 'ACTIVITY_CREATED',
          userId,
          date,
          durationMinutes,
          numericProgress
        })
      )

      // 3️⃣ Update goal progress if applicable
      if (goal && numericProgress) {
        const newValue = goal.currentValue + numericProgress

        await tx.goal.update({
          where: { id: goal.id },
          data: {
            currentValue: newValue,
            status:
              goal.targetValue && newValue >= goal.targetValue
                ? GoalStatus.COMPLETED
                : goal.status
          }
        })
      }

      return activity
    })
  }
}
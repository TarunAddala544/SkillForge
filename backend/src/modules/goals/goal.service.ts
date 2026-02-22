import { GoalStatus } from '@prisma/client'
import { prisma } from '../../config/prisma'
import { CreateGoalInput } from './goal.types'

export class GoalService {
  static async createGoal(userId: string, input: CreateGoalInput) {
    const { title, description, targetValue, deadline, categoryId } = input

    const category = await prisma.category.findUnique({
      where: { id: categoryId }
    })

    if (!category || !category.isActive) {
      throw new Error('Invalid or inactive category')
    }

    const goal = await prisma.goal.create({
      data: {
        title,
        description,
        targetValue,
        deadline: deadline ? new Date(deadline) : undefined,
        status: GoalStatus.ACTIVE,
        userId,
        categoryId
      }
    })

    return goal
  }
  static async getUserGoals(userId: string) {
    return prisma.goal.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    })
  }
  static async getGoalById(userId: string, goalId: string) {
    const goal = await prisma.goal.findFirst({
      where: {
        id: goalId,
        userId: userId
      }
    })
  
    if (!goal) {
      throw new Error('Goal not found')
    }
  
    return goal
  }
  static async updateGoal(
    userId: string,
    goalId: string,
    input: UpdateGoalInput
  ) {
    const existingGoal = await prisma.goal.findFirst({
      where: {
        id: goalId,
        userId: userId
      }
    })
  
    if (!existingGoal) {
      throw new Error('Goal not found')
    }
  
    if (existingGoal.status === 'ARCHIVED') {
      throw new Error('Archived goals cannot be modified')
    }
  
    const updatedGoal = await prisma.goal.update({
      where: { id: goalId },
      data: {
        title: input.title ?? existingGoal.title,
        description: input.description ?? existingGoal.description,
        targetValue: input.targetValue ?? existingGoal.targetValue,
        deadline: input.deadline
          ? new Date(input.deadline)
          : existingGoal.deadline,
        status: input.status ?? existingGoal.status
      }
    })
  
    return updatedGoal
  }
}
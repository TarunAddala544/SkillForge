import { Response, NextFunction } from 'express'
import { GoalService } from './goal.service'
import { AuthRequest } from '../../middleware/auth.middleware'
import { AppError } from '../../utils/AppError'

export class GoalController {
  static async createGoal(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.userId) {
        throw new AppError('Unauthorized', 401)
      }

      const goal = await GoalService.createGoal(req.userId, req.body)

      return res.status(201).json(goal)
    } catch (error) {
      next(error)
    }
  }

  static async getGoals(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.userId) {
        throw new AppError('Unauthorized', 401)
      }

      const goals = await GoalService.getUserGoals(req.userId)

      return res.json(goals)
    } catch (error) {
      next(error)
    }
  }

  static async getGoalById(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.userId) {
        throw new AppError('Unauthorized', 401)
      }
  
      const goalId = req.params.id
  
      if (!goalId) {
        throw new AppError('Goal ID is required', 400)
      }
  
      const goal = await GoalService.getGoalById(req.userId, goalId as string)
  
      return res.json(goal)
    } catch (error) {
      next(error)
    }
  }

  static async updateGoal(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.userId) {
        throw new AppError('Unauthorized', 401)
      }
  
      const goalId = req.params.id
  
      if (!goalId) {
        throw new AppError('Goal ID is required', 400)
      }
  
      const updatedGoal = await GoalService.updateGoal(
        req.userId,
        goalId as string,
        req.body
      )
  
      return res.json(updatedGoal)
    } catch (error) {
      next(error)
    }
  }
}
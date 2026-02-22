import { Response, NextFunction } from 'express'
import { AuthRequest } from '../../middleware/auth.middleware'
import { ActivityService } from './activity.service'
import { AppError } from '../../utils/AppError'

export class ActivityController {
  static async createActivity(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.userId) {
        throw new AppError('Unauthorized', 401)
      }

      const activity = await ActivityService.createActivity(
        req.userId,
        req.body
      )

      return res.status(201).json(activity)
    } catch (error) {
      next(error)
    }
  }
}
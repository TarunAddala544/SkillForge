import { Response, NextFunction } from 'express'
import { AuthRequest } from '../../middleware/auth.middleware'
import { DashboardService } from './dashboard.service'
import { AppError } from '../../utils/AppError'

export class DashboardController {
  static async getSummary(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.userId) {
        throw new AppError('Unauthorized', 401)
      }

      const { start, end } = req.query

      const summary = await DashboardService.getSummary(
        req.userId,
        start as string | undefined,
        end as string | undefined
      )

      return res.json(summary)
    } catch (error) {
      next(error)
    }
  }
}
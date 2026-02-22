import { Router } from 'express'
import { authenticate } from '../../middleware/auth.middleware'
import { DashboardController } from './dashboard.controller'

const router = Router()

router.get('/summary', authenticate, DashboardController.getSummary)

export default router
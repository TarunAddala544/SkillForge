import { Router } from 'express'
import { GoalController } from './goal.controller'
import { authenticate } from '../../middleware/auth.middleware'
import { validate } from '../../middleware/validate.middleware'
import {
  createGoalSchema,
  updateGoalSchema
} from '../../validations/goal.validation'


const router = Router()


router.post('/', authenticate, GoalController.createGoal)
router.get('/', authenticate, GoalController.getGoals)
router.get('/:id', authenticate, GoalController.getGoalById)
router.patch('/:id', authenticate, GoalController.updateGoal)
router.post(
    '/',
    authenticate,
    validate(createGoalSchema),
    GoalController.createGoal
  )
  
  router.patch(
    '/:id',
    authenticate,
    validate(updateGoalSchema),
    GoalController.updateGoal
  )
export default router
import { Router } from 'express'
import { authenticate } from '../../middleware/auth.middleware'
import { ActivityController } from './activity.controller'
import { validate } from '../../middleware/validate.middleware'
import { createActivitySchema } from '../../validations/activity.validation'


const router = Router()

router.post('/', authenticate, ActivityController.createActivity)
router.post(
    '/',
    authenticate,
    validate(createActivitySchema),
    ActivityController.createActivity
  )

export default router
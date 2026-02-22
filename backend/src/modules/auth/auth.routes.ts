import { Router } from 'express'
import { register, login, refresh, logout } from './auth.controller'
import { validate } from '../../middleware/validate.middleware'
import { authRateLimiter } from '../../middleware/rateLimit.middleware'
import {
  registerSchema,
  loginSchema
} from '../../validations/auth.validation'

const router = Router()

router.post(
    '/register',
    authRateLimiter,
    validate(registerSchema),
    register
  )
  
  router.post(
    '/login',
    authRateLimiter,
    validate(loginSchema),
    login
  )
router.post('/refresh', refresh)
router.post('/logout', logout)

export default router
import { OpenAPIHono } from '@hono/zod-openapi'
import type { AppEnv } from '../types'
import { loginRoute, protectedRoute } from './route'
import { authController } from './controller'

export const authModule = new OpenAPIHono<AppEnv>()

authModule.openapi(loginRoute, authController.login)
authModule.openapi(protectedRoute, authController.getProfile)

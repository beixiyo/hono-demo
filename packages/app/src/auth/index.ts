import { OpenAPIHono } from '@hono/zod-openapi'
import type { AppEnv } from '../types'
import { loginRoute, protectedRoute } from './route'
import { authController } from './controller'
import { Controller } from '../core/controller-registry'

export const authModule = new OpenAPIHono<AppEnv>()

authModule.openapi(loginRoute, authController.login)
authModule.openapi(protectedRoute, authController.getProfile)

@Controller({ basePath: '/api/auth', module: authModule })
export class AuthControllerModule {}

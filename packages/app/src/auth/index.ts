import { OpenAPIHono } from '@hono/zod-openapi'
import type { AppEnv } from '../types'
import { jwt } from 'hono/jwt'
import { loginRoute, protectedRoute } from './route'
import { authController } from './controller'
import { JWT_SECRET } from './service'

export const authModule = new OpenAPIHono<AppEnv>()

authModule.openapi(loginRoute, authController.login)

// 针对特定路径应用 JWT 保护
authModule.use('/jwt/protected', jwt({ secret: JWT_SECRET, alg: 'HS256' }))
authModule.openapi(protectedRoute, authController.getProfile)

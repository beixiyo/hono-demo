import { OpenAPIHono } from '@hono/zod-openapi'
import type { AppEnv } from '../types'
import { getUserRoute } from './route'
import { userController } from './controller'

export const userModule = new OpenAPIHono<AppEnv>()

userModule.openapi(getUserRoute, userController.getUser)

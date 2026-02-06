import { OpenAPIHono } from '@hono/zod-openapi'
import type { AppEnv } from '../types'
import { sseRoute } from './route'
import { sseController } from './controller'

export const sseModule = new OpenAPIHono<AppEnv>()

sseModule.openapi(sseRoute, sseController.events)

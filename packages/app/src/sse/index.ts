import { OpenAPIHono } from '@hono/zod-openapi'
import type { AppEnv } from '../types'
import { sseRoute } from './route'
import { sseController } from './controller'
import { Controller } from '../core/controller-registry'

export const sseModule = new OpenAPIHono<AppEnv>()

sseModule.openapi(sseRoute, sseController.events)

@Controller({ basePath: '/api/sse', module: sseModule })
export class SseControllerModule {}

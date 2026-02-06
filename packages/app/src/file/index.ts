import { OpenAPIHono } from '@hono/zod-openapi'
import type { AppEnv } from '../types'
import { uploadRoute } from './route'
import { fileController } from './controller'

export const fileModule = new OpenAPIHono<AppEnv>()

fileModule.openapi(uploadRoute, fileController.upload)

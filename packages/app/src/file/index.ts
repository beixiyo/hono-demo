import { OpenAPIHono } from '@hono/zod-openapi'
import type { AppEnv } from '../types'
import { uploadRoute } from './route'
import { fileController } from './controller'
import { Controller } from '../core/controller-registry'

export const fileModule = new OpenAPIHono<AppEnv>()

fileModule.openapi(uploadRoute, fileController.upload)

@Controller({ basePath: '/api/file', module: fileModule })
export class FileControllerModule {}

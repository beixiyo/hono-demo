import { join } from 'node:path'
import { OpenAPIHono } from '@hono/zod-openapi'
import { serveStatic } from 'hono/bun'

import type { AppEnv } from './types'
import { registerMiddleware } from './core/middleware'
import { errorHandler, notFoundHandler } from './core/error-handler'
import { registerOpenAPI } from './core/openapi'
import { registerControllers } from './core/controller-registry'

import { websocket } from 'hono/bun'
import './auth'
import './file'
import './user'
import './sse'
import './websocket'
import { isDev } from 'shared'

/**
 * 应用主入口
 * 仅负责核心模块的初始化、配置加载及路由编排
 */
const app = new OpenAPIHono<AppEnv>()

// 1. 注册全局中间件
registerMiddleware(app)

// 2. 静态资源服务 (独立于业务路由)
const rootDir = join(import.meta.dirname, '..')
app.use('/public/*', serveStatic({ root: rootDir }))

// 3. 注册功能模块
registerControllers(app)

// 4. 统一配置 OpenAPI 文档
isDev() && registerOpenAPI(app)

// 5. 全局错误与 404 处理
app.onError(errorHandler)
app.notFound(notFoundHandler)

/**
 * Bun 默认导出支持的配置类型（即 Bun.serve 的选项）
 * 包含 port、hostname、fetch、websocket、maxRequestBodySize、development 等
 * 使用：import type { ServeOptions } from 'app'
 */
export type ServeOptions = Parameters<typeof Bun.serve>[0]

const endpoint: ServeOptions = {
  fetch: app.fetch,
  port: parseInt(process.env.PORT || '3002'),
  websocket: websocket as any
}

export { app }
export default endpoint

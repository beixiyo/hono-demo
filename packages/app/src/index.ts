import { join } from 'node:path'
import { OpenAPIHono } from '@hono/zod-openapi'
import { serveStatic } from 'hono/bun'

import type { AppEnv } from './types'
import { registerMiddleware } from './core/middleware'
import { errorHandler, notFoundHandler } from './core/error-handler'
import { registerOpenAPI } from './core/openapi'

import { websocket } from 'hono/bun'
import { authModule } from './auth'
import { fileModule } from './file'
import { userModule } from './user'
import { sseModule } from './sse'
import { wsModule } from './websocket'

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
app.route('/auth', authModule)
app.route('/file', fileModule)
app.route('/users', userModule)
app.route('/sse', sseModule)
app.route('/ws', wsModule)

// 4. 统一配置 OpenAPI 文档
registerOpenAPI(app)

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
  port: 3001,
  websocket: websocket as any
}

export { app }
export default endpoint

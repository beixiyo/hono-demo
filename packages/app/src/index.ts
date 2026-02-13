import type { Container } from './core/di'
import type { AppEnv } from './types'
import { join } from 'node:path'
import { OpenAPIHono } from '@hono/zod-openapi'
import { serveStatic, websocket } from 'hono/bun'
import { isDev } from 'utils'
import { OPENAPI_CONFIG } from './core/constants'
import { registerControllers } from './core/controller'
import { errorHandler, notFoundHandler } from './core/error-handler'
import { registerMiddleware } from './core/middleware'
import { registerOpenAPI } from './core/openapi'
import { createContainer } from './register'
import { logger } from './utils'

/**
 * 创建应用实例：中间件、静态资源、路由、OpenAPI、错误处理
 */
function createApp(container: Container): OpenAPIHono<AppEnv> {
  const app = new OpenAPIHono<AppEnv>()

  registerMiddleware(app)

  const rootDir = join(import.meta.dirname, '..')
  app.use('/public/*', serveStatic({ root: rootDir }))

  registerControllers(app, { container })

  if (isDev())
    registerOpenAPI(app)

  app.onError(errorHandler)
  app.notFound(notFoundHandler)

  return app
}

/**
 * Bun 默认导出支持的配置类型（即 Bun.serve 的选项）
 * 包含 port、hostname、fetch、websocket、maxRequestBodySize、development 等
 * 使用：import type { ServeOptions } from 'app'
 */
export type ServeOptions = Parameters<typeof Bun.serve>[0]

/** 构建 Bun.serve 的配置 */
function createServeOptions(app: OpenAPIHono<AppEnv>): ServeOptions {
  return {
    fetch: app.fetch,
    port: Number.parseInt(process.env.PORT || '3002'),
    websocket: websocket as any,
  }
}

/**
 * 主流程：容器 → 应用 → 服务配置
 */
const container = createContainer()
const app = createApp(container)
const endpoint = createServeOptions(app)
logger.info(`Docs is running at http://localhost:${endpoint.port}${OPENAPI_CONFIG.uiPath}`)

export { app, createApp, createContainer, createServeOptions }
export default endpoint

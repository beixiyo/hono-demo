import type { AppEnv } from './types'
import { join } from 'node:path'
import { OpenAPIHono } from '@hono/zod-openapi'
import { serveStatic, websocket } from 'hono/bun'
import { isDev } from 'shared'
import { registerControllers } from './core/controller'
import { applyToContainer, Container } from './core/di'
import { errorHandler, notFoundHandler } from './core/error-handler'
import { registerMiddleware } from './core/middleware'
import { registerOpenAPI } from './core/openapi'
import { createPgDb, PgDbToken } from './db/client'
import { logger } from './utils'
import './register'

/** 创建并配置 DI 容器 */
function createContainer(): Container {
  const container = new Container()

  /**
   * 注册基础设施（数据库等）
   *
   * users 等表当前使用的是 `pgTable`，因此这里显式注册 PostgreSQL 版本的 Db。
   * 若未来需要 SQLite，可在此处额外注册 `SqliteDbToken`，并为其编写独立的 Repository / Service。
   */
  const db = createPgDb()
  container.register({ token: PgDbToken, useValue: db })

  applyToContainer(container)
  return container
}

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

/** 主流程：容器 → 应用 → 服务配置 */
const container = createContainer()
const app = createApp(container)
const endpoint = createServeOptions(app)
logger.info(`Server is running on port ${endpoint.port}`)

export { app, createApp, createContainer, createServeOptions }
export default endpoint

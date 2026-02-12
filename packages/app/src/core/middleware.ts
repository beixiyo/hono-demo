import type { OpenAPIHono } from '@hono/zod-openapi'
import type { AppEnv } from '../types'
import { cache } from 'hono/cache'
import { compress } from 'hono/compress'
import { cors } from 'hono/cors'
import { csrf } from 'hono/csrf'
import { etag } from 'hono/etag'
import { jwt } from 'hono/jwt'
import { logger } from 'hono/logger'
import { prettyJSON } from 'hono/pretty-json'
import { requestId } from 'hono/request-id'
import { secureHeaders } from 'hono/secure-headers'

const JWT_SECRET = process.env.JWT_SECRET || 'hono-demo-secret-change-in-production'
const JWT_PUBLIC_PATHS = new Set([
  '/api/auth/jwt/login',
])

export function registerMiddleware(app: OpenAPIHono<AppEnv>) {
  // 1. 基础与安全
  app.use('*', requestId())
  app.use('*', logger())
  app.use('*', cors())
  app.use('*', csrf())
  app.use('*', secureHeaders())
  app.use('*', prettyJSON())

  // 2. 性能优化
  app.use('*', compress())
  app.use('*', etag())

  // 3. 缓存 (仅 GET)
  // Bun test 环境下可能没有 Cache Storage API（caches），需要兜底避免告警/异常
  if (typeof (globalThis as any).caches !== 'undefined') {
    app.get('*', cache({ cacheName: 'my-app', cacheControl: 'max-age=3600' }))
  }

  // 4. JWT 校验（统一在此）
  const jwtMiddleware = jwt({ secret: JWT_SECRET, alg: 'HS256' })
  app.use('/api/*', async (c, next) => {
    if (JWT_PUBLIC_PATHS.has(c.req.path)) {
      return next()
    }

    return jwtMiddleware(c, next)
  })
}

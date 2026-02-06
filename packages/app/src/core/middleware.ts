import { OpenAPIHono } from '@hono/zod-openapi'
import type { AppEnv } from '../types'
import { logger } from 'hono/logger'
import { cors } from 'hono/cors'
import { csrf } from 'hono/csrf'
import { secureHeaders } from 'hono/secure-headers'
import { requestId } from 'hono/request-id'
import { prettyJSON } from 'hono/pretty-json'
import { etag } from 'hono/etag'
import { compress } from 'hono/compress'
import { cache } from 'hono/cache'
import { jwt } from 'hono/jwt'

export const registerMiddleware = (app: OpenAPIHono<AppEnv>) => {
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
  app.get('*', cache({ cacheName: 'my-app', cacheControl: 'max-age=3600' }))

  // 4. 认证 (示例路径保护)
  app.use('/api/protected/*', jwt({ secret: 'secret-key', alg: 'HS256' }))
}

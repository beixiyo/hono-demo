import { OpenAPIHono } from '@hono/zod-openapi'
import { Scalar } from '@scalar/hono-api-reference'
import type { AppEnv } from '../types'

export const registerOpenAPI = (app: OpenAPIHono<AppEnv>) => {
  app.doc('/doc', {
    openapi: '3.0.0',
    info: {
      version: '1.0.0',
      title: '模板项目 API',
      description: '一个遵循 CSS (Controller-Service-Schema) 模式的重构项目',
    },
  })

  app.get('/ui', Scalar({ url: '/doc', theme: 'deepSpace' }))
}

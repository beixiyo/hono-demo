import { createRoute } from '@hono/zod-openapi'
import { createSuccessSchema } from '../core/response'
import { ParamsSchema, UserSchema } from './schema'

export const getUserRoute = createRoute({
  method: 'get',
  path: '/{id}', // 注意：子模块挂载后，这里不需要 /users 前缀
  tags: ['用户管理'],
  summary: '获取用户信息',
  request: {
    params: ParamsSchema,
  },
  responses: {
    200: {
      content: { 'application/json': { schema: createSuccessSchema(UserSchema) } },
      description: '获取成功',
    },
  },
})

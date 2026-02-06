import { createRoute } from '@hono/zod-openapi'
import { LoginResponseSchema, MessageSchema, ProfileSchema } from './schema'

export const loginRoute = createRoute({
  method: 'post',
  path: '/jwt/login',
  tags: ['身份认证'],
  summary: 'JWT 登录',
  responses: {
    200: { content: { 'application/json': { schema: LoginResponseSchema } }, description: '成功' },
  },
})

export const protectedRoute = createRoute({
  method: 'get',
  path: '/jwt/protected',
  tags: ['身份认证'],
  summary: 'JWT 受保护接口',
  security: [{ Bearer: [] }],
  responses: {
    200: { content: { 'application/json': { schema: MessageSchema } }, description: '成功' },
    401: { description: '未授权' },
  },
})

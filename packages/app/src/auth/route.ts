import { createRoute } from '@hono/zod-openapi'
import { createErrorSchema, createSuccessSchema } from '../core/response'
import { LoginResponseSchema, MessageSchema } from './schema'

export const loginRoute = createRoute({
  method: 'post',
  path: '/jwt/login',
  tags: ['身份认证'],
  summary: 'JWT 登录',
  responses: {
    200: { content: { 'application/json': { schema: createSuccessSchema(LoginResponseSchema) } }, description: '成功' },
  },
})

export const protectedRoute = createRoute({
  method: 'get',
  path: '/jwt/protected',
  tags: ['身份认证'],
  summary: 'JWT 受保护接口',
  security: [{ Bearer: [] }],
  responses: {
    200: { content: { 'application/json': { schema: createSuccessSchema(MessageSchema) } }, description: '成功' },
    401: { content: { 'application/json': { schema: createErrorSchema() } }, description: '未授权' },
  },
})

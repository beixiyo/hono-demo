import { z } from '@hono/zod-openapi'

export const LoginResponseSchema = z.object({
  token: z.string().openapi({ example: 'eyJhbGciOiJIUzI1Ni...' }),
}).openapi('LoginResponse')

export const MessageSchema = z.object({
  message: z.string().openapi({ example: '成功' }),
  user: z.string().optional().openapi({ example: 'user123' }),
}).openapi('MessageResponse')

export const ProfileSchema = z.object({
  profile: z.object({
    userId: z.string(),
    name: z.string(),
  }),
}).openapi('ProfileResponse')

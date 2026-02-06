import type { RouteHandler } from '@hono/zod-openapi'
import type { AppEnv } from '../types'
import { authService } from './service'
import type { loginRoute, protectedRoute } from './route'

export const authController = {
  login: (async (c) => {
    const token = await authService.generateToken('user123')
    return c.json({ token }, 200)
  }) as RouteHandler<typeof loginRoute, AppEnv>,

  getProfile: (async (c) => {
    const payload = c.get('jwtPayload')
    return c.json({ message: '通过 JWT 验证', user: payload.sub }, 200)
  }) as RouteHandler<typeof protectedRoute, AppEnv>,
}

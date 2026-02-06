import type { RouteHandler } from '@hono/zod-openapi'
import type { AppEnv } from '../types'
import { authService } from './service'
import type { loginRoute, protectedRoute } from './route'
import { jsonOk } from '@/core/response'

export const authController = {
  login: (async (c) => {
    const token = await authService.generateToken('user123')
    return jsonOk(c, { token })
  }) as RouteHandler<typeof loginRoute, AppEnv>,

  getProfile: (async (c) => {
    const payload = c.get('jwtPayload')
    return jsonOk(c, { message: '通过 JWT 验证', user: payload.sub })
  }) as RouteHandler<typeof protectedRoute, AppEnv>,
}

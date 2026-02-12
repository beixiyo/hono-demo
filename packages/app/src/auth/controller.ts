import type { RouteHandler } from '@hono/zod-openapi'
import type { AppEnv } from '../types'
import { authService } from './service'
import { loginRoute, protectedRoute } from './route'
import { jsonOk } from '@/core/response'
import { Controller, Get, Post } from '../core/controller'

@Controller('/api/auth')
export class AuthController {
  @Post(loginRoute)
  async login(c: Parameters<RouteHandler<typeof loginRoute, AppEnv>>[0]): Promise<ReturnType<RouteHandler<typeof loginRoute, AppEnv>>> {
    const token = await authService.generateToken('user123')
    return jsonOk(c, { token }) as ReturnType<RouteHandler<typeof loginRoute, AppEnv>>
  }

  @Get(protectedRoute)
  async getProfile(c: Parameters<RouteHandler<typeof protectedRoute, AppEnv>>[0]): Promise<ReturnType<RouteHandler<typeof protectedRoute, AppEnv>>> {
    const payload = c.get('jwtPayload')
    return jsonOk(c, { message: '通过 JWT 验证', user: payload.sub }) as ReturnType<RouteHandler<typeof protectedRoute, AppEnv>>
  }
}

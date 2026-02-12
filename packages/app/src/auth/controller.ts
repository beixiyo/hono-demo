import type { LoginRouteContext, LoginRouteReturn, ProtectedRouteContext, ProtectedRouteReturn } from './route'
import { Controller, Get, Post } from '@/core/controller'
import { jsonOk } from '@/core/response'
import { Inject } from '../core/di'
import {
  loginRoute,

  protectedRoute,

} from './route'
import { AuthService } from './service'

@Controller('/api/auth')
export class AuthController {
  constructor(
    @Inject(AuthService) private readonly authService: AuthService,
  ) {}

  @Post(loginRoute)
  async login(c: LoginRouteContext): Promise<LoginRouteReturn> {
    const token = await this.authService.generateToken('user123')
    return jsonOk(c, { token }) as LoginRouteReturn
  }

  @Get(protectedRoute)
  async getProfile(c: ProtectedRouteContext): Promise<ProtectedRouteReturn> {
    const payload = c.get('jwtPayload')
    return jsonOk(c, { message: '通过 JWT 验证', user: payload.sub }) as ProtectedRouteReturn
  }
}

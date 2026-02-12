import type { RouteHandler } from '@hono/zod-openapi'
import type { AppEnv } from '../types'
import type { UserService } from './service'
import { Controller, Get } from '@/core/controller'
import { jsonOk } from '@/core/response'
import { Inject } from '../core/di'
import { getUserRoute } from './route'
import { UserServiceToken } from './tokens'

type GetUserHandler = RouteHandler<typeof getUserRoute, AppEnv>

@Controller('/api/users')
export class UserController {
  constructor(
    @Inject(UserServiceToken) private readonly userService: UserService,
  ) {}

  @Get(getUserRoute)
  async getUser(c: Parameters<GetUserHandler>[0]): Promise<ReturnType<GetUserHandler>> {
    const { id } = c.req.valid('param')
    const user = await this.userService.getUserById(id)
    return jsonOk(c, user) as ReturnType<GetUserHandler>
  }
}

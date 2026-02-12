import type { RouteHandler } from '@hono/zod-openapi'
import type { AppEnv } from '../types'
import { userService } from './service'
import { getUserRoute } from './route'
import { jsonOk } from '@/core/response'
import { Controller, Get } from '@/core/controller'

type GetUserHandler = RouteHandler<typeof getUserRoute, AppEnv>

@Controller('/api/users')
export class UserController {
  @Get(getUserRoute)
  async getUser(c: Parameters<GetUserHandler>[0]): Promise<ReturnType<GetUserHandler>> {
    const { id } = c.req.valid('param')
    const user = await userService.getUserById(id)
    return jsonOk(c, user) as ReturnType<GetUserHandler>
  }
}

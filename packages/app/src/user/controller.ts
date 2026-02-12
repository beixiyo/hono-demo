import type { GetUserRouteContext, GetUserRouteReturn } from './route'
import type { UserService } from './service'
import { Controller, Get } from '@/core/controller'
import { jsonOk } from '@/core/response'
import { Inject } from '../core/di'
import { getUserRoute } from './route'
import { UserServiceToken } from './tokens'

@Controller('/api/users')
export class UserController {
  constructor(
    @Inject(UserServiceToken) private readonly userService: UserService,
  ) {}

  @Get(getUserRoute)
  async getUser(c: GetUserRouteContext): Promise<GetUserRouteReturn> {
    const { id } = c.req.valid('param')
    const user = await this.userService.getUserById(id)
    return jsonOk(c, user) as GetUserRouteReturn
  }
}

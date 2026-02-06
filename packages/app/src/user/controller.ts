import type { RouteHandler } from '@hono/zod-openapi'
import type { AppEnv } from '../types'
import { userService } from './service'
import type { getUserRoute } from './route'

export const userController = {
  getUser: (async (c) => {
    const { id } = c.req.valid('param')
    const user = await userService.getUserById(id)
    return c.json(user, 200)
  }) as RouteHandler<typeof getUserRoute, AppEnv>,
}

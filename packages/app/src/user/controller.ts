import type { RouteHandler } from '@hono/zod-openapi'
import type { AppEnv } from '../types'
import { userService } from './service'
import type { getUserRoute } from './route'
import { jsonOk } from '@/core/response'

export const userController = {
  getUser: (async (c) => {
    const { id } = c.req.valid('param')
    const user = await userService.getUserById(id)
    return jsonOk(c, user)
  }) as RouteHandler<typeof getUserRoute, AppEnv>,
}

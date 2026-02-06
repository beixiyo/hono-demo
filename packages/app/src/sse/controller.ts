import { streamSSE } from 'hono/streaming'
import type { RouteHandler } from '@hono/zod-openapi'
import type { AppEnv } from '../types'
import type { sseRoute } from './route'

export const sseController = {
  events: (async (c) => {
    let count = 0
    return streamSSE(c, async (stream) => {
      let id = 0

      while (count < 5) {
        const message = `It is ${new Date().toISOString()} ${count++}`
        await stream.writeSSE({
          data: message,
          event: 'time-update',
          id: String(id++),
        })
        await stream.sleep(100)
      }
    })
  }) as RouteHandler<typeof sseRoute, AppEnv>,
}

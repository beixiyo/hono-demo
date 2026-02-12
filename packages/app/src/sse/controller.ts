import type { RouteHandler } from '@hono/zod-openapi'
import type { AppEnv } from '../types'
import { streamSSE } from 'hono/streaming'
import { Controller, Get } from '@/core/controller'
import { sseRoute } from './route'

type SseHandler = RouteHandler<typeof sseRoute, AppEnv>

@Controller('/api/sse')
export class SseController {
  @Get(sseRoute)
  async events(c: Parameters<SseHandler>[0]): Promise<ReturnType<SseHandler>> {
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
    }) as unknown as ReturnType<SseHandler>
  }
}

import type { SseRouteContext, SseRouteReturn } from './route'
import { streamSSE } from 'hono/streaming'
import { Controller, Get } from '@/core/controller'
import { sseRoute } from './route'

@Controller('/api/sse')
export class SseController {
  @Get(sseRoute)
  async events(c: SseRouteContext): Promise<SseRouteReturn> {
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
    }) as unknown as SseRouteReturn
  }
}

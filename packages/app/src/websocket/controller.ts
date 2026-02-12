import type { RouteHandler } from '@hono/zod-openapi'
import type { AppEnv } from '../types'
import { upgradeWebSocket } from 'hono/bun'
import { Controller, Get } from '@/core/controller'
import { wsRoute } from './route'

type WsHandler = RouteHandler<typeof wsRoute, AppEnv>

@Controller('/api/ws')
export class WsController {
  @Get(wsRoute)
  ws(c: Parameters<WsHandler>[0], next: Parameters<WsHandler>[1]): ReturnType<WsHandler> {
    return upgradeWebSocket((_c) => {
      return {
        onOpen(_event, ws) {
          console.log('WebSocket connection opened')
          ws.send('Hello from Hono WebSocket!')
        },
        onMessage(event, ws) {
          console.log(`Message from client: ${event.data}`)
          ws.send(`Echo: ${event.data}`)
        },
        onClose: () => {
          console.log('WebSocket connection closed')
        },
      }
    })(c, next) as ReturnType<WsHandler>
  }
}

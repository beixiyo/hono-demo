import type { WsRouteContext, WsRouteNext, WsRouteReturn } from './route'
import { upgradeWebSocket } from 'hono/bun'
import { Controller, Get } from '@/core/controller'
import { wsRoute } from './route'

@Controller('/api/ws')
export class WsController {
  @Get(wsRoute)
  ws(c: WsRouteContext, next: WsRouteNext): WsRouteReturn {
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
    })(c, next) as WsRouteReturn
  }
}

import { OpenAPIHono, createRoute,type RouteHandler } from '@hono/zod-openapi'
import { upgradeWebSocket } from 'hono/bun'
import type { AppEnv } from '../types'

export const wsModule = new OpenAPIHono<AppEnv>()

const wsRoute = createRoute({
  method: 'get',
  path: '/',
  tags: ['实时通信'],
  summary: 'WebSocket 连接端口',
  description: '通过此接口升级到 WebSocket 协议。支持 Echo 功能。请使用 ws:// 协议访问。',
  responses: {
    101: {
      description: '协议升级成功',
    },
  },
})

wsModule.openapi(
  wsRoute,
  upgradeWebSocket((c) => {
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
  }) as RouteHandler<typeof wsRoute, AppEnv>
)

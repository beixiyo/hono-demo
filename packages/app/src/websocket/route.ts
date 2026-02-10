import { createRoute } from '@hono/zod-openapi'

export const wsRoute = createRoute({
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

import type { Context } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { jsonFail } from './response'

export const errorHandler = (err: Error, c: Context) => {
  if (err instanceof HTTPException) {
    return jsonFail(c, err.message || '请求错误', err.status)
  }
  
  console.error(`${err.message}\n${err.stack}`)
  
  return jsonFail(c, err.message || 'Internal Server Error', 500)
}

export const notFoundHandler = (c: Context) => {
  return jsonFail(c, `Not Found - ${c.req.path}`, 404)
}

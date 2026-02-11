import type { Context } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { jsonFail } from './response'
import { MESSAGE_CONFIG } from '@/core/constants'

export const errorHandler = (err: Error, c: Context) => {
  if (err instanceof HTTPException) {
    return jsonFail(c, err.message || MESSAGE_CONFIG.errorDefault, err.status)
  }
  
  console.error(`${err.message}\n${err.stack}`)
  
  return jsonFail(c, err.message || MESSAGE_CONFIG.internalServerErrorDefault, 500)
}

export const notFoundHandler = (c: Context) => {
  return jsonFail(c, `${MESSAGE_CONFIG.notFoundPrefix}${c.req.path}`, 404)
}

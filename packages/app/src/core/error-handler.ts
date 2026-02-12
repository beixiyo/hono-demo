import type { Context } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { MESSAGE_CONFIG } from '@/core/constants'
import { logger } from '@/utils'
import { jsonFail } from './response'

export function errorHandler(err: Error, c: Context) {
  if (err instanceof HTTPException) {
    return jsonFail(c, err.message || MESSAGE_CONFIG.errorDefault, err.status)
  }

  logger.error(`${err.message}\n${err.stack}`)

  return jsonFail(c, err.message || MESSAGE_CONFIG.internalServerErrorDefault, 500)
}

export function notFoundHandler(c: Context) {
  return jsonFail(c, `${MESSAGE_CONFIG.notFoundPrefix}${c.req.path}`, 404)
}

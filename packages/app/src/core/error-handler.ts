import type { Context } from 'hono'
import { HTTPException } from 'hono/http-exception'

export const errorHandler = (err: Error, c: Context) => {
  if (err instanceof HTTPException) {
    return err.getResponse()
  }
  
  console.error(`${err.message}\n${err.stack}`)
  
  return c.json(
    {
      success: false,
      message: err.message || 'Internal Server Error',
      requestId: c.get('requestId'),
    },
    500
  )
}

export const notFoundHandler = (c: Context) => {
  return c.json(
    {
      success: false,
      message: `Not Found - ${c.req.path}`,
    },
    404
  )
}

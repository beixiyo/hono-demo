import type { Context } from 'hono'
import type { JsonOkOptions, ApiErrorResponse, ApiSuccessResponse } from '@/types'
import type { ContentfulStatusCode } from 'hono/utils/http-status'

export const jsonOk = <T>(
  c: Context,
  data: T,
  options?: JsonOkOptions
) => {
  const body: ApiSuccessResponse<T> = {
    success: true,
    message: options?.message ?? '成功',
    data,
    requestId: c.get('requestId'),
  }

  if (options?.pagination) {
    body.pagination = options.pagination
  }

  return c.json(body, { status: options?.status ?? 200 })
}

export const jsonFail = (
  c: Context,
  message: string,
  status = 400 as ContentfulStatusCode
) => {
  const body: ApiErrorResponse = {
    success: false,
    message,
    data: null,
    requestId: c.get('requestId'),
  }

  return c.json(body, { status })
}


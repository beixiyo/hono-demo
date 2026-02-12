import type { Context } from 'hono'
import type { ContentfulStatusCode } from 'hono/utils/http-status'
import type { ApiErrorResponse, ApiSuccessResponse, JsonOkOptions } from '@/types'
import { MESSAGE_CONFIG } from '@/core/constants'

export function jsonOk<T>(c: Context, data: T, options?: JsonOkOptions) {
  const body: ApiSuccessResponse<T> = {
    success: true,
    message: options?.message ?? MESSAGE_CONFIG.successDefault,
    data,
    requestId: c.get('requestId'),
  }

  if (options?.pagination) {
    body.pagination = options.pagination
  }

  return c.json(body, { status: options?.status ?? 200 })
}

export function jsonFail(c: Context, message: string, status = 400 as ContentfulStatusCode) {
  const body: ApiErrorResponse = {
    success: false,
    message,
    data: null,
    requestId: c.get('requestId'),
  }

  return c.json(body, { status })
}

import type { createRoute } from '@hono/zod-openapi'
import type { MethodName, RouteOptions } from './types'
import { addRoute } from './registry'

function createMethodDecorator(method: MethodName) {
  return function (pathOrRoute: string | ReturnType<typeof createRoute>, options?: RouteOptions) {
    return function (target: object, propertyKey: string | symbol) {
      if (typeof pathOrRoute === 'string') {
        const path = pathOrRoute
        const normalizedOptions = (options ?? {}) as RouteOptions

        addRoute(target, {
          method,
          path,
          options: normalizedOptions,
          handlerName: propertyKey.toString(),
        })
        return
      }

      const route = pathOrRoute
      addRoute(target, {
        route,
        handlerName: propertyKey.toString(),
      })
    }
  }
}

export const Get = createMethodDecorator('get')
export const Post = createMethodDecorator('post')
export const Put = createMethodDecorator('put')
export const Patch = createMethodDecorator('patch')
export const Delete = createMethodDecorator('delete')
export const Options = createMethodDecorator('options')

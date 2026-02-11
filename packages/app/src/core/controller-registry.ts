/**
 * 控制器注册表
 * 负责收集模块并统一装配到 Hono
 */
import { OpenAPIHono, createRoute } from '@hono/zod-openapi'
import type { AppEnv } from '../types'
import { CORE_CONFIG } from './constants';

const registry: ControllerEntry[] = []

export function Controller(basePath: string): ClassDecorator
export function Controller(options: ControllerOptions): ClassDecorator
export function Controller(param: string | ControllerOptions): ClassDecorator {
  const options = typeof param === 'string'
    ? { basePath: param }
    : param

  const decorator: ClassDecorator = (target) => {
    const controller = target as unknown as ControllerClass
    const module = options.module

    // 防止重复 basePath 注册
    if (registry.some(entry => entry.basePath === options.basePath)) {
      throw new Error(`Controller basePath 重复: ${options.basePath}`)
    }

    registry.push({ basePath: options.basePath, module, controller })
  }

  return decorator
}

export function registerControllers(app: OpenAPIHono<AppEnv>) {
  registry.forEach(entry => {
    const routes = getRoutes(entry.controller)
    const module = entry.module ?? (routes.length ? new OpenAPIHono<AppEnv>() : undefined)

    if (!module) {
      throw new Error(`Controller 缺少 module: ${entry.controller.name}`)
    }

    if (routes.length) {
      const instance = new entry.controller()

      routes.forEach(route => {
        // 由 packages/app/src/core/controller-registry.ts 装饰器收集的 route 对象
        const routeObject = 'route' in route
          ? route.route
          : createRoute({ method: route.method, path: route.path, ...route.options })

        const handler = instance[route.handlerName].bind(instance)
        module.openapi(routeObject, handler)
      })
    }

    app.route(entry.basePath, module)
  })
}

function getRoutes(target: ControllerClass): RouteMeta[] {
  return (target as any)[CORE_CONFIG.routesKey] ?? []
}

function addRoute(target: object, meta: RouteMeta) {
  const constructor = (target as any).constructor
  const routes = (constructor as any)[CORE_CONFIG.routesKey] ?? []
  routes.push(meta)
  ;(constructor as any)[CORE_CONFIG.routesKey] = routes
}

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

type ControllerEntry = {
  basePath: string
  module?: OpenAPIHono<AppEnv>
  controller: ControllerClass
}

type ControllerOptions = {
  basePath: string
  module?: OpenAPIHono<AppEnv>
}

type ControllerClass = new (...args: any[]) => any

type RouteConfig = Parameters<typeof createRoute>[0]
type RouteOptions = Omit<RouteConfig, 'method' | 'path'>
type MethodName = RouteConfig['method']
type RouteMeta =
  | { route: ReturnType<typeof createRoute>, handlerName: string }
  | { method: MethodName, path: string, options: RouteOptions, handlerName: string }

/**
 * 控制器注册表
 * 负责收集模块并统一装配到 Hono
 */
import { OpenAPIHono, createRoute } from '@hono/zod-openapi'
import type { AppEnv } from '../../types'
import { CORE_CONFIG } from '../constants'
import type { ControllerEntry, ControllerClass, ControllerOptions, RouteMeta, RegisterControllersOptions } from './types'

const registry: ControllerEntry[] = []

function getRoutes(target: ControllerClass): RouteMeta[] {
  return (target as any)[CORE_CONFIG.routesKey] ?? []
}

/** 供 decorators 使用，将路由元信息挂到 controller 上 */
export function addRoute(target: object, meta: RouteMeta) {
  const constructor = (target as any).constructor
  const routes = (constructor as any)[CORE_CONFIG.routesKey] ?? []
  routes.push(meta)
    ; (constructor as any)[CORE_CONFIG.routesKey] = routes
}

export function Controller(basePath: string): ClassDecorator
export function Controller(options: ControllerOptions): ClassDecorator
export function Controller(param: string | ControllerOptions): ClassDecorator {
  const options = typeof param === 'string' ? { basePath: param } : param

  const decorator: ClassDecorator = (target) => {
    const controller = target as unknown as ControllerClass
    const module = options.module

    if (registry.some((entry) => entry.basePath === options.basePath)) {
      throw new Error(`Controller basePath 重复: ${options.basePath}`)
    }

    registry.push({ basePath: options.basePath, module, controller })
  }

  return decorator
}

export function registerControllers(app: OpenAPIHono<AppEnv>, options?: RegisterControllersOptions) {
  const container = options?.container

  registry.forEach((entry) => {
    const routes = getRoutes(entry.controller)
    const module = entry.module ?? (routes.length ? new OpenAPIHono<AppEnv>() : undefined)

    if (!module) {
      throw new Error(`Controller 缺少 module: ${entry.controller.name}`)
    }

    if (routes.length) {
      // 由 core/controller/decorators.ts 装饰器收集的 route 对象
      const instance = container
        ? container.create(entry.controller)
        : new entry.controller()

      routes.forEach((route) => {
        const routeObject =
          'route' in route
            ? route.route
            : createRoute({ method: route.method, path: route.path, ...route.options })

        const handler = instance[route.handlerName].bind(instance)
        module.openapi(routeObject, handler)
      })
    }

    app.route(entry.basePath, module)
  })
}

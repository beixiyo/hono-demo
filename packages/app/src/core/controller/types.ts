import type { createRoute, OpenAPIHono } from '@hono/zod-openapi'
import type { AppEnv } from '../../types'
import type { Container } from '../di'

export type RouteConfig = Parameters<typeof createRoute>[0]
export type RouteOptions = Omit<RouteConfig, 'method' | 'path'>
export type MethodName = RouteConfig['method']

export type RouteMeta
  = | { route: ReturnType<typeof createRoute>, handlerName: string }
    | { method: MethodName, path: string, options: RouteOptions, handlerName: string }

export type ControllerClass = new (...args: any[]) => any

export type ControllerOptions = {
  basePath: string
  module?: OpenAPIHono<AppEnv>
}

export type ControllerEntry = {
  basePath: string
  module?: OpenAPIHono<AppEnv>
  controller: ControllerClass
}

export interface RegisterControllersOptions {
  /** 提供时，Controller 将由此容器按 @Inject 注入构造参数后创建 */
  container?: Container
}

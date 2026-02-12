import type { createRoute, OpenAPIHono, RouteHandler } from '@hono/zod-openapi'
import type { AppEnv } from '../../types'
import type { Container } from '../di'

/** 从 OpenAPI 路由推导出的 handler 上下文类型，用于 controller 方法参数 */
export type HandlerContext<R extends RouteConfig> = Parameters<RouteHandler<R, AppEnv>>[0]
/** 从 OpenAPI 路由推导出的 handler 的 next 参数（如 WebSocket 等需要 next 的路由） */
export type HandlerNext<R extends RouteConfig> = Parameters<RouteHandler<R, AppEnv>>[1]
/** 从 OpenAPI 路由推导出的 handler 返回类型，用于 controller 方法返回与断言 */
export type HandlerReturn<R extends RouteConfig> = ReturnType<RouteHandler<R, AppEnv>>

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

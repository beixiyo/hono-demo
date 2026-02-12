/**
 * 控制器模块
 * 提供类装饰器 Controller、方法装饰器 Get/Post 等，以及 registerControllers 装配入口
 */
export { Controller, registerControllers } from './registry'
export { Get, Post, Put, Patch, Delete, Options } from './decorators'

// 类型按需导出，供扩展或类型标注使用
export type { ControllerOptions, ControllerClass, RouteOptions, RouteMeta } from './types'

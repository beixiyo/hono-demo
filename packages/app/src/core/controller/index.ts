export { Delete, Get, Options, Patch, Post, Put } from './decorators'
/**
 * 控制器模块
 * 提供类装饰器 Controller、方法装饰器 Get/Post 等，以及 registerControllers 装配入口
 */
export { Controller, registerControllers } from './registry'

/** 类型按需导出，供扩展或类型标注使用 */
export type { ControllerClass, ControllerOptions, HandlerContext, HandlerNext, HandlerReturn, RouteMeta, RouteOptions } from './types'

/**
 * 依赖注入核心类型
 */

/** 可作为 Token 的类型：Symbol 或类（构造函数） */
export type Token<T = unknown> = symbol | (new (...args: any[]) => T) | (abstract new (...args: any[]) => T)

/** 生命周期：单例每次 resolve 同一实例，瞬态每次创建新实例 */
export type Scope = 'singleton' | 'transient'

/** 单条绑定配置（多参数时使用） */
export interface BindingOptions<T = unknown> {
  token: Token<T>
  useClass?: new (...args: any[]) => T
  useFactory?: () => T
  useValue?: T
  scope?: Scope
}

/** 内部存储的绑定 */
export interface Binding<T = unknown> {
  token: Token
  type: 'class' | 'factory' | 'value'
  useClass?: new (...args: any[]) => T
  useFactory?: () => T
  useValue?: T
  scope: Scope
  instance?: T
}

/** 待注册表条目（applyToContainer 前收集） */
export interface PendingEntry {
  token?: Token
  useClass: new (...args: any[]) => any
  /** 由 createInjectable(type) 派生装饰器填入，如 'service' / 'repository' */
  injectType?: string
}

/** 可注入装饰器类型（Injectable 或 createInjectable 返回值） */
export type InjectableDecorator = {
  (): ClassDecorator
  <T>(token: Token<T>): ClassDecorator
  /** 派生装饰器会带有 injectType 标识 */
  injectType?: string
}

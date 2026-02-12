import type { Container } from './container'
import type { InjectableDecorator, PendingEntry, Token } from './types'
/**
 * @Injectable 装饰器：标记类为可注入服务，并加入待注册表
 * 入口处调用 applyToContainer(container) 一次性将全部 @Injectable 类注册到容器
 *
 * 通过 createInjectable(type) 可派生出语义化装饰器，如 @Service、@Repository，
 * 派生装饰器会带有 DI_CONFIG.injectTypeKey 属性便于区分类型。
 */
import { DI_CONFIG } from '../constants'

const pending: PendingEntry[] = []

// --- 语义化派生装饰器（可选使用）---

export const Injectable = createInjectable('injectable')

/** 服务层：@Service() 或 @Service(Token) */
export const Service = createInjectable('service')

/** 仓储层：@Repository() 或 @Repository(Token) */
export const Repository = createInjectable('repository')

/**
 * 创建带语义类型的可注入装饰器。
 * 返回的装饰器行为与 Injectable 一致，但会带有 DI_CONFIG.injectTypeKey 属性，便于区分 @Service、@Repository 等。
 *
 * @example
 *   const Service = createInjectable('service')
 *   const Repository = createInjectable('repository')
 *   @Service(UserServiceToken) class UserService { ... }
 */
function createInjectable(injectType: string): InjectableDecorator {
  function decorator(): ClassDecorator
  function decorator<T>(token: Token<T>): ClassDecorator
  function decorator<T>(token?: Token<T>): ClassDecorator {
    return (target: object) => {
      const ctor = typeof target === 'function' ? target : (target as any).constructor
      pending.push({ token, useClass: ctor, injectType })
    }
  }
  const fn = decorator as InjectableDecorator
  fn.injectType = injectType
  ; (fn as unknown as Record<string, unknown>)[DI_CONFIG.injectTypeKey] = injectType
  return fn
}

/**
 * 将当前已收集的所有 @Injectable / @Service 等类注册到指定容器（通常在应用入口调用一次）
 */
export function applyToContainer(container: Container): void {
  for (const entry of pending) {
    const token = entry.token ?? entry.useClass
    container.register(token as Token, entry.useClass)
  }
  pending.length = 0
}

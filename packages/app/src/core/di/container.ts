import type { Binding, BindingOptions, Token } from './types'
import { DI_PARAM_TOKENS } from './inject'

/**
 * DI 容器
 * - 单参数：register(Class) / register(Token, Class) 等重载
 * - 多参数：register({ token, useClass?, useFactory?, useValue?, scope? })
 */
export class Container {
  private bindings = new Map<Token, Binding>()

  // --- register 重载声明 ---

  /** 注册：仅传实现类，Token 即该类自身 */
  register<T>(useClass: new (...args: any[]) => T): this

  /** 注册：Token + 实现类 */
  register<T>(token: Token<T>, useClass: new (...args: any[]) => T): this

  /** 注册：Token + 工厂 */
  register<T>(token: Token<T>, useFactory: () => T): this

  /** 注册：Token + 常值 */
  register<T>(token: Token<T>, useValue: T): this

  /** 注册：配置项（多参） */
  register<T>(options: BindingOptions<T>): this

  register<T>(
    tokenOrClassOrOptions:
      | Token<T>
      | (new (...args: any[]) => T)
      | BindingOptions<T>,
    useClassOrFactoryOrValue?: (new (...args: any[]) => T) | (() => T) | T,
  ): this {
    /** 分支 1：多参形式 register({ token, useClass?, useFactory?, useValue?, scope? }) */
    if (
      typeof tokenOrClassOrOptions === 'object'
      && tokenOrClassOrOptions !== null
      && 'token' in tokenOrClassOrOptions
    ) {
      const opts = tokenOrClassOrOptions as BindingOptions<T>
      const { token, useClass, useFactory, useValue, scope = 'singleton' } = opts

      const type
        = useValue !== undefined
          ? 'value'
          : useFactory !== undefined
            ? 'factory'
            : 'class'

      if (type === 'class' && !useClass)
        throw new Error(`Binding token ${String(token)}: useClass required`)
      if (type === 'factory' && !useFactory)
        throw new Error(`Binding token ${String(token)}: useFactory required`)

      this.bindings.set(token, {
        token,
        type,
        useClass,
        useFactory,
        useValue,
        scope,
      })
      return this
    }

    /** 分支 2：双参形式 register(token, xxx) 或 单参 register(Class) */
    const token = tokenOrClassOrOptions as Token<T> | (new (...args: any[]) => T)
    const second = useClassOrFactoryOrValue

    if (second === undefined) {
      // register(Class) → token = Class, useClass = Class
      if (typeof token !== 'function')
        throw new Error('register(Class) requires a constructor')

      this.bindings.set(token, {
        token: token as Token,
        type: 'class',
        useClass: token as new (...args: any[]) => T,
        scope: 'singleton',
      })
      return this
    }

    if (typeof second === 'function') {
      const isConstructor
        = typeof second.prototype?.constructor === 'function'
          && second.prototype.constructor === second

      if (isConstructor) {
        this.bindings.set(token, {
          token: token as Token,
          type: 'class',
          useClass: second as new (...args: any[]) => T,
          scope: 'singleton',
        })
      }
      else {
        this.bindings.set(token, {
          token: token as Token,
          type: 'factory',
          useFactory: second as () => T,
          scope: 'singleton',
        })
      }
      return this
    }

    // second 是常值
    this.bindings.set(token, {
      token: token as Token,
      type: 'value',
      useValue: second as T,
      scope: 'singleton',
    })
    return this
  }

  /**
   * 解析：根据 Token 获取实例（单例会复用）
   */
  resolve<T>(token: Token<T>): T {
    const binding = this.bindings.get(token as Token)
    if (!binding)
      throw new Error(`No binding for token: ${String(token)}`)

    if (binding.type === 'value')
      return binding.useValue as T

    if (binding.scope === 'singleton' && binding.instance !== undefined)
      return binding.instance as T

    let instance: T

    if (binding.type === 'class') {
      const Ctor = binding.useClass!
      const paramTokens: (Token | undefined)[]
        = (Ctor as any)[DI_PARAM_TOKENS] ?? []
      const deps = paramTokens.map(t =>
        t != null
          ? this.resolve(t)
          : undefined,
      )
      instance = new Ctor(...deps) as T
    }
    else {
      instance = binding.useFactory!() as T
    }

    if (binding.scope === 'singleton')
      binding.instance = instance

    return instance
  }

  /**
   * 创建：解析目标类的构造参数并实例化（用于 Controller 等）
   */
  create<T>(Constructor: new (...args: any[]) => T): T {
    const paramTokens: (Token | undefined)[]
      = (Constructor as any)[DI_PARAM_TOKENS] ?? []
    const deps = paramTokens.map(t =>
      t != null
        ? this.resolve(t)
        : undefined,
    )
    return new Constructor(...deps) as T
  }
}

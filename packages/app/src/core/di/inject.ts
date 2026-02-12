/**
 * @Inject(Token) 参数装饰器
 * 将构造参数与 Token 关联，供 Container.create() 解析依赖
 */
import type { Token } from './types'

/** 存在构造函数上的参数 Token 列表，按参数下标排列 */
export const DI_PARAM_TOKENS = Symbol('di:paramTokens')

export function Inject<T>(token: Token<T>): ParameterDecorator {
  return (target: object, _propertyKey: string | symbol | undefined, parameterIndex: number) => {
    const ctor = typeof target === 'function' ? target : (target as object).constructor
    const tokens: (Token | undefined)[] = (ctor as any)[DI_PARAM_TOKENS] ?? []
    tokens[parameterIndex] = token
    ;(ctor as any)[DI_PARAM_TOKENS] = tokens
  }
}

export const CORE_CONFIG = {
  routesKey: Symbol('controller:routes'),
} as const

/** 依赖注入相关常量 */
export const DI_CONFIG = {
  /** 派生装饰器类型标识在装饰器 / 待注册条目上的属性名 */
  injectTypeKey: '__@inject_type',
} as const

export const JWT_CONFIG = {
  /**
   * 过期时间（单位 s），即一小时
   */
  expSeconds: 60 * 60,
  secret: process.env.JWT_SECRET || 'hono-demo-secret-change-in-production',
} as const

export const AUTH_CONFIG = {
  defaultUserRole: 'admin',
} as const

export const OPENAPI_CONFIG = {
  version: '3.0.0',
  info: {
    version: '1.0.0',
    title: '模板项目 API',
    description: '',
  },
  docPath: '/doc',
  uiPath: '/ui',
} as const

export const SCALAR_CONFIG = {
  theme: 'deepSpace' as const,
  persistAuth: true,
  preferredSecurityScheme: '',
  httpBearerName: 'HTTP Bearer',
  // 仅用于文档示例展示
  demoBearerToken: 'eyJhbGciO...',
} as const

export const MESSAGE_CONFIG = {
  successDefault: '成功',
  errorDefault: '请求错误',
  internalServerErrorDefault: 'Internal Server Error',
  notFoundPrefix: 'Not Found - ',
} as const

export const TEST_CONFIG = {
  origin: 'http://localhost',
} as const

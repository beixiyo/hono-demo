# 项目规范（Agent 参考）

## 技术栈

- **运行时**: Bun
- **框架**: Hono + @hono/zod-openapi
- **DI**: 自研容器（`src/core/di`）
- **路由**: 基于 Controller 注册（`src/core/controller`）

## 目录约定

- `packages/app`：主应用（路由、业务、中间件、错误处理）
- `packages/shared`：共享工具与类型
- 业务按模块划分：`auth`、`user`、`file`、`sse`、`websocket` 等，每模块含 `controller`、`route`、`service`、`schema` 等

## 日志

**统一使用** `src/utils` 的 logger（`@/utils`）：

```ts
import { logger } from '@/utils'
```

该 logger 基于 `@jl-org/log/node` 的 `NodeLogger`，前缀为 `App`。项目内勿另建日志实例

## 其他

- 环境变量与类型见 `src/types/env.ts`、`packages/shared`
- 错误处理与 OpenAPI 在 `src/core`

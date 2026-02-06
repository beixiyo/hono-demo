# Hono Demo Monorepo

基于 **Bun workspaces** 的 monorepo 示例，包含应用包与共享包。

## 结构

```
.
├── package.json          # 根配置，workspaces: ["packages/*"]
├── packages/
│   ├── app/              # Hono 应用，依赖 shared
│   └── shared/           # 共享逻辑，供 app 通过 workspace:* 引用
```

## 前置要求

- [Bun](https://bun.sh) 已安装（`curl -fsSL https://bun.sh/install | bash`）

## 安装

在仓库根目录执行：

```bash
bun install
```

会为所有 workspace 安装依赖并链接 `@hono-demo/shared` 到 `@hono-demo/app`。

## 常用命令

| 命令 | 说明 |
|------|------|
| `bun run dev` | 在 app 中运行开发服务（需在 packages/app 下或使用 --filter） |
| `bun run --filter @hono-demo/app dev` | 从根目录启动 app 开发服务 |
| `bun run --filter '*' build` | 构建所有包 |
| `bun run --filter '*' test` | 运行所有包的测试 |

进入某个包目录后可直接使用该包的脚本：

```bash
cd packages/app && bun run dev   # 启动 Hono，默认 http://localhost:3000
cd packages/shared && bun test   # 运行 shared 的测试
```

## 添加新包

1. 在 `packages/` 下新建目录，并添加 `package.json`（`name` 建议用 `@hono-demo/xxx`）。
2. 若需依赖其他 workspace，在 dependencies 中使用 `"@hono-demo/yyy": "workspace:*"`。
3. 在根目录执行 `bun install`。

## 参考

- [Bun - Configuring a monorepo using workspaces](https://bun.sh/docs/guides/install/workspaces)
- [Bun - Filter (run scripts in workspaces)](https://bun.sh/docs/pm/filter)

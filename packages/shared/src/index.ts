/**
 * 共享工具/类型 - 可被其他 workspace 通过 workspace:* 引用
 */
export function greet(name: string): string {
  return `Hello, ${name}!`;
}

import { describe, expect, test } from "bun:test";
import { greet } from "./index";

describe("greet", () => {
  test("returns greeting with name", () => {
    expect(greet("Bun")).toBe("Hello, Bun!");
  });
});

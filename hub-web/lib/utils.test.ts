import { describe, it, expect } from "vitest";

// Example utility function to test
export function formatLatency(ms: number): string {
  if (ms < 1) return `${(ms * 1000).toFixed(0)}μs`;
  if (ms < 1000) return `${ms.toFixed(1)}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

export function calculateSpeedup(baseline: number, optimized: number): string {
  const speedup = baseline / optimized;
  return `${speedup.toFixed(2)}x`;
}

describe("formatLatency", () => {
  it("formats microseconds correctly", () => {
    expect(formatLatency(0.5)).toBe("500μs");
    expect(formatLatency(0.123)).toBe("123μs");
  });

  it("formats milliseconds correctly", () => {
    expect(formatLatency(1.5)).toBe("1.5ms");
    expect(formatLatency(123.456)).toBe("123.5ms");
  });

  it("formats seconds correctly", () => {
    expect(formatLatency(1500)).toBe("1.50s");
    expect(formatLatency(5000)).toBe("5.00s");
  });
});

describe("calculateSpeedup", () => {
  it("calculates speedup correctly", () => {
    expect(calculateSpeedup(100, 50)).toBe("2.00x");
    expect(calculateSpeedup(100, 25)).toBe("4.00x");
    expect(calculateSpeedup(100, 100)).toBe("1.00x");
  });
});

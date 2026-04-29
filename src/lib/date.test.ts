import { describe, expect, it } from "vitest";
import { addDays, daysBetween, daysUntil } from "./date";

describe("date helpers", () => {
  it("adds days using local calendar dates", () => {
    expect(addDays("2026-04-24", 14)).toBe("2026-05-08");
  });

  it("calculates day differences", () => {
    expect(daysBetween("2026-04-24", "2026-04-24")).toBe(0);
    expect(daysUntil("2026-05-01", "2026-04-24")).toBe(7);
    expect(daysUntil("2026-04-20", "2026-04-24")).toBe(-4);
  });
});

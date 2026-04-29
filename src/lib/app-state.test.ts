import { describe, expect, it } from "vitest";
import { createDefaultState, serializeExport, validateImportedState } from "./app-state";

describe("app state import and export", () => {
  it("validates v2 exports", () => {
    const state = createDefaultState(new Date(2026, 3, 24));

    expect(validateImportedState(state)).toEqual(state);
  });

  it("rejects invalid imports", () => {
    expect(() => validateImportedState({ version: 1 })).toThrow(
      "This file is not a valid Japan Foreigner Survival export.",
    );
  });

  it("adds a privacy note to exported data", () => {
    const exported = serializeExport(createDefaultState(new Date(2026, 3, 24)));

    expect(exported).toContain("privacyNote");
    expect(exported).toContain("residence-card images");
  });
});

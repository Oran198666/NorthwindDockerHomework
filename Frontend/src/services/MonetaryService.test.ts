import { describe, it, expect } from "vitest";
import { monetaryService } from "./monetary-service";

describe("MonetaryService", () => {
  // Verifies the service module is loaded and instantiated properly.
  it("exists and exposes getVat", () => {
    expect(monetaryService).toBeTruthy();
    expect(typeof monetaryService.getVat).toBe("function");
  });

  describe("getVat", () => {
    // Tests the standard happy path to ensure basic percentage calculation works properly.
    it("calculates standard VAT correctly", () => {
      const result = monetaryService.getVat(100, 18);
      expect(result).toBe(18);
    });

    // Verifies that a zero price results in zero VAT without causing arithmetic errors.
    it("returns 0 when the price is 0", () => {
      expect(monetaryService.getVat(0, 18)).toBe(0);
    });

    // Verifies that a zero rate/percentage yields zero VAT.
    it("returns 0 when the percentage is 0", () => {
      expect(monetaryService.getVat(100, 0)).toBe(0);
    });

    // Ensures floating-point precision issues are safely handled during decimal calculations.
    it("handles decimal percentages and prices correctly", () => {
      expect(monetaryService.getVat(19.99, 18)).toBeCloseTo(3.5982,4);
    });
  });
});
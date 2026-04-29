import { describe, expect, it } from "vitest";
import { calculateMoveInCosts, defaultMoneyCheck } from "./money";

describe("move-in cost calculator", () => {
  it("calculates upfront rental costs and affordability", () => {
    const result = calculateMoveInCosts({
      ...defaultMoneyCheck,
      monthlyRent: 100000,
      managementFee: 10000,
      monthlyIncome: 400000,
      depositMonths: 1,
      keyMoneyMonths: 1,
      agencyFeeMonths: 1.1,
      guarantorFeeMonths: 0.5,
      insuranceFee: 20000,
      lockExchangeFee: 15000,
      cleaningFee: 30000,
      otherFee: 0,
      moveInDay: 1,
      includeNextMonthRent: true,
    });

    expect(result.monthlyHousingCost).toBe(110000);
    expect(result.deposit).toBe(100000);
    expect(result.keyMoney).toBe(100000);
    expect(result.agencyFee).toBe(110000);
    expect(result.guarantorFee).toBe(50000);
    expect(result.upfrontTotal).toBe(645000);
    expect(result.affordabilityStatus).toBe("comfortable");
  });

  it("flags high rent relative to income", () => {
    const result = calculateMoveInCosts({
      ...defaultMoneyCheck,
      monthlyRent: 120000,
      managementFee: 10000,
      monthlyIncome: 250000,
    });

    expect(result.affordabilityStatus).toBe("risky");
  });
});

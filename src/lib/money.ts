import type { MoneyCheck } from "./types";

export const defaultMoneyCheck: MoneyCheck = {
  monthlyRent: 80000,
  managementFee: 5000,
  monthlyIncome: 280000,
  depositMonths: 1,
  keyMoneyMonths: 1,
  agencyFeeMonths: 1.1,
  guarantorFeeMonths: 0.5,
  insuranceFee: 20000,
  lockExchangeFee: 16500,
  cleaningFee: 33000,
  otherFee: 0,
  moveInDay: 1,
  includeNextMonthRent: true,
};

export type MoveInCostBreakdown = {
  monthlyHousingCost: number;
  proratedFirstMonthRent: number;
  nextMonthRent: number;
  deposit: number;
  keyMoney: number;
  agencyFee: number;
  guarantorFee: number;
  insuranceFee: number;
  lockExchangeFee: number;
  cleaningFee: number;
  otherFee: number;
  refundableEstimate: number;
  nonRefundableEstimate: number;
  upfrontTotal: number;
  upfrontMonths: number;
  rentToIncomeRatio: number | null;
  affordabilityStatus: "comfortable" | "tight" | "risky" | "unknown";
};

function yen(value: number) {
  return Math.max(0, Math.round(value));
}

export function calculateMoveInCosts(input: MoneyCheck): MoveInCostBreakdown {
  const monthlyHousingCost = yen(input.monthlyRent + input.managementFee);
  const safeMoveInDay = Math.min(Math.max(input.moveInDay, 1), 31);
  const daysRemaining = 32 - safeMoveInDay;
  const proratedFirstMonthRent = yen((monthlyHousingCost * daysRemaining) / 31);
  const nextMonthRent = input.includeNextMonthRent ? monthlyHousingCost : 0;
  const deposit = yen(input.monthlyRent * input.depositMonths);
  const keyMoney = yen(input.monthlyRent * input.keyMoneyMonths);
  const agencyFee = yen(input.monthlyRent * input.agencyFeeMonths);
  const guarantorFee = yen(input.monthlyRent * input.guarantorFeeMonths);

  const upfrontTotal = yen(
    proratedFirstMonthRent +
      nextMonthRent +
      deposit +
      keyMoney +
      agencyFee +
      guarantorFee +
      input.insuranceFee +
      input.lockExchangeFee +
      input.cleaningFee +
      input.otherFee,
  );

  const rentToIncomeRatio =
    input.monthlyIncome > 0 ? monthlyHousingCost / input.monthlyIncome : null;
  const affordabilityStatus =
    rentToIncomeRatio === null
      ? "unknown"
      : rentToIncomeRatio <= 0.3
        ? "comfortable"
        : rentToIncomeRatio <= 0.4
          ? "tight"
          : "risky";

  return {
    monthlyHousingCost,
    proratedFirstMonthRent,
    nextMonthRent,
    deposit,
    keyMoney,
    agencyFee,
    guarantorFee,
    insuranceFee: yen(input.insuranceFee),
    lockExchangeFee: yen(input.lockExchangeFee),
    cleaningFee: yen(input.cleaningFee),
    otherFee: yen(input.otherFee),
    refundableEstimate: deposit,
    nonRefundableEstimate: yen(upfrontTotal - deposit),
    upfrontTotal,
    upfrontMonths: monthlyHousingCost > 0 ? upfrontTotal / monthlyHousingCost : 0,
    rentToIncomeRatio,
    affordabilityStatus,
  };
}

export const rentalGlossary = [
  {
    term: "Key money",
    japanese: "reikin",
    meaning: "A non-refundable payment to the landlord. It is common but many listings are zero-key-money.",
    normalCheck: "Often 0-2 months of rent. Ask whether it can be reduced.",
  },
  {
    term: "Deposit",
    japanese: "shikikin",
    meaning: "Money held for unpaid rent or move-out deductions. Any remaining balance should be returned.",
    normalCheck: "Often 0-2 months of rent. Ask for an itemized statement at move-out.",
  },
  {
    term: "Agency fee",
    japanese: "chukai tesuryo",
    meaning: "Fee paid to the real estate agency for arranging the contract.",
    normalCheck: "Often up to about 1 month of rent plus tax.",
  },
  {
    term: "Guarantor company",
    japanese: "hosho gaisha",
    meaning:
      "A company that guarantees payment to the landlord if you do not pay. It protects the landlord, not you.",
    normalCheck: "Often around 0.5-1 month upfront plus renewal or annual fees.",
  },
  {
    term: "Fire insurance",
    japanese: "kasai hoken",
    meaning: "Insurance commonly required by rental contracts.",
    normalCheck: "Often a fixed fee for the contract period. Confirm coverage and renewal timing.",
  },
  {
    term: "Renewal fee",
    japanese: "koshin-ryo",
    meaning: "Fee charged when renewing some rental contracts, commonly every two years.",
    normalCheck: "Confirm before signing. Some listings advertise no renewal fee.",
  },
] as const;

export const moneyDataSources = [
  {
    name: "Statistics Dashboard API",
    bestFor: "City and prefecture statistics without user registration.",
    url: "https://dashboard.e-stat.go.jp/en/static/api",
  },
  {
    name: "e-Stat API",
    bestFor: "Official labor/wage and housing datasets after issuing an app ID.",
    url: "https://www.e-stat.go.jp/api/en",
  },
] as const;

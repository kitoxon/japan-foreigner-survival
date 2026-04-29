export const mistakeAlerts = [
  {
    id: "resident-tax-jan-1",
    title: "Jan 1 resident tax trap",
    severity: "High cost",
    body:
      "If you are registered as living in a municipality on January 1, resident tax can follow you later based on the previous year's income. Plan before leaving Japan or changing address near year-end.",
    sourceLabel: "Chuo City tax guide",
    sourceUrl: "https://www.city.chuo.lg.jp/en/insuranceandtax/tax.html",
  },
  {
    id: "leaving-tax-agent",
    title: "Leaving Japan can still leave tax work behind",
    severity: "Before departure",
    body:
      "If you leave Japan while tax procedures remain, you may need to appoint a tax agent or file before departure. Do not wait until the airport week.",
    sourceLabel: "National Tax Agency",
    sourceUrl: "https://www.nta.go.jp/english/taxes/individual/12004.htm",
  },
  {
    id: "rent-upfront-fees",
    title: "A cheap rent listing can still need huge cash upfront",
    severity: "Before signing",
    body:
      "Key money, deposit, agency fee, guarantor company fee, insurance, cleaning, lock exchange, and next month's rent can turn one apartment into several months of cash before keys.",
    sourceLabel: "Move-in calculator",
    sourceUrl: "#move-in-calculator",
  },
  {
    id: "moving-notifications",
    title: "Moving means paperwork, not just boxes",
    severity: "14-day risk",
    body:
      "When you move, city/ward procedures affect your resident record, health insurance, My Number mail, and future tax notices. Some move-in procedures are time-sensitive.",
    sourceLabel: "Digital Agency moving service",
    sourceUrl: "https://www.digital.go.jp/en/policies/moving_onestop_service/faq-01",
  },
];

export const survivalTimelines = [
  {
    id: "before-arrival",
    title: "Before arrival",
    focus: "Cash, housing, documents",
    items: [
      "Estimate apartment upfront costs before you choose a listing.",
      "Prepare residence-card, passport, work/school, and address documents.",
      "Check whether your first salary timing creates a cash gap.",
    ],
  },
  {
    id: "first-90-days",
    title: "First 90 days",
    focus: "Address, insurance, bank, phone",
    items: [
      "Register your address after settling into a place.",
      "Confirm health insurance and pension handling.",
      "Open phone and bank access so later procedures become easier.",
    ],
  },
  {
    id: "job-or-school-change",
    title: "Job or school change",
    focus: "Immigration, income, insurance",
    items: [
      "Check whether your status of residence still matches the new activity.",
      "Confirm employer/school handling for insurance, pension, and taxes.",
      "Save documents that may matter at renewal time.",
    ],
  },
  {
    id: "leaving-japan",
    title: "Leaving Japan",
    focus: "Taxes, contracts, city office",
    items: [
      "Settle apartment, utilities, phone, and banking before departure.",
      "Handle moving-out notification and tax representative needs.",
      "Do not assume resident tax disappears after leaving.",
    ],
  },
];

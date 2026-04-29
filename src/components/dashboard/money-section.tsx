"use client";

import { Calculator, ExternalLink, Home } from "lucide-react";
import type { MoveInCostBreakdown } from "@/lib/money";
import { moneyDataSources, rentalGlossary } from "@/lib/money";
import type { MoneyCheck } from "@/lib/types";
import { formatYen, NumberInput } from "./shared";

export function MoneyCalculator({
  id,
  moneyCheck,
  costs,
  onChange,
}: {
  id?: string;
  moneyCheck: MoneyCheck;
  costs: MoveInCostBreakdown;
  onChange: (patch: Partial<MoneyCheck>) => void;
}) {
  return (
    <section id={id} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Calculator size={18} className="text-teal-700" />
            <h2 className="font-semibold">Move-in cost calculator</h2>
          </div>
          <p className="mt-1 text-sm text-slate-600">
            Check key money, guarantor fees, insurance, and whether rent fits your income.
          </p>
        </div>
        <span className="rounded-md bg-teal-50 px-2 py-1 text-xs font-medium text-teal-700">
          Editable estimate
        </span>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_320px]">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <NumberInput label="Monthly rent" value={moneyCheck.monthlyRent} onChange={(value) => onChange({ monthlyRent: value })} />
          <NumberInput label="Management fee" value={moneyCheck.managementFee} onChange={(value) => onChange({ managementFee: value })} />
          <NumberInput label="Monthly income" value={moneyCheck.monthlyIncome} onChange={(value) => onChange({ monthlyIncome: value })} />
          <NumberInput label="Deposit months" value={moneyCheck.depositMonths} step="0.5" onChange={(value) => onChange({ depositMonths: value })} />
          <NumberInput label="Key money months" value={moneyCheck.keyMoneyMonths} step="0.5" onChange={(value) => onChange({ keyMoneyMonths: value })} />
          <NumberInput label="Agency fee months" value={moneyCheck.agencyFeeMonths} step="0.1" onChange={(value) => onChange({ agencyFeeMonths: value })} />
          <NumberInput label="Guarantor fee months" value={moneyCheck.guarantorFeeMonths} step="0.1" onChange={(value) => onChange({ guarantorFeeMonths: value })} />
          <NumberInput label="Fire insurance" value={moneyCheck.insuranceFee} onChange={(value) => onChange({ insuranceFee: value })} />
          <NumberInput label="Lock exchange" value={moneyCheck.lockExchangeFee} onChange={(value) => onChange({ lockExchangeFee: value })} />
          <NumberInput label="Cleaning fee" value={moneyCheck.cleaningFee} onChange={(value) => onChange({ cleaningFee: value })} />
          <NumberInput label="Other fees" value={moneyCheck.otherFee} onChange={(value) => onChange({ otherFee: value })} />
          <NumberInput label="Move-in day" value={moneyCheck.moveInDay} min="1" max="31" onChange={(value) => onChange({ moveInDay: value })} />
          <label className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
            <span className="flex items-center gap-2 font-medium text-slate-800">
              <input
                type="checkbox"
                checked={moneyCheck.includeNextMonthRent}
                onChange={(event) => onChange({ includeNextMonthRent: event.target.checked })}
                className="h-4 w-4"
              />
              Include next month rent in estimate
            </span>
            <span className="mt-1 block text-xs leading-5 text-slate-500">
              Some contracts require next month&apos;s full rent before keys.
            </span>
            <span
              className={`mt-2 block w-fit rounded-md px-2 py-1 text-xs font-semibold ${
                moneyCheck.includeNextMonthRent
                  ? "bg-teal-50 text-teal-700"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              {moneyCheck.includeNextMonthRent
                ? `Included: +${formatYen(costs.nextMonthRent)}`
                : "Not included"}
            </span>
          </label>
        </div>

        <div className="space-y-3">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs font-medium uppercase text-slate-500">Estimated cash before keys</p>
            <p className="mt-1 text-2xl font-semibold">{formatYen(costs.upfrontTotal)}</p>
            <div className="mt-3 space-y-1 border-t border-slate-200 pt-3 text-sm text-slate-600">
              <CostRow label="Move-in month rent" value={costs.proratedFirstMonthRent} />
              <CostRow
                label="Next month rent"
                value={costs.nextMonthRent}
                muted={!moneyCheck.includeNextMonthRent}
              />
              <CostRow label="Deposit" value={costs.deposit} />
              <CostRow label="Key money" value={costs.keyMoney} />
              <CostRow label="Agency fee" value={costs.agencyFee} />
              <CostRow label="Guarantor fee" value={costs.guarantorFee} />
              <CostRow label="Insurance / lock / cleaning / other" value={costs.insuranceFee + costs.lockExchangeFee + costs.cleaningFee + costs.otherFee} />
            </div>
            <div className="mt-3 border-t border-slate-200 pt-3 text-sm text-slate-600">
              <p>Refundable estimate: {formatYen(costs.refundableEstimate)}</p>
              <p>Non-refundable estimate: {formatYen(costs.nonRefundableEstimate)}</p>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-3">
            <p className="font-semibold">Affordability</p>
            <p className="mt-1 text-sm text-slate-600">
              Monthly housing: {formatYen(costs.monthlyHousingCost)}
            </p>
            <p className="text-sm text-slate-600">
              Rent-to-income:{" "}
              {costs.rentToIncomeRatio === null
                ? "Add income"
                : `${Math.round(costs.rentToIncomeRatio * 100)}%`}
            </p>
            <p className={`mt-2 w-fit rounded-md px-2 py-1 text-xs font-semibold ${affordabilityClass(costs.affordabilityStatus)}`}>
              {affordabilityLabel(costs.affordabilityStatus)}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function RentalInsights() {
  return (
    <section className="grid gap-4 xl:grid-cols-[1fr_320px]">
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <Home size={18} className="text-teal-700" />
          <h2 className="font-semibold">Rental fee glossary</h2>
        </div>
        <div className="mt-3 grid gap-2 md:grid-cols-2">
          {rentalGlossary.map((item) => (
            <article key={item.term} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <p className="font-semibold">{item.term}</p>
              <p className="mt-1 text-xs font-medium uppercase text-slate-500">{item.japanese}</p>
              <p className="mt-2 text-sm leading-5 text-slate-600">{item.meaning}</p>
              <p className="mt-2 text-sm leading-5 text-slate-700">{item.normalCheck}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="font-semibold">Coming next: local data</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Planned upgrades: salary ranges, city cost signals, and address lookup from trusted
          public data.
        </p>
        <div className="mt-3 space-y-2">
          {moneyDataSources.map((source) => (
            <a
              key={source.name}
              href={source.url}
              target="_blank"
              rel="noreferrer"
              className="block rounded-lg border border-slate-200 p-3 hover:border-teal-300 hover:bg-teal-50"
            >
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-teal-700">
                {source.name}
                <ExternalLink size={13} />
              </span>
              <p className="mt-1 text-sm leading-5 text-slate-600">{source.bestFor}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function CostRow({
  label,
  value,
  muted = false,
}: {
  label: string;
  value: number;
  muted?: boolean;
}) {
  return (
    <div className={`flex items-center justify-between gap-3 ${muted ? "text-slate-400" : ""}`}>
      <span>{label}</span>
      <span className="shrink-0 font-medium">{formatYen(value)}</span>
    </div>
  );
}

function affordabilityClass(status: MoveInCostBreakdown["affordabilityStatus"]) {
  if (status === "comfortable") return "bg-emerald-50 text-emerald-700";
  if (status === "tight") return "bg-amber-50 text-amber-700";
  if (status === "risky") return "bg-rose-50 text-rose-700";
  return "bg-slate-100 text-slate-600";
}

function affordabilityLabel(status: MoveInCostBreakdown["affordabilityStatus"]) {
  if (status === "comfortable") return "Looks manageable";
  if (status === "tight") return "Tight budget";
  if (status === "risky") return "Risky rent level";
  return "Need income";
}

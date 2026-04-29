"use client";

import { MoneyCalculator, RentalInsights } from "@/components/dashboard/money-section";
import { useJapanReady } from "@/components/japan-ready-provider";

export default function MoneyPage() {
  const { state, moveInCosts, updateMoneyCheck } = useJapanReady();

  return (
    <>
      <MoneyCalculator
        id="move-in-calculator"
        moneyCheck={state.moneyCheck}
        costs={moveInCosts}
        onChange={updateMoneyCheck}
      />
      <RentalInsights />
    </>
  );
}

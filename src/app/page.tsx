import { LegalWarning } from "@/components/dashboard/legal-warning";
import { MistakeAlerts, TimelineSection } from "@/components/dashboard/mistakes-timeline";
import { StatusCard } from "@/components/dashboard/status-card";

export default function Home() {
  return (
    <>
      <MistakeAlerts />
      <TimelineSection />
      <StatusCard />
      <LegalWarning />
    </>
  );
}

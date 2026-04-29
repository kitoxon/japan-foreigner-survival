"use client";

import {
  ArrivalProfileCard,
  BackupCard,
  MoneySummaryCard,
  SafetyCard,
} from "@/components/dashboard/sidebar";
import { useJapanReady } from "@/components/japan-ready-provider";

export default function ProfilePage() {
  const {
    state,
    moveInCosts,
    updateProfile,
    saveProfile,
    importError,
    downloadBackup,
    importFile,
  } = useJapanReady();

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <ArrivalProfileCard
        profile={state.profile}
        onboardingComplete={state.onboardingComplete}
        onProfileChange={updateProfile}
        onGenerate={saveProfile}
      />
      <div className="space-y-4">
        <SafetyCard />
        <BackupCard
          importError={importError}
          onDownload={downloadBackup}
          onImport={importFile}
        />
        <MoneySummaryCard costs={moveInCosts} />
      </div>
    </div>
  );
}

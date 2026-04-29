"use client";

import {
  CalendarDays,
  CheckSquare,
  Home,
  NotebookText,
  UserRound,
  WalletCards,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useJapanReady } from "./japan-ready-provider";
import {
  ArrivalProfileCard,
  BackupCard,
  MoneySummaryCard,
  SafetyCard,
} from "./dashboard/sidebar";
import { formatRemaining, formatYen, Metric } from "./dashboard/shared";

const primaryNav = [
  { href: "/", label: "Home", icon: Home },
  { href: "/money", label: "Money", icon: WalletCards },
  { href: "/checklist", label: "Tasks", icon: CheckSquare },
  { href: "/deadlines", label: "Dates", icon: CalendarDays },
  { href: "/notes", label: "Notes", icon: NotebookText },
];

const desktopNav = [...primaryNav, { href: "/profile", label: "Profile", icon: UserRound }];
type NavItem = (typeof desktopNav)[number];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const {
    state,
    activeTasks,
    completedTasks,
    nextDeadline,
    moveInCosts,
    updateProfile,
    saveProfile,
    importError,
    downloadBackup,
    importFile,
  } = useJapanReady();

  return (
    <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-4 px-3 pb-24 pt-3 sm:px-5 sm:py-5 lg:px-6">
      <header className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <p className="text-xs font-semibold uppercase text-teal-700">Settle in. Stay ready.</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
            Japan Ready
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            A survival guide for foreign residents who want to avoid expensive Japan mistakes.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 text-sm sm:min-w-[440px]">
          <Metric label="Tasks" value={`${completedTasks}/${activeTasks.length}`} />
          <Metric label="Next due" value={nextDeadline ? formatRemaining(nextDeadline.date) : "Set dates"} />
          <Metric label="Move-in estimate" value={formatYen(moveInCosts.upfrontTotal)} />
        </div>
      </header>

      <nav className="hidden rounded-lg border border-slate-200 bg-white p-2 shadow-sm md:flex md:items-center md:gap-2">
        {desktopNav.map((item) => (
          <NavLink key={item.href} item={item} active={isActive(pathname, item.href)} />
        ))}
      </nav>

      <section className="grid gap-4 lg:grid-cols-[300px_1fr]">
        <aside className="hidden space-y-4 lg:block">
          <ArrivalProfileCard
            profile={state.profile}
            onboardingComplete={state.onboardingComplete}
            onProfileChange={updateProfile}
            onGenerate={saveProfile}
          />
          <SafetyCard />
          <BackupCard
            importError={importError}
            onDownload={downloadBackup}
            onImport={importFile}
          />
          <MoneySummaryCard costs={moveInCosts} />
        </aside>

        <main className="min-w-0 space-y-4">{children}</main>
      </section>

      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 px-2 py-2 shadow-[0_-12px_30px_-24px_rgba(15,23,42,0.45)] backdrop-blur md:hidden">
        <div className="mx-auto grid max-w-md grid-cols-5 gap-1">
          {primaryNav.map((item) => (
            <MobileNavLink key={item.href} item={item} active={isActive(pathname, item.href)} />
          ))}
        </div>
      </nav>

      <Link
        href="/profile"
        className="fixed right-3 top-3 z-50 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm md:hidden"
      >
        <UserRound size={16} />
        Profile
      </Link>
    </div>
  );
}

function NavLink({ item, active }: { item: NavItem; active: boolean }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold ${
        active ? "bg-teal-700 text-white" : "text-slate-700 hover:bg-slate-100"
      }`}
    >
      <Icon size={16} />
      {item.label}
    </Link>
  );
}

function MobileNavLink({ item, active }: { item: NavItem; active: boolean }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      className={`flex min-h-12 flex-col items-center justify-center gap-1 rounded-lg text-[11px] font-semibold ${
        active ? "bg-teal-50 text-teal-700" : "text-slate-500"
      }`}
    >
      <Icon size={18} />
      {item.label}
    </Link>
  );
}

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

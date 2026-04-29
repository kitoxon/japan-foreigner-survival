export type TaskPhase =
  | "first_14_days"
  | "first_month"
  | "first_90_days"
  | "ongoing";

export type TaskStatus = "todo" | "done" | "skipped";

export type HousingStatus = "searching" | "temporary" | "fixed";
export type SetupStatus = "not_started" | "in_progress" | "done";
export type LanguagePreference = "en";

export type UserProfile = {
  residentName: string;
  arrivalDate: string;
  visaStatus: string;
  prefecture: string;
  city: string;
  languagePreference: LanguagePreference;
  housingStatus: HousingStatus;
  phoneStatus: SetupStatus;
  bankStatus: SetupStatus;
  insuranceStatus: SetupStatus;
};

export type TaskTemplate = {
  id: string;
  phase: TaskPhase;
  title: string;
  category: "city_office" | "identity" | "money" | "housing" | "health" | "daily_life" | "immigration";
  dueOffsetDays: number | null;
  explanation: string;
  requiredDocuments: string[];
  expectedOffice: string;
  sourceLabel: string;
  sourceUrl: string;
  premium: boolean;
};

export type UserTask = {
  id: string;
  templateId: string;
  phase: TaskPhase;
  title: string;
  category: TaskTemplate["category"];
  explanation: string;
  requiredDocuments: string[];
  expectedOffice: string;
  sourceLabel: string;
  sourceUrl: string;
  dueDate: string | null;
  status: TaskStatus;
  notes: string;
  premium: boolean;
};

export type Deadline = {
  id: string;
  label: string;
  date: string;
  type: "residence_card" | "visa_renewal" | "moving" | "custom";
  notes: string;
};

export type GuideArticle = {
  id: string;
  title: string;
  category: TaskTemplate["category"];
  summary: string;
  sourceLabel: string;
  sourceUrl: string;
  lastReviewed: string;
};

export type PersonalNote = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
};

export type MoneyCheck = {
  monthlyRent: number;
  managementFee: number;
  monthlyIncome: number;
  depositMonths: number;
  keyMoneyMonths: number;
  agencyFeeMonths: number;
  guarantorFeeMonths: number;
  insuranceFee: number;
  lockExchangeFee: number;
  cleaningFee: number;
  otherFee: number;
  moveInDay: number;
  includeNextMonthRent: boolean;
};

export type AppState = {
  version: 2;
  onboardingComplete: boolean;
  plan: "free" | "plus";
  profile: UserProfile;
  tasks: UserTask[];
  deadlines: Deadline[];
  notes: PersonalNote[];
  moneyCheck: MoneyCheck;
};

import type { GuideArticle, TaskPhase, TaskTemplate } from "./types";

export const phaseLabels: Record<TaskPhase, string> = {
  first_14_days: "First 14 days",
  first_month: "First month",
  first_90_days: "First 90 days",
  ongoing: "Ongoing renewals",
};

export const taskTemplates: TaskTemplate[] = [
  {
    id: "address-registration",
    phase: "first_14_days",
    title: "Register your address at city or ward office",
    category: "city_office",
    dueOffsetDays: 14,
    explanation:
      "Mid- to long-term residents should report their place of residence after settling into an address. This also unlocks many other setup steps.",
    requiredDocuments: ["Residence card", "Passport", "Address details", "Lease or housing document if available"],
    expectedOffice: "City hall, ward office, town office, or village office",
    sourceLabel: "Immigration Services Agency",
    sourceUrl: "https://www.moj.go.jp/isa/index.html",
    premium: false,
  },
  {
    id: "health-insurance",
    phase: "first_14_days",
    title: "Confirm health insurance enrollment",
    category: "health",
    dueOffsetDays: 14,
    explanation:
      "If your employer or school is not handling health insurance, ask the municipal office about National Health Insurance enrollment.",
    requiredDocuments: ["Residence card", "Passport", "Address registration details", "Employment or school documents if relevant"],
    expectedOffice: "Municipal health insurance counter or employer/school office",
    sourceLabel: "Ministry of Health, Labour and Welfare",
    sourceUrl: "https://www.mhlw.go.jp/english/",
    premium: false,
  },
  {
    id: "my-number",
    phase: "first_month",
    title: "Track My Number notification and card application",
    category: "identity",
    dueOffsetDays: 30,
    explanation:
      "After resident registration, your Individual Number is connected to your resident record. Keep the notification safe and decide whether to apply for the card.",
    requiredDocuments: ["Address registration", "Mail access at registered address", "Residence card"],
    expectedOffice: "Municipal office or My Number Card application channels",
    sourceLabel: "Digital Agency",
    sourceUrl: "https://www.digital.go.jp/en/policies/mynumber",
    premium: false,
  },
  {
    id: "phone-plan",
    phase: "first_month",
    title: "Set up a phone number that works for banks and offices",
    category: "daily_life",
    dueOffsetDays: 21,
    explanation:
      "A Japanese phone number makes bank, delivery, utility, and city-office follow-up easier. Some providers may require address registration or payment setup.",
    requiredDocuments: ["Residence card", "Address", "Payment method", "Passport if requested"],
    expectedOffice: "Mobile carrier, MVNO, or electronics retailer",
    sourceLabel: "Ministry of Internal Affairs and Communications",
    sourceUrl: "https://www.soumu.go.jp/main_sosiki/joho_tsusin/eng/index.html",
    premium: false,
  },
  {
    id: "bank-account",
    phase: "first_month",
    title: "Open a bank account or salary receiving account",
    category: "money",
    dueOffsetDays: 30,
    explanation:
      "Many employers, schools, rent payments, and utilities expect a domestic bank account. Requirements vary by bank and status.",
    requiredDocuments: ["Residence card with address", "Phone number", "Personal seal if requested", "Student or employment proof if requested"],
    expectedOffice: "Bank branch or online bank application",
    sourceLabel: "Financial Services Agency",
    sourceUrl: "https://www.fsa.go.jp/en/",
    premium: false,
  },
  {
    id: "housing-utilities",
    phase: "first_month",
    title: "Set up utilities and mail delivery",
    category: "housing",
    dueOffsetDays: 30,
    explanation:
      "Electricity, gas, water, internet, and postal delivery often require separate applications. Keep account numbers and support contacts together.",
    requiredDocuments: ["Address", "Lease details", "Phone number", "Payment method"],
    expectedOffice: "Utility providers, landlord, property manager, and Japan Post",
    sourceLabel: "Japan Post",
    sourceUrl: "https://www.post.japanpost.jp/index_en.html",
    premium: false,
  },
  {
    id: "pension-check",
    phase: "first_90_days",
    title: "Confirm pension category and payment handling",
    category: "health",
    dueOffsetDays: 60,
    explanation:
      "Residents aged 20 to 59 usually need pension coverage. Confirm whether this is handled through work or municipal National Pension procedures.",
    requiredDocuments: ["Residence card", "My Number details if available", "Employment or school documents"],
    expectedOffice: "Employer, school, municipal office, or pension office",
    sourceLabel: "Japan Pension Service",
    sourceUrl: "https://www.nenkin.go.jp/international/english/nationalpension/nationalpension.html",
    premium: false,
  },
  {
    id: "emergency-folder",
    phase: "first_90_days",
    title: "Prepare an emergency and admin contact folder",
    category: "daily_life",
    dueOffsetDays: 45,
    explanation:
      "Collect important contacts and document locations without uploading sensitive images. This keeps the app useful while reducing privacy risk.",
    requiredDocuments: ["Emergency contacts", "Clinic/hospital notes", "Employer/school contact", "Landlord or property manager contact"],
    expectedOffice: "Personal record",
    sourceLabel: "Japan National Tourism Organization",
    sourceUrl: "https://www.jnto.go.jp/emergency/eng/mi_guide.html",
    premium: false,
  },
  {
    id: "renewal-planning",
    phase: "ongoing",
    title: "Plan visa/status renewal window",
    category: "immigration",
    dueOffsetDays: null,
    explanation:
      "Track your residence card expiry and start preparing renewal documents early. Requirements depend on status, employer, school, and family situation.",
    requiredDocuments: ["Residence card", "Passport", "Status-specific application documents", "Employer/school/family documents if relevant"],
    expectedOffice: "Regional Immigration Services Bureau or online application if eligible",
    sourceLabel: "Immigration Services Agency",
    sourceUrl: "https://www.moj.go.jp/isa/index.html",
    premium: false,
  },
  {
    id: "document-template-pack",
    phase: "ongoing",
    title: "Build reusable document checklists for renewals and moves",
    category: "immigration",
    dueOffsetDays: null,
    explanation:
      "Paid planning templates can later cover renewal packets, family profiles, move-out/move-in sequences, and employer/school changes.",
    requiredDocuments: ["No upload needed in v1", "Store only checklist text and dates"],
    expectedOffice: "Plus feature",
    sourceLabel: "Feature roadmap",
    sourceUrl: "https://www.moj.go.jp/isa/index.html",
    premium: true,
  },
];

export const guideArticles: GuideArticle[] = [
  {
    id: "guide-address-registration",
    title: "Address registration comes first",
    category: "city_office",
    summary:
      "Many first-month tasks depend on having your address registered, including My Number notification, banking, insurance, and some phone plans.",
    sourceLabel: "Immigration Services Agency",
    sourceUrl: "https://www.moj.go.jp/isa/index.html",
    lastReviewed: "2026-04-24",
  },
  {
    id: "guide-my-number",
    title: "My Number is sensitive",
    category: "identity",
    summary:
      "Use this app to track the task and source links, but do not store your full Individual Number in notes or uploaded files.",
    sourceLabel: "Digital Agency",
    sourceUrl: "https://www.digital.go.jp/en/policies/mynumber",
    lastReviewed: "2026-04-24",
  },
  {
    id: "guide-pension-health",
    title: "Health insurance and pension need confirmation",
    category: "health",
    summary:
      "Employment, school, age, and household situation affect where you confirm coverage. The app keeps reminders, not legal determinations.",
    sourceLabel: "Japan Pension Service",
    sourceUrl: "https://www.nenkin.go.jp/international/english/nationalpension/nationalpension.html",
    lastReviewed: "2026-04-24",
  },
  {
    id: "guide-legal-safety",
    title: "Organization, not legal advice",
    category: "immigration",
    summary:
      "Use official sources and qualified professionals for immigration decisions. This product helps you organize dates, documents, and next actions.",
    sourceLabel: "Immigration Services Agency",
    sourceUrl: "https://www.moj.go.jp/isa/index.html",
    lastReviewed: "2026-04-24",
  },
];

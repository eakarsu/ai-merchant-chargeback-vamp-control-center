export interface PageConfig {
  label: string;
  href: string;
  description: string;
  entities: string[];
  workflows: string[];
}

export interface EntityConfig {
  name: string;
  label: string;
  fields: Array<{ name: string; kind: "string" | "number" | "boolean" | "date" }>;
}

export interface WorkflowConfig {
  slug: string;
  title: string;
  description: string;
  prompt: string;
  fields: string[];
}

export const appConfig = {
  slug: "ai-merchant-chargeback-vamp-control-center",
  title: "Chargeback VAMP Command",
  tagline: "Merchant chargeback control and Visa VAMP compliance",
  accent: "rose",
};

export const pages: PageConfig[] = [
  {
    label: "Portfolio",
    href: "/portfolio",
    description: "Merchant health and VAMP monitoring.",
    entities: ["Merchant", "VampRatioSnapshot", "AlertEvent"],
    workflows: ["vamp-forecast"],
  },
  {
    label: "Disputes",
    href: "/disputes",
    description: "Dispute queue, evidence, and representment.",
    entities: ["Dispute", "EvidenceItem", "RepresentmentPackage"],
    workflows: ["representment-builder"],
  },
  {
    label: "Prevention",
    href: "/prevention",
    description: "Fraud signals, rules, transactions.",
    entities: ["FraudSignal", "PreventionRule", "TransactionRecord"],
    workflows: ["dispute-pattern"],
  },
  {
    label: "Recovery & Reporting",
    href: "/recovery",
    description: "Recovered payouts and acquirer reporting.",
    entities: ["RecoveryPayout", "AcquirerReport", "CaseNote"],
    workflows: [],
  },
];

export const entities: Record<string, EntityConfig> = {
  Merchant: {
    name: "Merchant",
    label: "Merchant",
    fields: [{ name: "name", kind: "string" }, { name: "descriptor", kind: "string" }, { name: "mcc", kind: "string" }, { name: "acquirer", kind: "string" }, { name: "status", kind: "string" }, { name: "monthlyVolume", kind: "number" }, { name: "region", kind: "string" }],
  },
  TransactionRecord: {
    name: "TransactionRecord",
    label: "Transaction",
    fields: [{ name: "cardPresent", kind: "string" }, { name: "amountCents", kind: "number" }, { name: "currency", kind: "string" }, { name: "authCode", kind: "string" }, { name: "transactedAt", kind: "date" }, { name: "threeDs", kind: "boolean" }],
  },
  Dispute: {
    name: "Dispute",
    label: "Dispute",
    fields: [{ name: "caseId", kind: "string" }, { name: "reasonCode", kind: "string" }, { name: "network", kind: "string" }, { name: "amount", kind: "number" }, { name: "status", kind: "string" }, { name: "receivedAt", kind: "date" }],
  },
  RepresentmentPackage: {
    name: "RepresentmentPackage",
    label: "Representment",
    fields: [{ name: "caseId", kind: "string" }, { name: "status", kind: "string" }, { name: "compellingEvidence", kind: "string" }, { name: "submittedAt", kind: "date" }, { name: "outcome", kind: "string" }, { name: "recoveredAmount", kind: "number" }],
  },
  EvidenceItem: {
    name: "EvidenceItem",
    label: "Evidence Item",
    fields: [{ name: "caseId", kind: "string" }, { name: "kind", kind: "string" }, { name: "summary", kind: "string" }, { name: "source", kind: "string" }, { name: "capturedAt", kind: "date" }, { name: "verified", kind: "boolean" }],
  },
  FraudSignal: {
    name: "FraudSignal",
    label: "Fraud Signal",
    fields: [{ name: "signal", kind: "string" }, { name: "bin", kind: "string" }, { name: "severity", kind: "string" }, { name: "status", kind: "string" }, { name: "occurrences", kind: "number" }, { name: "firstSeen", kind: "date" }],
  },
  VampRatioSnapshot: {
    name: "VampRatioSnapshot",
    label: "VAMP Snapshot",
    fields: [{ name: "month", kind: "string" }, { name: "ratio", kind: "number" }, { name: "disputeCount", kind: "number" }, { name: "tc40Events", kind: "number" }, { name: "status", kind: "string" }, { name: "basisPoints", kind: "number" }],
  },
  PreventionRule: {
    name: "PreventionRule",
    label: "Prevention Rule",
    fields: [{ name: "name", kind: "string" }, { name: "trigger", kind: "string" }, { name: "action", kind: "string" }, { name: "enabled", kind: "boolean" }, { name: "firedCount", kind: "number" }, { name: "lastFiredAt", kind: "date" }],
  },
  RecoveryPayout: {
    name: "RecoveryPayout",
    label: "Recovery Payout",
    fields: [{ name: "caseId", kind: "string" }, { name: "amount", kind: "number" }, { name: "status", kind: "string" }, { name: "paidAt", kind: "date" }, { name: "feeModel", kind: "string" }, { name: "feeAmount", kind: "number" }],
  },
  AlertEvent: {
    name: "AlertEvent",
    label: "Alert",
    fields: [{ name: "kind", kind: "string" }, { name: "severity", kind: "string" }, { name: "message", kind: "string" }, { name: "status", kind: "string" }, { name: "raisedAt", kind: "date" }, { name: "assignee", kind: "string" }],
  },
  AcquirerReport: {
    name: "AcquirerReport",
    label: "Acquirer Report",
    fields: [{ name: "acquirer", kind: "string" }, { name: "period", kind: "string" }, { name: "reportedRatio", kind: "number" }, { name: "reportedDisputes", kind: "number" }, { name: "status", kind: "string" }, { name: "receivedAt", kind: "date" }],
  },
  CaseNote: {
    name: "CaseNote",
    label: "Case Note",
    fields: [{ name: "caseId", kind: "string" }, { name: "author", kind: "string" }, { name: "body", kind: "string" }, { name: "createdOn", kind: "date" }, { name: "visibility", kind: "string" }, { name: "caseRef", kind: "string" }],
  },
};

export const workflows: WorkflowConfig[] = [
  {
    slug: "representment-builder",
    title: "Representment Evidence Builder",
    description: "Assemble the strongest evidence package for a dispute.",
    prompt: "You are a chargeback analyst. Given the reason code and available evidence, identify the matching compelling evidence (CE 3.0 eligible if applicable) and draft the representment narrative.",
    fields: ["reasonCode", "network", "amount", "availableEvidence"],
  },
  {
    slug: "vamp-forecast",
    title: "VAMP Ratio Forecaster",
    description: "Project month-end VAMP ratio against 150 bps.",
    prompt: "You are a payments compliance analyst. Project the month-end Visa VAMP ratio from current disputes-to-transactions pacing, and recommend controls to stay under the 150 basis point threshold effective April 2026.",
    fields: ["monthToDateDisputes", "monthToDateTransactions", "avgDailySales", "pendingAlerts"],
  },
  {
    slug: "dispute-pattern",
    title: "Dispute Pattern Detector",
    description: "Find coordinated dispute or fraud patterns.",
    prompt: "You are a fraud investigator. Detect coordinated patterns across BINs, descriptors, and geographies in the described dispute cluster.",
    fields: ["bins", "descriptors", "window", "reasonCodes"],
  },
];

export function findPage(href: string): PageConfig | undefined {
  return pages.find((p) => p.href === href);
}

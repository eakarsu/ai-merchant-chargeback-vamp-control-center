// Seed script — creates demo users and realistic domain records.
import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const phones = ["(415) 555-0132", "(212) 555-0187", "(312) 555-0149", "(617) 555-0110"];
const cities = ["Chicago, IL", "Austin, TX", "Boston, MA", "Denver, CO", "Seattle, WA"];

function pick<T>(arr: T[], i: number): T { return arr[i % arr.length]; }
function amount(i: number, base = 1000): number { return Math.round((base + ((i * 7919) % 900) * base) * 100) / 100; }
function daysAgo(i: number, spread = 180): Date { return new Date(Date.now() - ((i * 37) % spread) * 86400000); }

async function main() {
  const database = new URL(process.env.DATABASE_URL || "").pathname.slice(1);
  if (process.env.NODE_ENV === "production" || process.env.ALLOW_DEMO_SEED !== "true" || !/^(demo_|inspection_test_)/.test(database)) throw new Error("Demo seeding requires ALLOW_DEMO_SEED=true and a dedicated demo_ or inspection_test_ database");
  if (!process.env.DEMO_PASSWORD || process.env.DEMO_PASSWORD.length < 16) throw new Error("Set DEMO_PASSWORD to at least 16 characters");
  const passwordHash = await bcrypt.hash(process.env.DEMO_PASSWORD!, 12);
  const demoUsers: Array<[string, string, Role]> = [
    ["admin@ai-merchant-chargeback-vamp-control-center.local", "Demo Admin", "ADMIN"],
    ["manager@ai-merchant-chargeback-vamp-control-center.local", "Demo Manager", "MANAGER"],
    ["analyst@ai-merchant-chargeback-vamp-control-center.local", "Demo Analyst", "ANALYST"],
  ];
  for (const [email, name, role] of demoUsers) {
    await prisma.user.upsert({ where: { email }, update: {}, create: { email, name, role, passwordHash } });
  }

  const STATUSES_Merchant = ["HEALTHY", "WATCHLIST", "EXCESSIVE", "TERMINATED"];
  await prisma.merchant.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.merchant.create({
      data: {
      name: `Name ${String(i + 1).padStart(3, "0")}`,
      descriptor: `Descriptor ${String(i + 1).padStart(3, "0")}`,
      mcc: `Mcc ${String(i + 1).padStart(3, "0")}`,
      acquirer: `Acquirer ${String(i + 1).padStart(3, "0")}`,
      status: pick(STATUSES_Merchant, i),
      monthlyVolume: amount(i, 250),
      region: `Region ${String(i + 1).padStart(3, "0")}`
      },
    });
  }

  const merchantRefs = await prisma.merchant.findMany({ select: { id: true } });

  const STATUSES_TransactionRecord = ["OPEN", "IN_REVIEW", "APPROVED", "CLOSED"];
  await prisma.transactionRecord.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.transactionRecord.create({
      data: {
      cardPresent: `CardPresent ${String(i + 1).padStart(3, "0")}`,
      amountCents: 5 + ((i * 13) % 95),
      currency: `Currency ${String(i + 1).padStart(3, "0")}`,
      authCode: `AuthCode ${String(i + 1).padStart(3, "0")}`,
      transactedAt: daysAgo(i),
      threeDs: i % 3 === 0,
      merchant: { connect: { id: merchantRefs[i % merchantRefs.length].id } }
      },
    });
  }

  const STATUSES_Dispute = ["RECEIVED", "COMPILING", "REPRESENTED", "WON", "LOST"];
  await prisma.dispute.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.dispute.create({
      data: {
      caseId: `CaseId ${String(i + 1).padStart(3, "0")}`,
      reasonCode: `ReasonCode ${String(i + 1).padStart(3, "0")}`,
      network: `Network ${String(i + 1).padStart(3, "0")}`,
      amount: amount(i, 250),
      status: pick(STATUSES_Dispute, i),
      receivedAt: daysAgo(i),
      merchant: { connect: { id: merchantRefs[i % merchantRefs.length].id } }
      },
    });
  }

  const STATUSES_RepresentmentPackage = ["OPEN", "IN_REVIEW", "APPROVED", "CLOSED"];
  await prisma.representmentPackage.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.representmentPackage.create({
      data: {
      caseId: `CaseId ${String(i + 1).padStart(3, "0")}`,
      status: pick(STATUSES_RepresentmentPackage, i),
      compellingEvidence: `CompellingEvidence ${String(i + 1).padStart(3, "0")}`,
      submittedAt: daysAgo(i),
      outcome: `Outcome ${String(i + 1).padStart(3, "0")}`,
      recoveredAmount: amount(i, 250),
      merchant: { connect: { id: merchantRefs[i % merchantRefs.length].id } }
      },
    });
  }

  const STATUSES_EvidenceItem = ["OPEN", "IN_REVIEW", "APPROVED", "CLOSED"];
  await prisma.evidenceItem.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.evidenceItem.create({
      data: {
      caseId: `CaseId ${String(i + 1).padStart(3, "0")}`,
      kind: `Kind ${String(i + 1).padStart(3, "0")}`,
      summary: `Summary ${String(i + 1).padStart(3, "0")}`,
      source: `Source ${String(i + 1).padStart(3, "0")}`,
      capturedAt: daysAgo(i),
      verified: i % 3 === 0,
      merchant: { connect: { id: merchantRefs[i % merchantRefs.length].id } }
      },
    });
  }

  const STATUSES_FraudSignal = ["OPEN", "IN_REVIEW", "APPROVED", "CLOSED"];
  await prisma.fraudSignal.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.fraudSignal.create({
      data: {
      signal: `Signal ${String(i + 1).padStart(3, "0")}`,
      bin: `Bin ${String(i + 1).padStart(3, "0")}`,
      severity: `Severity ${String(i + 1).padStart(3, "0")}`,
      status: pick(STATUSES_FraudSignal, i),
      occurrences: 5 + ((i * 13) % 95),
      firstSeen: daysAgo(i),
      merchant: { connect: { id: merchantRefs[i % merchantRefs.length].id } }
      },
    });
  }

  const STATUSES_VampRatioSnapshot = ["UNDER", "WATCH", "EXCESSIVE"];
  await prisma.vampRatioSnapshot.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.vampRatioSnapshot.create({
      data: {
      month: `Month ${String(i + 1).padStart(3, "0")}`,
      ratio: amount(i, 250),
      disputeCount: amount(i, 250),
      tc40Events: amount(i, 250),
      status: pick(STATUSES_VampRatioSnapshot, i),
      basisPoints: 5 + ((i * 13) % 95),
      merchant: { connect: { id: merchantRefs[i % merchantRefs.length].id } }
      },
    });
  }

  const STATUSES_PreventionRule = ["OPEN", "IN_REVIEW", "APPROVED", "CLOSED"];
  await prisma.preventionRule.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.preventionRule.create({
      data: {
      name: `Name ${String(i + 1).padStart(3, "0")}`,
      trigger: `Trigger ${String(i + 1).padStart(3, "0")}`,
      action: `Action ${String(i + 1).padStart(3, "0")}`,
      enabled: i % 3 === 0,
      firedCount: 5 + ((i * 13) % 95),
      lastFiredAt: daysAgo(i),
      merchant: { connect: { id: merchantRefs[i % merchantRefs.length].id } }
      },
    });
  }

  const STATUSES_RecoveryPayout = ["OPEN", "IN_REVIEW", "APPROVED", "CLOSED"];
  await prisma.recoveryPayout.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.recoveryPayout.create({
      data: {
      caseId: `CaseId ${String(i + 1).padStart(3, "0")}`,
      amount: amount(i, 250),
      status: pick(STATUSES_RecoveryPayout, i),
      paidAt: daysAgo(i),
      feeModel: `FeeModel ${String(i + 1).padStart(3, "0")}`,
      feeAmount: amount(i, 250),
      merchant: { connect: { id: merchantRefs[i % merchantRefs.length].id } }
      },
    });
  }

  const STATUSES_AlertEvent = ["OPEN", "IN_REVIEW", "APPROVED", "CLOSED"];
  await prisma.alertEvent.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.alertEvent.create({
      data: {
      kind: `Kind ${String(i + 1).padStart(3, "0")}`,
      severity: `Severity ${String(i + 1).padStart(3, "0")}`,
      message: `Message ${String(i + 1).padStart(3, "0")}`,
      status: pick(STATUSES_AlertEvent, i),
      raisedAt: daysAgo(i),
      assignee: `Assignee ${String(i + 1).padStart(3, "0")}`,
      merchant: { connect: { id: merchantRefs[i % merchantRefs.length].id } }
      },
    });
  }

  const STATUSES_AcquirerReport = ["OPEN", "IN_REVIEW", "APPROVED", "CLOSED"];
  await prisma.acquirerReport.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.acquirerReport.create({
      data: {
      acquirer: `Acquirer ${String(i + 1).padStart(3, "0")}`,
      period: `Period ${String(i + 1).padStart(3, "0")}`,
      reportedRatio: amount(i, 250),
      reportedDisputes: 5 + ((i * 13) % 95),
      status: pick(STATUSES_AcquirerReport, i),
      receivedAt: daysAgo(i),
      merchant: { connect: { id: merchantRefs[i % merchantRefs.length].id } }
      },
    });
  }

  const STATUSES_CaseNote = ["OPEN", "IN_REVIEW", "APPROVED", "CLOSED"];
  await prisma.caseNote.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.caseNote.create({
      data: {
      caseId: `CaseId ${String(i + 1).padStart(3, "0")}`,
      author: `Author ${String(i + 1).padStart(3, "0")}`,
      body: `Body ${String(i + 1).padStart(3, "0")}`,
      createdOn: daysAgo(i),
      visibility: `Visibility ${String(i + 1).padStart(3, "0")}`,
      caseRef: `CaseRef ${String(i + 1).padStart(3, "0")}`,
      merchant: { connect: { id: merchantRefs[i % merchantRefs.length].id } }
      },
    });
  }

  await prisma.auditLog.create({ data: { actorName: "Seeder", action: "SEED", entity: "system", detail: "Demo dataset created" } });

  console.log("Seeded demo users and domain records.");
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); });

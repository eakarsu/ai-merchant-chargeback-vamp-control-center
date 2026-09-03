# Chargeback VAMP Command

Detects dispute patterns, compiles representment evidence, monitors VAMP ratios against the 150 bps threshold effective April 2026, and prevents merchant monitoring penalties.

Stack: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Prisma,
PostgreSQL, NextAuth credentials, and OpenRouter for AI workflows. Structure
and conventions mirror the `beautyhqio` reference application.

## Features
- Dispute-pattern detection across merchants
- Representment evidence compilation
- VAMP ratio monitoring vs. 150 bps threshold
- Merchant monitoring penalty prevention
- Fraud signal correlation by BIN and descriptor
- Recovery payout tracking
- Prevention rules and alerts
- Acquirer reporting

## Local setup

1. Install Node.js 22 and PostgreSQL 17.
2. Copy `.env.example` to `.env` and set `DATABASE_URL` plus
   `NEXTAUTH_SECRET`. Never use the example values in production.
3. Run:

```bash
npm install
npx prisma migrate dev --name init
npm run db:seed
npm run dev
```

Then open <http://localhost:4611> and sign in with a seeded demo account
(`admin@ai-merchant-chargeback-vamp-control-center.local` / `Demo!23456`).

## Release gates

```bash
npm run typecheck
npm run lint
npm run build
```

## AI workflows

AI features call OpenRouter from API routes only; the browser never receives
the API key. Set `OPENROUTER_API_KEY` (and optionally `OPENROUTER_MODEL`) in
`.env`. Without a key the AI endpoints return a deterministic local analysis
so the screens remain demonstrable offline.

## Roles

- `ADMIN` — full access, manages users and configuration
- `MANAGER` — creates and edits domain records, runs AI workflows
- `ANALYST` — read-mostly access with reporting

Every mutation is recorded in the `AuditLog` table with actor, action, and
timestamp, mirroring the auditability expectations of regulated buyers.

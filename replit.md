# AIVOA Complaint Intake

An AI-assisted, two-panel intake workflow for capturing pharmaceutical customer complaints, assessing risk, and saving the verified record.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/complaint-intake/` — single-page React intake workspace.
- `artifacts/api-server/src/routes/complaints.ts` — complaint extraction, copilot, and persistence endpoints.
- `lib/api-spec/openapi.yaml` — API contract.
- `lib/db/src/schema/complaints.ts` — complaint persistence schema.

## Architecture decisions

- Structured complaint and risk objects are stored as JSON to preserve the AI extraction contract without a sprawling relational schema.
- Extraction uses Groq when available and a deterministic local parser as a service-resilience fallback.

## Product

- Captures complaint details from pasted text or supported document input, routes generated fields into a verifiable form, explains risk, flags missing intake facts, and saves the finished complaint.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Run API code generation after changing `lib/api-spec/openapi.yaml`.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details

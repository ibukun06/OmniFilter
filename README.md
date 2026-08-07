# OmniFilter MVP - Milestone 2

Working authentication, protected dashboard, saved filters, no-cost natural-language rule parser, and PostgreSQL persistence.

## Quick start
1. Copy `apps/api/.env.example` to `apps/api/.env`.
2. Copy `apps/web/.env.local.example` to `apps/web/.env.local`.
3. Run `docker compose up -d`.
4. Run `npm install` at the repository root.
5. Run `npm --workspace apps/api run prisma:generate`.
6. Run `npm --workspace apps/api run prisma:migrate`.
7. In terminal one: `npm run dev:api`.
8. In terminal two: `npm run dev:web`.

Web: http://localhost:3000 | API: http://localhost:3001/api

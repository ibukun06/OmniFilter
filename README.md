# OmniFilter MVP - Milestone 3

Milestone 3 turns saved filter ideas into a working data-filtering product. Users can create datasets, import CSV or JSON records, inspect detected fields, run structured filters, and review search history.

## Included
- Everything from Milestone 2
- Dataset creation and deletion
- Browser-side CSV and JSON import
- Batched record ingestion API
- Dynamic field detection
- Actual filtering across text, numbers, and categories
- Search history
- Dataset statistics

## Start
```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.local.example apps/web/.env.local
docker compose up -d
npm install
npm --workspace apps/api run prisma:generate
npm --workspace apps/api run prisma:migrate
npm run dev:api
# second terminal
npm run dev:web
```

Open port 3000. Create an account, then visit **Datasets**.

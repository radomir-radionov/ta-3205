# Async URL Check

Fullstack service for asynchronous URL list checking (NestJS + React + Zustand + Tailwind CSS).

## Requirements

- Node.js 20+
- npm
- Docker (optional)
- TypeScript **7.0.2** for builds (`tsc`); TypeScript **6** API via `@typescript/typescript6` for ESLint (Nest CLI / typescript-eslint need the TS 6 API until 7.1)

## Quick start

```bash
chmod +x dev.sh docker-up.sh   # once
./dev.sh                       # local: UI http://localhost:5173 , API http://localhost:3000/api
# or
./docker-up.sh                 # Docker: UI http://localhost:8080 , API http://localhost:3000/api
```

## Local development (manual)

### Backend

```bash
cd backend
npm install
npm run start:dev
```

API: `http://localhost:3000/api`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

UI: `http://localhost:5173` (Vite proxies `/api` → backend)

## Docker

From the repo root:

```bash
./docker-up.sh
# or: docker compose up --build
```

- UI: `http://localhost:8080`
- API: `http://localhost:3000/api`

## Lint / format

```bash
# backend
cd backend && npm run lint && npm run format

# frontend
cd frontend && npm run lint && npm run format
```

| Method | Path | Description |
| --- | --- | --- |
| POST | `/api/jobs` | Create job `{ "urls": string[] }` → `{ "jobId" }` |
| GET | `/api/jobs` | List jobs (summary + stats) |
| GET | `/api/jobs/:id` | Job detail with per-URL results |
| DELETE | `/api/jobs/:id` | Cancel job (stops not-started URLs) |

URL checks use HTTP HEAD, random 0–10s delay before saving each result, max 5 concurrent requests per job.

# FlexQuest Monorepo

## Quick start

- Backend API
  - env: copy `backend/.env` or set `PORT` and `JWT_SECRET`
  - run:
    - `cd backend`
    - `pnpm run dev`
    - Health: `curl http://localhost:4000/health`

- Frontend app
  - run:
    - `cd frontend`
    - `pnpm install`
    - `pnpm run dev`
    - Open printed URL (usually http://localhost:5173)

## Stack
- Frontend: Vite + React 19 + TypeScript, TailwindCSS v3, Redux Toolkit, Framer Motion, React Router
- Backend: Express + TypeScript, Zod, JWT, bcrypt; in-memory store (MVP)
- Shared: TypeScript types in `shared/`

## Notes
- Tailwind theme with Ghibli palette in `frontend/tailwind.config.cjs`
- Quest flow fetches `/api/quests/today` with graceful fallback
- Simple adaptive intensity and XP leveling in Redux

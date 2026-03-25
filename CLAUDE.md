# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Talentz is a freelance marketplace platform with dual roles (CLIENT/SELLER). Built with Next.js 15 App Router, React 19, and TypeScript. Supports English and Chinese locales.

## Commands

- **Dev server**: `npm run dev` (uses Turbopack)
- **Build**: `npm run build`
- **Lint**: `npm run lint`
- **Start production**: `npm start`

## Architecture

### Routing & Localization

All routes are under `app/[lang]/` where `[lang]` is `en` or `ch`. Middleware (`middleware.ts`) enforces locale prefixing and auth/role-based route protection. Dictionary JSON files in `app/[lang]/dictionaries/` are loaded via `getDictionary(lang)`.

### Authentication

JWT stored in HttpOnly cookie. Server-side verification via `jose` in `actions/get-session-from-token.ts`. Middleware protects dashboard routes and enforces:
- Email verification status (UNVERIFIED → VERIFIED)
- Identity/KYC verification (UNVERIFIED → PENDING → VERIFIED)
- Role-based access (CLIENT vs SELLER dashboard paths)

OAuth tokens arrive via query param and are handled by `app/[lang]/oauth-provider.tsx`.

### API Layer

- Axios instance in `services/api-client.ts` with interceptors for auth headers (`x-auth-token`) and 401 auto-logout
- Base URL: `NEXT_PUBLIC_DATABASE_URL` (default `http://localhost:5000`)
- Query factory `lib/create-query.ts` generates type-safe TanStack Query hooks
- All API responses follow `ApiResponse<T>` shape (defined in `schemas/ApiResponse.ts`)

### State Management

- **Server state**: TanStack React Query v5. Cache timing constants in `lib/constants.ts` (STANDARD 5min, FREQUENT 1min, REALTIME 30s)
- **Client state**: Zustand v5 with persistence for multi-step job forms (`store/job-form.ts`), chat state, message drafts

### Real-Time

Socket.IO client singleton in `lib/socket.ts`. Used for chat messages, notifications, and online user presence. Socket events trigger React Query cache invalidation.

### Forms

React Hook Form + Zod validation throughout. Pattern: define Zod schema → `useForm({ resolver: zodResolver(schema) })`. Errors displayed via `react-hot-toast`.

### UI

Shadcn/ui (New York style) components in `components/ui/`. Tailwind CSS v4. Use `lib/cn.ts` for class merging (`clsx` + `tailwind-merge`). Icons from Lucide React.

## Key Conventions

- **Path alias**: `@/*` maps to project root — all imports use `@/` prefix
- **Type definitions**: `schemas/` directory (not `types/`)
- **Hooks**: One hook per file in `hooks/`, named `use<Feature>.ts`
- **Route components**: Feature-specific components live in `_components/` directories alongside their routes
- **File uploads**: Firebase Storage via `lib/firebase-upload.ts` and `hooks/useFilesUpload.ts`

## Environment Variables

See `.env.example`. Key vars:
- `NEXT_PUBLIC_DATABASE_URL` — Backend API URL
- `NEXT_PUBLIC_SOCKET_URL` — Socket.IO server URL
- `JWT_SECRET` — Server-only, for JWT verification
- `NEXT_PUBLIC_FIREBASE_*` — Firebase config (public keys)

## Deployment

Deployed on Netlify (`netlify.toml`). Image domains whitelisted in `next.config.ts`: firebasestorage.googleapis.com, lh3.googleusercontent.com, i.ibb.co, res.cloudinary.com, images.pexels.com, example.com.

# Pehlione

Full-stack membership & authorization platform built as an npm workspaces monorepo.

```
root/
├── apps/
│   ├── api/          Express 5 · TypeScript · Prisma · Redis sessions
│   └── web/          React 19 · Vite · TanStack Query · Tailwind CSS
├── packages/
│   └── shared/       Enums · Zod schemas · Types · Permissions
└── infra/            Docker Compose (MySQL · Redis · MailHog)
```

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 19, TypeScript, Vite 6, React Router 7, TanStack Query 5, React Hook Form, Zod, Tailwind CSS 4 |
| **Backend** | Express 5, TypeScript, Prisma 6, MySQL 8.4, Redis 7, express-session, Argon2id, Nodemailer 8 |
| **Shared** | Zod schemas, TypeScript enums/types, role permissions, tier entitlements |
| **Infra** | Docker Compose, MailHog |
| **Test** | Vitest, Supertest, Playwright |

## Architecture

- **Auth**: Session-based (`express-session` + Redis store + httpOnly cookie). No JWT/localStorage.
- **Role** (`ADMIN` / `USER`): Controls *what a user can do* — admin panel, user management, audit.
- **MembershipTier** (`BRONZE` / `SILVER` / `GOLD`): Controls *what package a user has* — features, limits, entitlements.
- Role and tier are **never** mixed into a single field.

### Access Control Chain

```
1. Authenticated?  →  2. Active?  →  3. Role OK?  →  4. Tier covers feature?
```

### Security

Helmet · CSRF (synchronizer token) · Rate limiting · Login throttle · Argon2id password hashing · Secure session cookies · Audit logging · Input validation (Zod)

## Prerequisites

| Tool | Version |
|------|---------|
| Node.js | ≥ 20.19 |
| npm | ≥ 10 |
| Docker & Docker Compose | Latest |

## Quick Start

```bash
# 1 — Clone & install
git clone <repo-url> && cd pehlione_com_react_typescript
npm install

# 2 — Start infrastructure
cp infra/compose/.env.example .env   # adjust if needed
npm run docker:up                    # MySQL 8.4, Redis 7.4, MailHog

# 3 — Setup database
cp apps/api/.env.example apps/api/.env
npm run prisma:generate
npm run prisma:migrate:dev
npm -w @pehlione/api run db:seed     # admin user + permissions + entitlements

# 4 — Run
npm run dev
```

| Service | URL |
|---------|-----|
| Web (Vite) | http://localhost:5173 |
| API | http://localhost:4000 |
| API Health | http://localhost:4000/health |
| MailHog UI | http://localhost:8025 |
| Prisma Studio | `npm run prisma:studio` |

## Scripts

```bash
npm run dev                # Start API + Web concurrently
npm run build              # Build both apps
npm run typecheck          # TypeScript check all workspaces
npm run lint               # Lint all workspaces
npm run test               # Run tests in all workspaces
npm run docker:up          # Start Docker services
npm run docker:down        # Stop Docker services
npm run prisma:generate    # Generate Prisma client
npm run prisma:migrate:dev # Create/apply migrations
npm -w @pehlione/api run db:seed  # Seed database
```

## API Endpoints

### Auth
| Method | Path | Auth |
|--------|------|------|
| `GET` | `/api/auth/csrf-token` | — |
| `POST` | `/api/auth/register` | — |
| `POST` | `/api/auth/login` | — |
| `POST` | `/api/auth/logout` | Session |
| `GET` | `/api/auth/me` | Session |
| `GET` | `/api/auth/verify-email` | — |
| `POST` | `/api/auth/forgot-password` | — |
| `POST` | `/api/auth/reset-password` | — |

### User
| Method | Path | Auth |
|--------|------|------|
| `GET` | `/api/users/me` | Session |
| `PATCH` | `/api/users/me` | Session + CSRF |
| `PATCH` | `/api/users/me/password` | Session + CSRF |

### Sessions
| Method | Path | Auth |
|--------|------|------|
| `GET` | `/api/sessions` | Session |
| `DELETE` | `/api/sessions/:id` | Session + CSRF |
| `DELETE` | `/api/sessions/all` | Session + CSRF |

### Memberships
| Method | Path | Auth |
|--------|------|------|
| `GET` | `/api/memberships/me` | Session |
| `GET` | `/api/memberships/features/me` | Session |

### Admin
| Method | Path | Auth |
|--------|------|------|
| `GET` | `/api/admin/users` | Admin + Permission |
| `GET` | `/api/admin/users/:id` | Admin + Permission |
| `PATCH` | `/api/admin/users/:id/role` | Admin + Permission + CSRF |
| `PATCH` | `/api/admin/users/:id/membership` | Admin + Permission + CSRF |
| `POST` | `/api/admin/users/:id/disable` | Admin + Permission + CSRF |
| `POST` | `/api/admin/users/:id/enable` | Admin + Permission + CSRF |
| `GET` | `/api/admin/audit-logs` | Admin + Permission |

## Project Structure

```
apps/api/src/
├── config/env.ts              # Environment variables (Zod validated)
├── lib/                       # prisma, redis, password, token, cookie
├── middlewares/                # authenticate, csrf, errorHandler, loginRateLimit,
│                              # requestLogger, requireFeature, requirePermission,
│                              # requireRole, requireTier, validate
├── modules/
│   ├── auth/                  # register, login, logout, verify, reset
│   ├── users/                 # profile, password change
│   ├── sessions/              # list, revoke
│   ├── admin/                 # user management, audit logs
│   ├── memberships/           # plan & entitlements
│   ├── audit/                 # audit log repository & service
│   └── mail/                  # nodemailer provider, mail service
├── types/express.d.ts         # Session augmentation
├── app.ts                     # Express app + middleware chain
└── server.ts                  # Bootstrap (Prisma + Redis connect)

apps/web/src/
├── auth/                      # AuthContext, API calls, mutations
├── guards/                    # RequireAuth, RequireRole, RequireTier, RequireFeature
├── pages/                     # 23 route pages (lazy-loaded where appropriate)
├── components/                # Layout, forms, data display
├── lib/                       # Axios client, query client, query keys
├── admin/                     # Admin API layer
├── users/                     # User API layer
├── sessions/                  # Sessions API layer
├── memberships/               # Memberships API layer
├── router.tsx                 # Route definitions with code-splitting
├── App.tsx                    # Shell layout
└── main.tsx                   # Entry point

packages/shared/src/
├── enums/                     # Role, MembershipTier, MembershipStatus, TokenType, AuditAction
├── types/                     # UserDto, ApiResponse, FeatureEntitlementDto, etc.
├── schemas/                   # Zod schemas (auth, user)
└── permissions/               # ROLE_PERMISSIONS, TIER_ENTITLEMENTS, FEATURES
```

## Environment Variables

### API (`apps/api/.env`)

| Variable | Example | Description |
|----------|---------|-------------|
| `DATABASE_URL` | `mysql://user:pass@127.0.0.1:3307/pehlione_db_react` | Prisma connection |
| `REDIS_URL` | `redis://127.0.0.1:6379` | Session store |
| `SESSION_SECRET` | 32+ char secret | Session signing |
| `SESSION_NAME` | `pehlione.sid` | Cookie name |
| `APP_ORIGIN` | `http://localhost:5173` | CORS origin |
| `MAIL_HOST` | `127.0.0.1` | SMTP host |
| `MAIL_PORT` | `1025` | SMTP port (MailHog) |

### Web (`apps/web/.env`)

| Variable | Example | Description |
|----------|---------|-------------|
| `VITE_API_BASE_URL` | `http://localhost:4000/api` | API base (optional, defaults to `/api` via Vite proxy) |

## Default Seed Data

| Item | Value |
|------|-------|
| Admin email | `admin@pehlione.com` |
| Admin password | `Admin1234!` |
| Permissions | 6 (users:read/write/delete, audit:read, roles:write, memberships:write) |
| Feature entitlements | 12 (8 features × 3 tiers) |

## License

Private — All rights reserved.

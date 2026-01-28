# G0 Experience

> The Universal Canvas for AI Entities

## Development

**Port 3005** (port 3000 is G0 Memory)

```bash
# Clean start (recommended)
npm run dev:clean

# Or manual
npm run dev -- -p 3005
```

**Access**: http://localhost:3005

**Auth**: Password protected. Set `AUTH_PASSWORD` in `.env.local`

## Key Commands

| Command | Description |
|---------|-------------|
| `npm run dev:clean` | Kill old processes, clear cache, start fresh |
| `npm run dev -- -p 3005` | Start dev server |
| `npm run build` | Production build |
| `npx convex dev` | Start Convex dev server |
| `npx convex deploy` | Deploy Convex schema changes |

## Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: Convex (real-time)
- **Canvas**: tldraw
- **UI**: Radix UI + Tailwind
- **State**: Zustand
- **Deploy**: Vercel (auto-deploy from `develop`)

## Git Workflow

```
develop  → Staging (Vercel preview)
main     → Production
```

## Critical Rules

1. **1 Board = 1 Smart Object** (center zone)
2. **Boards store layout only** - data comes from entities
3. **Workspaces have entity owners** - boards inherit
4. **Next.js 16 uses `proxy.ts`** not `middleware.ts`

## Code Style

- TypeScript strict mode
- ES modules (import/export)
- Prefer Convex mutations over direct writes
- Use Zod for runtime validation

## Architecture

Full architecture documentation:

@ARCHITECTURE.md

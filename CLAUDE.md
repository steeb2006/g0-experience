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

## Adding New Boards

When creating a new board, update ALL of these files:

1. **`lib/mock-data/organization.ts`** - Add board to workspace's `boards` array (fallback data)
2. **`convex/seed.ts`** - Add mutation to create board in Convex (this populates the sidebar!)
3. **`app/[orgId]/[workspaceId]/[boardId]/page.tsx`** - Add routing logic in `renderSmartObject()` to render the component
4. **`components/smart-objects/index.ts`** - Export the new component (if creating a new dashboard component)

Then run the Convex mutation to add the board:
```bash
# In Convex dashboard or via CLI
npx convex run seed:addMyNewBoard
```

Example board entry in organization.ts:
```typescript
{
  id: "board_my_dashboard",
  name: "My Dashboard",
  icon: "LayoutDashboard",  // Lucide icon name
  smartObject: {
    schemaUri: "g0://smart-objects/my-dashboard@1.0",
  },
}
```

Example Convex mutation in seed.ts:
```typescript
export const addMyNewBoard = mutation({
  args: {},
  handler: async (ctx) => {
    const workspace = await ctx.db
      .query("workspaces")
      .withIndex("by_slug", (q) => q.eq("slug", "ws_experimental"))
      .first();

    return await ctx.db.insert("boards", {
      workspaceId: workspace._id,
      name: "My Dashboard",
      slug: "board_my_dashboard",
      smartObjectType: "my-dashboard",
      createdAt: Date.now(),
    });
  },
});
```

## Code Style

- TypeScript strict mode
- ES modules (import/export)
- Prefer Convex mutations over direct writes
- Use Zod for runtime validation

## Architecture

Full architecture documentation:

@ARCHITECTURE.md

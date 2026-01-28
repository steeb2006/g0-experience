# Board Structure Guide

Use this skill when creating or modifying boards in G0 Experience.

## Core Rule: 1 Board = 1 Smart Object

Every board has exactly ONE Smart Object in its center zone.

```
Board
├── Shared Workspace Zone (above) - chat outputs, collaborative artifacts
├── Smart Object Zone (center) - EXACTLY 1 Smart Object
└── Private Workspace Zone (below) - personal notes, drafts
```

## When You Need Multiple Smart Objects

Create a **board of boards** (hierarchy):

```
Parent Board (overview/navigation Smart Object)
├── Sub-Board A (1 Smart Object)
├── Sub-Board B (1 Smart Object)
└── Sub-Board C (1 Smart Object)
```

## Entity Inheritance

```
Workspace (entity: "co-CFO")
└── Board (inherits "co-CFO")
    └── Sub-Board (inherits "co-CFO", unless overridden)
```

## What Boards Store

| Stored | NOT Stored |
|--------|------------|
| Smart Object reference | Smart Object data |
| Layout/viewport config | Entity context |
| Zone contents (chat outputs) | Business data |
| Sub-board references | Raw source data |

## Creating a Board

```typescript
// Convex mutation
await ctx.db.insert("boards", {
  workspaceId: workspace._id,
  name: "Client Profile",
  layout: {
    viewport: { x: 0, y: 0, zoom: 1 },
    zones: {}
  },
  // entityOverride: "co-HR" // only if different from workspace
});
```

## Creating Sub-Boards

```typescript
await ctx.db.insert("boards", {
  workspaceId: workspace._id,
  parentBoardId: parentBoard._id,  // Makes it a sub-board
  name: "Financial Details",
  layout: { ... }
});
```

## Checklist

- [ ] Board has exactly 1 Smart Object reference
- [ ] Sub-boards have parentBoardId set
- [ ] Entity inheritance is correct (or explicitly overridden)
- [ ] Layout includes viewport defaults

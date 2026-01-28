import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Organization hierarchy
  organizations: defineTable({
    name: v.string(),
    slug: v.string(),
    settings: v.optional(v.any()),
    createdAt: v.number(),
  }).index("by_slug", ["slug"]),

  workspaces: defineTable({
    organizationId: v.id("organizations"),
    name: v.string(),
    slug: v.string(),
    entityOwnerId: v.string(), // e.g., "co-CFO", "co-CHRO"
    entityName: v.string(),
    icon: v.optional(v.string()),
    description: v.optional(v.string()),
    settings: v.optional(v.any()),
    createdAt: v.number(),
  })
    .index("by_org", ["organizationId"])
    .index("by_slug", ["slug"]),

  boards: defineTable({
    workspaceId: v.id("workspaces"),
    parentBoardId: v.optional(v.id("boards")),
    name: v.string(),
    slug: v.string(),
    smartObjectType: v.optional(v.string()), // e.g., "finance-dashboard", "hr-dashboard"
    layout: v.optional(
      v.object({
        viewport: v.object({
          x: v.number(),
          y: v.number(),
          zoom: v.number(),
        }),
      })
    ),
    entityOverride: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_workspace", ["workspaceId"])
    .index("by_parent", ["parentBoardId"])
    .index("by_slug", ["slug"]),

  // Chat & artifacts
  chatMessages: defineTable({
    boardId: v.id("boards"),
    role: v.union(
      v.literal("user"),
      v.literal("entity"),
      v.literal("system")
    ),
    content: v.string(),
    entityName: v.optional(v.string()),
    timestamp: v.number(),
  }).index("by_board", ["boardId"]),

  artifacts: defineTable({
    boardId: v.id("boards"),
    chatMessageId: v.optional(v.id("chatMessages")),
    type: v.string(), // "pdf", "chart", "table", "image", "text"
    title: v.string(),
    content: v.optional(v.any()),
    position: v.optional(v.object({ x: v.number(), y: v.number() })),
    zone: v.optional(v.union(v.literal("shared"), v.literal("private"))),
    createdAt: v.number(),
  })
    .index("by_board", ["boardId"])
    .index("by_message", ["chatMessageId"]),

  // Document storage (files)
  documents: defineTable({
    workspaceId: v.id("workspaces"),
    boardId: v.optional(v.id("boards")),
    storageId: v.id("_storage"),
    name: v.string(),
    mimeType: v.string(),
    size: v.number(),
    url: v.string(),
    createdAt: v.number(),
  })
    .index("by_workspace", ["workspaceId"])
    .index("by_board", ["boardId"]),

  // Entity tools configuration
  entityTools: defineTable({
    entityId: v.string(),
    tools: v.array(
      v.object({
        name: v.string(),
        description: v.string(),
        parameters: v.optional(v.any()),
      })
    ),
  }).index("by_entity", ["entityId"]),
});

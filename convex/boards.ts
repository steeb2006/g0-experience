import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("boards").collect();
  },
});

export const listByWorkspace = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("boards")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", args.workspaceId))
      .collect();
  },
});

export const listRootByWorkspace = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, args) => {
    const boards = await ctx.db
      .query("boards")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", args.workspaceId))
      .collect();
    // Return only boards without a parent (root boards)
    return boards.filter((b) => !b.parentBoardId);
  },
});

export const listSubBoards = query({
  args: { parentBoardId: v.id("boards") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("boards")
      .withIndex("by_parent", (q) => q.eq("parentBoardId", args.parentBoardId))
      .collect();
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("boards")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
  },
});

export const getById = query({
  args: { id: v.id("boards") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Get board with its workspace info
export const getWithWorkspace = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const board = await ctx.db
      .query("boards")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    if (!board) return null;

    const workspace = await ctx.db.get(board.workspaceId);
    return { board, workspace };
  },
});

// Update board layout (viewport position)
export const updateLayout = mutation({
  args: {
    id: v.id("boards"),
    layout: v.object({
      viewport: v.object({
        x: v.number(),
        y: v.number(),
        zoom: v.number(),
      }),
    }),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { layout: args.layout });
  },
});

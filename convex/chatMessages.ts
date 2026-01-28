import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const listByBoard = query({
  args: { boardId: v.id("boards") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("chatMessages")
      .withIndex("by_board", (q) => q.eq("boardId", args.boardId))
      .order("asc")
      .collect();
  },
});

export const send = mutation({
  args: {
    boardId: v.id("boards"),
    role: v.union(v.literal("user"), v.literal("entity"), v.literal("system")),
    content: v.string(),
    entityName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("chatMessages", {
      boardId: args.boardId,
      role: args.role,
      content: args.content,
      entityName: args.entityName,
      timestamp: Date.now(),
    });
  },
});

export const deleteMessage = mutation({
  args: { id: v.id("chatMessages") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const clearBoardMessages = mutation({
  args: { boardId: v.id("boards") },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("chatMessages")
      .withIndex("by_board", (q) => q.eq("boardId", args.boardId))
      .collect();

    for (const msg of messages) {
      await ctx.db.delete(msg._id);
    }

    return { deleted: messages.length };
  },
});

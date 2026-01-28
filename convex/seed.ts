import { mutation } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// Seed data based on lib/mock-data/organization.ts
export const seedDatabase = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if already seeded
    const existingOrg = await ctx.db
      .query("organizations")
      .withIndex("by_slug", (q) => q.eq("slug", "sns"))
      .first();

    if (existingOrg) {
      return { status: "already_seeded", organizationId: existingOrg._id };
    }

    const now = Date.now();

    // Create organization
    const orgId = await ctx.db.insert("organizations", {
      name: "SNS",
      slug: "sns",
      createdAt: now,
    });

    // Workspace data
    const workspacesData = [
      {
        slug: "ws_finance",
        name: "Finance",
        entityOwnerId: "entity_cfo",
        entityName: "co-CFO",
        icon: "DollarSign",
        boards: [
          {
            slug: "board_overview",
            name: "Finance Overview",
            smartObjectType: "finance-kpi-dashboard",
            subBoards: [
              { slug: "board_controlling", name: "Controlling", smartObjectType: "cost-center-analysis" },
              { slug: "board_cash", name: "Cash Flow", smartObjectType: "cash-flow-overview" },
              { slug: "board_hr", name: "HR Costs", smartObjectType: "headcount-costs" },
              { slug: "board_forecast", name: "Forecast", smartObjectType: "forecast-dashboard" },
            ],
          },
        ],
      },
      {
        slug: "ws_hr",
        name: "Human Resources",
        entityOwnerId: "entity_chro",
        entityName: "co-CHRO",
        icon: "Users",
        boards: [
          {
            slug: "board_hr_overview",
            name: "People & Culture",
            smartObjectType: "hr-dashboard",
            subBoards: [
              { slug: "board_recruiting", name: "Recruiting", smartObjectType: "recruiting-dashboard" },
              { slug: "board_compensation", name: "Compensation", smartObjectType: "compensation-dashboard" },
              { slug: "board_learning", name: "Learning", smartObjectType: "learning-dashboard" },
              { slug: "board_offboard", name: "Offboarding", smartObjectType: "offboarding-dashboard" },
            ],
          },
        ],
      },
      {
        slug: "ws_sales",
        name: "Sales",
        entityOwnerId: "entity_cso",
        entityName: "co-CSO",
        icon: "TrendingUp",
        boards: [
          {
            slug: "board_launch_campaign",
            name: "Launch Campaign",
            smartObjectType: "launch-campaign-dashboard",
            subBoards: [
              { slug: "board_campaign_planning", name: "Planning", smartObjectType: "campaign-planning" },
              { slug: "board_campaign_execution", name: "Execution", smartObjectType: "campaign-execution" },
              { slug: "board_campaign_analytics", name: "Analytics", smartObjectType: "campaign-analytics" },
            ],
          },
          {
            slug: "board_customers",
            name: "Customers",
            smartObjectType: "customers-overview",
            subBoards: [
              { slug: "board_customer_360", name: "360View", smartObjectType: "customer-360" },
              { slug: "board_customer_health", name: "Health Scores", smartObjectType: "customer-health" },
              { slug: "board_customer_expansion", name: "Expansion", smartObjectType: "customer-expansion" },
            ],
          },
        ],
      },
      {
        slug: "ws_operations",
        name: "Operations",
        entityOwnerId: "entity_coo",
        entityName: "co-COO",
        icon: "Settings",
        boards: [
          { slug: "board_process", name: "Process Dashboard", smartObjectType: "process-dashboard", subBoards: [] },
          { slug: "board_team", name: "Team Overview", smartObjectType: "team-overview", subBoards: [] },
        ],
      },
    ];

    // Create workspaces and boards
    for (const wsData of workspacesData) {
      const workspaceId = await ctx.db.insert("workspaces", {
        organizationId: orgId,
        name: wsData.name,
        slug: wsData.slug,
        entityOwnerId: wsData.entityOwnerId,
        entityName: wsData.entityName,
        icon: wsData.icon,
        createdAt: now,
      });

      // Create boards for this workspace
      for (const boardData of wsData.boards) {
        const boardId = await ctx.db.insert("boards", {
          workspaceId,
          name: boardData.name,
          slug: boardData.slug,
          smartObjectType: boardData.smartObjectType,
          createdAt: now,
        });

        // Create sub-boards
        if (boardData.subBoards) {
          for (const subBoardData of boardData.subBoards) {
            await ctx.db.insert("boards", {
              workspaceId,
              parentBoardId: boardId,
              name: subBoardData.name,
              slug: subBoardData.slug,
              smartObjectType: subBoardData.smartObjectType,
              createdAt: now,
            });
          }
        }
      }
    }

    return { status: "seeded", organizationId: orgId };
  },
});

// Clear all data (useful for re-seeding)
export const clearDatabase = mutation({
  args: {},
  handler: async (ctx) => {
    // Delete in reverse order of dependencies
    const artifacts = await ctx.db.query("artifacts").collect();
    for (const artifact of artifacts) {
      await ctx.db.delete(artifact._id);
    }

    const chatMessages = await ctx.db.query("chatMessages").collect();
    for (const msg of chatMessages) {
      await ctx.db.delete(msg._id);
    }

    const documents = await ctx.db.query("documents").collect();
    for (const doc of documents) {
      await ctx.db.delete(doc._id);
    }

    const boards = await ctx.db.query("boards").collect();
    for (const board of boards) {
      await ctx.db.delete(board._id);
    }

    const workspaces = await ctx.db.query("workspaces").collect();
    for (const ws of workspaces) {
      await ctx.db.delete(ws._id);
    }

    const organizations = await ctx.db.query("organizations").collect();
    for (const org of organizations) {
      await ctx.db.delete(org._id);
    }

    const entityTools = await ctx.db.query("entityTools").collect();
    for (const tool of entityTools) {
      await ctx.db.delete(tool._id);
    }

    return { status: "cleared" };
  },
});

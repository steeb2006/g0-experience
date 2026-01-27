"use client";

import { useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minimize2, Settings, Sparkles, ChevronDown, RotateCcw, Copy, ThumbsUp, ThumbsDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui";
import { Text } from "@/components/smart-objects/atomics";
import { ArtifactsPanel } from "./ArtifactsPanel";
import { EntityToolsPanel } from "./EntityToolsPanel";
import { ChatMessages } from "./ChatMessages";
import { ChatInput } from "./ChatInput";
import type { EntityTool } from "@/lib/mock-data/entity-tools";
import { useChatStore, useCustomer360Store, useNavigationStore, useOverlayStore } from "@/lib/stores";
import { sampleChatMessages, sampleArtifacts } from "@/lib/mock-data/chat-artifacts";
import { hrSampleChatMessages, hrSampleArtifacts, flightRiskResponse } from "@/lib/mock-data/hr-chat";
import { salesSampleChatMessages, salesSampleArtifacts } from "@/lib/mock-data/sales-dashboard";
import { getCustomerByName } from "@/lib/mock-data/customer-360";
import { getPersonDetailByName } from "@/lib/mock-data/person-detail";

interface ChatPanelProps {
  entityName?: string;
  className?: string;
}

export function ChatPanel({ entityName = "co-CFO", className }: ChatPanelProps) {
  const {
    isPanelOpen,
    closePanel,
    messages,
    addMessage,
    artifacts,
    addArtifact,
    setEntityTyping,
    clearMessages,
    clearArtifacts,
  } = useChatStore();

  const { searchCustomer } = useCustomer360Store();
  const { currentBoardId } = useNavigationStore();
  const { openPersonDetail } = useOverlayStore();

  const prevEntityRef = useRef<string | null>(null);
  const hasLoadedRef = useRef(false);

  // Load sample data based on entity - runs when entity changes
  useEffect(() => {
    const shouldReload = prevEntityRef.current !== null && prevEntityRef.current !== entityName;
    const isInitialLoad = prevEntityRef.current === null && !hasLoadedRef.current;

    if (shouldReload || isInitialLoad) {
      // Clear existing data
      clearMessages();
      clearArtifacts();

      // Load appropriate data for entity
      if (entityName === "co-CHRO") {
        hrSampleChatMessages.forEach((msg) => addMessage(msg));
        hrSampleArtifacts.forEach((art) => addArtifact(art));
      } else if (entityName === "co-CSO") {
        salesSampleChatMessages.forEach((msg) => addMessage(msg));
        salesSampleArtifacts.forEach((art) => addArtifact(art));
      } else {
        sampleChatMessages.forEach((msg) => addMessage(msg));
        sampleArtifacts.forEach((art) => addArtifact(art));
      }

      hasLoadedRef.current = true;
    }

    prevEntityRef.current = entityName;
  }, [entityName, addMessage, addArtifact, clearMessages, clearArtifacts]);

  // Handle tool selection from the panel (could be used for analytics, etc.)
  const handleToolSelect = useCallback(
    (_tool: EntityTool) => {
      // Tool selection is now handled visually in ChatInput
      // This callback can be used for tracking/analytics if needed
    },
    []
  );

  // Close on Escape
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && isPanelOpen) {
        closePanel();
      }
    },
    [isPanelOpen, closePanel]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Handle sending a message with special responses based on entity and board context
  const handleSend = useCallback(
    (content: string) => {
      // Add user message
      const userMessage = {
        id: `msg_${Date.now()}`,
        role: "user" as const,
        content,
        timestamp: new Date().toISOString(),
      };
      addMessage(userMessage);

      // Simulate entity typing
      setEntityTyping(true);

      const lowerContent = content.toLowerCase();

      // Helper to create entity message
      const createResponse = (responseContent: string) => ({
        id: `msg_${Date.now() + 1}`,
        role: "entity" as const,
        content: responseContent,
        timestamp: new Date().toISOString(),
      });

      // Simulate entity response
      setTimeout(() => {
        setEntityTyping(false);

        // ============================================
        // FINANCE BOARD RESPONSES (co-CFO)
        // ============================================

        // Finance Overview (board_overview)
        if (lowerContent.includes("runway")) {
          addMessage(createResponse(`**Current Runway Analysis:**\n\nBased on current burn rate and cash position:\n\n- **Cash on Hand:** $4.2M\n- **Monthly Burn:** $198K\n- **Runway:** 21 months\n\n**Factors:**\n- Revenue growing 18% QoQ\n- OpEx stable at $1.8M/month\n- No major CapEx planned\n\nWe're in a healthy position with runway extending to Q3 2027.`));
        }
        else if (lowerContent.includes("ytd") && lowerContent.includes("revenue")) {
          addMessage(createResponse(`**YTD Revenue vs Budget:**\n\n| Metric | Actual | Budget | Variance |\n|--------|--------|--------|----------|\n| Q1 Revenue | $4.8M | $4.5M | +6.7% |\n| Q2 Revenue | $5.2M | $5.0M | +4.0% |\n| Q3 Revenue | $5.6M | $5.5M | +1.8% |\n| **YTD Total** | **$15.6M** | **$15.0M** | **+4.0%** |\n\nWe're tracking **$600K ahead of budget** with strong performance in Enterprise segment.`));
        }
        else if (lowerContent.includes("kpi") && lowerContent.includes("attention")) {
          addMessage(createResponse(`**KPIs Requiring Attention:**\n\n🔴 **Critical:**\n- **Customer Churn:** 4.2% (target: <3%)\n- **CAC Payback:** 18 months (target: <14)\n\n🟡 **Watch:**\n- **Gross Margin:** 68% (target: 72%)\n- **NRR:** 108% (target: 115%)\n\n🟢 **On Track:**\n- ARR Growth, Cash Position, OpEx Ratio\n\nRecommend focusing on retention initiatives this quarter.`));
        }

        // Controlling (board_controlling)
        else if (lowerContent.includes("cost center") && lowerContent.includes("over budget")) {
          addMessage(createResponse(`**Cost Centers Over Budget:**\n\n| Department | Budget | Actual | Variance |\n|------------|--------|--------|----------|\n| Engineering | $1.2M | $1.35M | +12.5% |\n| Marketing | $450K | $520K | +15.6% |\n| Facilities | $180K | $195K | +8.3% |\n\n**Root Causes:**\n- Engineering: Unplanned contractor spend for security audit\n- Marketing: Additional trade show added mid-quarter\n- Facilities: HVAC emergency repair\n\nTotal overage: **$240K** (3.2% of total budget)`));
        }
        else if (lowerContent.includes("opex") && lowerContent.includes("department")) {
          addMessage(createResponse(`**OpEx Breakdown by Department:**\n\n| Department | Monthly | % of Total |\n|------------|---------|------------|\n| Engineering | $850K | 42% |\n| Sales | $420K | 21% |\n| Marketing | $280K | 14% |\n| Operations | $220K | 11% |\n| G&A | $180K | 9% |\n| HR | $60K | 3% |\n| **Total** | **$2.01M** | **100%** |\n\nEngineering is the largest cost center, driven by headcount growth.`));
        }
        else if (lowerContent.includes("variance analysis")) {
          addMessage(createResponse(`**Q4 Variance Analysis:**\n\n**Favorable Variances (+$320K):**\n- Deferred hiring: +$180K\n- Vendor renegotiations: +$85K\n- Travel savings: +$55K\n\n**Unfavorable Variances (-$185K):**\n- AWS overage: -$95K\n- Legal fees: -$60K\n- Recruiting costs: -$30K\n\n**Net Variance: +$135K (favorable)**\n\nMain driver: Slower hiring pace in Q4.`));
        }

        // Cash Flow (board_cash)
        else if (lowerContent.includes("cash") && (lowerContent.includes("forecast") || lowerContent.includes("q1"))) {
          addMessage(createResponse(`**Q1 2026 Cash Flow Forecast:**\n\n**Key Highlights:**\n• Opening Balance: $4.2M\n• Projected Inflows: $2.8M\n• Projected Outflows: $2.1M\n• Closing Balance: $4.9M\n• Runway: 21 months\n\nThe forecast shows a healthy improvement in cash position driven by Q4 collections and controlled OpEx.`));
          addArtifact({
            id: `artifact_q1_forecast_${Date.now()}`,
            type: "pdf",
            title: "Q1 2026 Cash Forecast",
            thumbnail: "/thumbnails/q1-forecast.png",
            createdAt: new Date().toISOString(),
            zone: "shared",
          });
        }
        else if (lowerContent.includes("accounts receivable") || lowerContent.includes("ar aging")) {
          addMessage(createResponse(`**Accounts Receivable Aging:**\n\n| Aging Bucket | Amount | % of Total |\n|--------------|--------|------------|\n| Current (0-30) | $1.8M | 62% |\n| 31-60 days | $680K | 23% |\n| 61-90 days | $290K | 10% |\n| 90+ days | $145K | 5% |\n| **Total AR** | **$2.92M** | **100%** |\n\n**Action Items:**\n- 3 accounts in 90+ need escalation ($95K)\n- DSO: 42 days (industry avg: 45)\n- Collection rate: 94%`));
        }
        else if (lowerContent.includes("cash crunch")) {
          addMessage(createResponse(`**Cash Crunch Analysis:**\n\nBased on current projections, **no cash crunch anticipated** in the next 12 months.\n\n**Stress Scenarios:**\n\n| Scenario | Crunch Date | Mitigation |\n|----------|-------------|------------|\n| 20% revenue drop | Month 14 | Reduce OpEx 15% |\n| Major customer churn | Month 11 | Accelerate collections |\n| Delayed fundraise | Month 16 | Bridge financing |\n\n**Current Buffer:** 21 months runway\n**Recommended Reserve:** 6 months OpEx ($12M)`));
        }

        // HR Costs in Finance (board_hr in finance)
        else if (lowerContent.includes("hr cost per employee")) {
          addMessage(createResponse(`**HR Cost Per Employee Analysis:**\n\n| Cost Category | Annual/FTE | % of Total |\n|---------------|------------|------------|\n| Base Salary | $125K | 68% |\n| Benefits | $28K | 15% |\n| Equity | $18K | 10% |\n| Training | $5K | 3% |\n| Equipment | $4K | 2% |\n| Other | $4K | 2% |\n| **Total** | **$184K** | **100%** |\n\nCompared to industry benchmark of $172K, we're 7% higher due to competitive benefits package.`));
        }
        else if (lowerContent.includes("benefits utilization")) {
          addMessage(createResponse(`**Benefits Utilization Report:**\n\n| Benefit | Enrolled | Utilizing | Rate |\n|---------|----------|-----------|------|\n| Health Insurance | 152 | 148 | 97% |\n| 401(k) | 156 | 134 | 86% |\n| HSA | 89 | 72 | 81% |\n| Gym Stipend | 156 | 67 | 43% |\n| Learning Budget | 156 | 45 | 29% |\n\n**Recommendation:** Learning budget underutilized - consider awareness campaign.`));
        }
        else if (lowerContent.includes("hr spend") && lowerContent.includes("yoy")) {
          addMessage(createResponse(`**HR Spend YoY Comparison:**\n\n| Category | 2024 | 2025 | Change |\n|----------|------|------|--------|\n| Salaries | $15.2M | $18.4M | +21% |\n| Benefits | $3.8M | $4.4M | +16% |\n| Recruiting | $420K | $680K | +62% |\n| Training | $280K | $390K | +39% |\n| **Total** | **$19.7M** | **$23.9M** | **+21%** |\n\nHeadcount grew 18%, total spend up 21% - driven by market rate adjustments.`));
        }

        // Forecast (board_forecast)
        else if (lowerContent.includes("q2") && lowerContent.includes("revenue")) {
          addMessage(createResponse(`**Q2 2026 Revenue Projection:**\n\n**Projected: $6.1M** (+17% QoQ)\n\n**Breakdown:**\n| Segment | Projection | Confidence |\n|---------|------------|------------|\n| Enterprise | $3.2M | High |\n| Mid-Market | $1.8M | Medium |\n| SMB | $1.1M | High |\n\n**Key Drivers:**\n- 3 Enterprise deals closing ($1.2M total)\n- New product launch impact: +$400K\n- Seasonal SMB uptick: +$200K`));
        }
        else if (lowerContent.includes("12-month") || lowerContent.includes("12 month")) {
          addMessage(createResponse(`**12-Month Financial Forecast:**\n\n| Quarter | Revenue | EBITDA | Cash |\n|---------|---------|--------|------|\n| Q1 2026 | $5.8M | -$180K | $4.9M |\n| Q2 2026 | $6.1M | -$120K | $4.7M |\n| Q3 2026 | $6.5M | +$50K | $4.8M |\n| Q4 2026 | $7.0M | +$220K | $5.1M |\n\n**Key Milestones:**\n- Break-even: Q3 2026\n- $25M ARR: Q4 2026\n- Profitability: Q1 2027`));
          addArtifact({
            id: `artifact_12m_forecast_${Date.now()}`,
            type: "chart",
            title: "12-Month Forecast Model",
            thumbnail: "/thumbnails/forecast.png",
            createdAt: new Date().toISOString(),
            zone: "shared",
          });
        }
        else if (lowerContent.includes("assumptions")) {
          addMessage(createResponse(`**Forecast Key Assumptions:**\n\n**Revenue:**\n- ARR growth: 45% YoY\n- Net Revenue Retention: 115%\n- New logo acquisition: 8/month\n- Average deal size: $85K\n\n**Costs:**\n- Headcount growth: 25%\n- Salary inflation: 4%\n- AWS costs: +15% with scale\n- Marketing: 18% of revenue\n\n**Risks:**\n- Enterprise deal slippage: Medium\n- Competitive pressure: Low\n- Macro environment: Medium`));
        }

        // ============================================
        // HR BOARD RESPONSES (co-CHRO)
        // ============================================

        // Person detail overlay - "show me [name]", "show Sarah", "Mike", etc. for HR team members
        else if (entityName === "co-CHRO") {
          // Check if the message might be asking about a person
          const mightBePersonQuery =
            lowerContent.includes("show") ||
            lowerContent.includes("open") ||
            lowerContent.includes("tell me about") ||
            lowerContent.includes("who is") ||
            lowerContent.includes("profile") ||
            // Also check for direct name mentions (first names)
            /\b(sarah|mike|lisa|john|emma|alex|rachel)\b/i.test(lowerContent);

          if (mightBePersonQuery) {
            const person = getPersonDetailByName(content);
            if (person) {
              openPersonDetail(person);
              addMessage(createResponse(`I've opened **${person.name}**'s profile.\n\n**Quick Overview:**\n- **Title:** ${person.title}\n- **Department:** ${person.department}\n- **Team Size:** ${person.teamSize} people\n- **Engagement:** ${person.engagement}%\n- **Tenure:** ${person.tenure}\n\nYou can see their full profile including skills, certifications, and recent activity in the overlay.`));
              return;
            }
          }
        }

        // HR Overview (board_hr_overview)
        else if (lowerContent.includes("flight risk") || lowerContent.includes("attrition")) {
          const entityMessage = {
            ...flightRiskResponse,
            id: `msg_${Date.now() + 1}`,
            timestamp: new Date().toISOString(),
          };
          addMessage(entityMessage);
          if (flightRiskResponse.artifacts?.[0]) {
            addArtifact({
              ...flightRiskResponse.artifacts[0],
              id: `artifact_flight_risk_${Date.now()}`,
              createdAt: new Date().toISOString(),
              zone: "private",
            });
          }
        }
        else if (lowerContent.includes("headcount") || lowerContent.includes("how many") || lowerContent.includes("team size")) {
          addMessage(createResponse(`**Current Headcount Breakdown:**\n\n**Total: 156 FTE** (+8 YTD)\n\n| Department | Headcount | Change |\n|------------|-----------|--------|\n| Engineering | 45 | +3 |\n| Sales | 32 | +2 |\n| Operations | 28 | +1 |\n| Marketing | 15 | +1 |\n| Finance | 12 | - |\n| HR | 8 | +1 |\n\nEngineering continues to be our fastest growing team with 8 open positions.`));
        }
        else if (lowerContent.includes("engagement") && lowerContent.includes("trend")) {
          addMessage(createResponse(`**Employee Engagement Trend:**\n\n| Quarter | eNPS | Engagement Score |\n|---------|------|------------------|\n| Q1 2025 | 42 | 7.8 |\n| Q2 2025 | 45 | 8.0 |\n| Q3 2025 | 48 | 8.2 |\n| Q4 2025 | 52 | 8.4 |\n\n**Key Drivers of Improvement:**\n- New L&D program launched\n- Flexible work policy expanded\n- Manager training initiative\n\n**Areas to Watch:**\n- Career growth (lowest scoring area)\n- Work-life balance in Engineering`));
        }

        // Recruiting (board_recruiting)
        else if (lowerContent.includes("open position")) {
          addMessage(createResponse(`**Open Positions:**\n\n**Total: 14 open roles**\n\n| Department | Roles | Priority |\n|------------|-------|----------|\n| Engineering | 8 | High |\n| Sales | 3 | High |\n| Marketing | 2 | Medium |\n| Operations | 1 | Low |\n\n**Critical Hires:**\n- Senior Backend Engineer (45 days open)\n- VP Sales (60 days open)\n- Product Manager (30 days open)\n\nAverage time-to-fill: 38 days`));
        }
        else if (lowerContent.includes("time-to-hire") || lowerContent.includes("time to hire")) {
          addMessage(createResponse(`**Time-to-Hire by Role:**\n\n| Role Type | Avg Days | Benchmark |\n|-----------|----------|------------|\n| Engineering | 45 | 42 |\n| Sales | 32 | 35 |\n| Marketing | 28 | 30 |\n| Operations | 25 | 28 |\n| Executive | 65 | 60 |\n\n**Bottlenecks:**\n- Technical interviews taking too long\n- Offer approval process slow\n- Candidate drop-off at final round`));
        }
        else if (lowerContent.includes("recruiting pipeline")) {
          addMessage(createResponse(`**Recruiting Pipeline:**\n\n| Stage | Candidates | Conversion |\n|-------|------------|------------|\n| Applied | 342 | - |\n| Screened | 156 | 46% |\n| Phone Interview | 89 | 57% |\n| Onsite | 34 | 38% |\n| Offer | 12 | 35% |\n| Accepted | 8 | 67% |\n\n**Pipeline Health:** Strong\n**Predicted Hires (30 days):** 6-8\n**Cost per Hire:** $4,200`));
        }

        // Compensation (board_compensation)
        else if (lowerContent.includes("market rate")) {
          addMessage(createResponse(`**Market Rate Comparison:**\n\n| Role | Our Pay | Market | Delta |\n|------|---------|--------|-------|\n| Sr. Engineer | $185K | $178K | +4% |\n| Product Manager | $165K | $170K | -3% |\n| Sales AE | $145K | $140K | +4% |\n| Designer | $135K | $142K | -5% |\n\n**Overall:** 2% above market median\n\n**Action Items:**\n- Product roles need adjustment\n- Design team at risk of attrition`));
        }
        else if (lowerContent.includes("salary band")) {
          addMessage(createResponse(`**Salary Band Distribution:**\n\n| Band | Range | Employees | % |\n|------|-------|-----------|----|\n| L1-L2 | $60-90K | 28 | 18% |\n| L3-L4 | $90-140K | 65 | 42% |\n| L5-L6 | $140-200K | 48 | 31% |\n| L7+ | $200K+ | 15 | 10% |\n\n**Distribution Analysis:**\n- 78% within band mid-point\n- 15% below range (review needed)\n- 7% above range (compression risk)`));
        }
        else if (lowerContent.includes("compensation review")) {
          addMessage(createResponse(`**Upcoming Compensation Reviews:**\n\n**Due This Month:** 12 employees\n\n| Employee | Tenure | Last Review | Recommendation |\n|----------|--------|-------------|----------------|\n| Alex Chen | 2.5 yrs | 14 mo ago | Promote + 15% |\n| Sarah Kim | 1.8 yrs | 12 mo ago | Merit 5% |\n| James Lee | 3.2 yrs | 18 mo ago | Urgent - 10% |\n\n**Budget Impact:** $145K annually\n**Current Utilization:** 72% of merit budget`));
        }

        // Learning (board_learning)
        else if (lowerContent.includes("training completion")) {
          addMessage(createResponse(`**Training Completion Rates:**\n\n| Program | Enrolled | Completed | Rate |\n|---------|----------|-----------|------|\n| Security Awareness | 156 | 148 | 95% |\n| DEI Training | 156 | 142 | 91% |\n| Manager Essentials | 32 | 28 | 88% |\n| Technical Certs | 45 | 31 | 69% |\n| Leadership Dev | 15 | 9 | 60% |\n\n**Note:** Leadership program needs attention - schedule conflicts cited.`));
        }
        else if (lowerContent.includes("courses") && lowerContent.includes("popular")) {
          addMessage(createResponse(`**Most Popular Courses:**\n\n| Course | Enrollments | Rating |\n|--------|-------------|--------|\n| AWS Solutions Architect | 34 | 4.8 |\n| Product Management | 28 | 4.7 |\n| Data Analysis | 25 | 4.6 |\n| Leadership Fundamentals | 22 | 4.5 |\n| Communication Skills | 19 | 4.4 |\n\n**Trending:** AI/ML courses up 150% this quarter\n**Budget Used:** $42K of $60K (70%)`));
        }
        else if (lowerContent.includes("certifications expiring")) {
          addMessage(createResponse(`**Certifications Expiring Soon:**\n\n| Employee | Certification | Expires | Action |\n|----------|---------------|---------|--------|\n| Mike Chen | AWS SA Pro | Feb 15 | Scheduled |\n| Lisa Park | PMP | Mar 1 | Not scheduled |\n| Tom Wilson | CISSP | Mar 15 | Scheduled |\n| Anna Lee | CPA | Apr 1 | In progress |\n\n**Budget Allocated:** $8,500\n**Required Renewals (90 days):** 12`));
        }

        // Offboarding (board_offboard)
        else if (lowerContent.includes("leaving this month")) {
          addMessage(createResponse(`**Departures This Month:**\n\n| Employee | Role | Last Day | Reason |\n|----------|------|----------|--------|\n| John Smith | Sr. Engineer | Jan 31 | New opportunity |\n| Emily Davis | Sales AE | Jan 28 | Relocation |\n| Robert Brown | Designer | Jan 25 | Career change |\n\n**Total:** 3 departures\n**Voluntary:** 3 (100%)\n**Knowledge Transfer:** 2 complete, 1 in progress`));
        }
        else if (lowerContent.includes("voluntary turnover")) {
          addMessage(createResponse(`**Voluntary Turnover Analysis:**\n\n| Period | Rate | Benchmark |\n|--------|------|------------|\n| Q1 2025 | 3.2% | 3.5% |\n| Q2 2025 | 2.8% | 3.5% |\n| Q3 2025 | 3.5% | 3.5% |\n| Q4 2025 | 2.1% | 3.5% |\n\n**Annual Rate:** 11.6% (Industry: 14%)\n\n**By Department:**\n- Engineering: 15% (highest)\n- Sales: 12%\n- Operations: 8% (lowest)`));
        }
        else if (lowerContent.includes("exit interview")) {
          addMessage(createResponse(`**Exit Interview Insights (Last 6 Months):**\n\n**Top Reasons for Leaving:**\n1. Career growth opportunities (42%)\n2. Compensation (28%)\n3. Work-life balance (18%)\n4. Management (12%)\n\n**Positive Feedback:**\n- Culture and team (92% positive)\n- Benefits package (88% positive)\n- Learning opportunities (75% positive)\n\n**Action Items:**\n- Career pathing program in development\n- Comp review cycle accelerated`));
        }

        // ============================================
        // SALES BOARD RESPONSES (co-CSO)
        // ============================================

        // Launch Campaign (board_launch_campaign)
        else if (lowerContent.includes("campaign") || lowerContent.includes("launch")) {
          addMessage(createResponse(`**Spring Product Launch Campaign:**\n\nPerforming **above expectations**:\n\n**Key Metrics:**\n- Total Leads: 2,847 (+34% vs target)\n- Conversion Rate: 12.8% (+2pts)\n- Pipeline Generated: $3.2M\n- ROI: 4.2x\n\n**Top Performing Channels:**\n1. Email Campaign - 18.5% conversion, 8.4x ROI\n2. Partner Referrals - 31.2% conversion\n3. Webinars - 22.4% conversion\n\nCurrently in Pre-Launch Teasers phase (65% complete). Launch on track for March 15th.`));
        }
        else if (lowerContent.includes("conversion rate") && lowerContent.includes("channel")) {
          addMessage(createResponse(`**Conversion Rate by Channel:**\n\n| Channel | Leads | Conversions | Rate |\n|---------|-------|-------------|------|\n| Partner Referrals | 253 | 79 | 31.2% |\n| Webinars | 312 | 70 | 22.4% |\n| Email Campaign | 634 | 117 | 18.5% |\n| LinkedIn Ads | 892 | 127 | 14.2% |\n| Google Ads | 756 | 74 | 9.8% |\n\n**Insight:** Partner and webinar channels have 2x the conversion of paid ads.`));
        }
        else if (lowerContent.includes("lead funnel")) {
          addMessage(createResponse(`**Lead Funnel Analysis:**\n\n| Stage | Count | Conv. % |\n|-------|-------|--------|\n| Visitors | 45,200 | - |\n| MQLs | 2,847 | 6.3% |\n| SQLs | 892 | 31.3% |\n| Opportunities | 312 | 35.0% |\n| Closed Won | 48 | 15.4% |\n\n**Funnel Health:** Healthy\n**Bottleneck:** SQL → Opportunity (sales capacity)\n**Pipeline Value:** $3.2M`));
        }

        // Campaign Planning (board_campaign_planning)
        else if (lowerContent.includes("campaigns") && lowerContent.includes("scheduled")) {
          addMessage(createResponse(`**Scheduled Campaigns:**\n\n| Campaign | Launch | Channel | Budget |\n|----------|--------|---------|--------|\n| Spring Launch | Mar 15 | Multi | $185K |\n| Q2 Webinar Series | Apr 1 | Digital | $45K |\n| Trade Show (RSA) | Apr 28 | Events | $120K |\n| Partner Summit | May 15 | Events | $85K |\n| Summer Promo | Jun 1 | Email | $25K |\n\n**Total Q2 Budget:** $460K\n**Projected Pipeline:** $4.8M`));
        }
        else if (lowerContent.includes("content calendar")) {
          addMessage(createResponse(`**Content Calendar (Next 30 Days):**\n\n| Date | Content | Channel | Owner |\n|------|---------|---------|-------|\n| Jan 28 | Blog: Security Guide | Web | Sarah |\n| Jan 30 | Case Study: TechCorp | Email | Mike |\n| Feb 3 | Webinar: Product Demo | Zoom | Lisa |\n| Feb 7 | Whitepaper Release | Multi | John |\n| Feb 10 | Social Campaign | LinkedIn | Amy |\n\n**Content Pipeline:** 12 pieces in production\n**Approval Queue:** 3 pending`));
        }
        else if (lowerContent.includes("budget allocation")) {
          addMessage(createResponse(`**Marketing Budget Allocation:**\n\n| Category | Budget | Spent | Remaining |\n|----------|--------|-------|----------|\n| Digital Ads | $200K | $145K | $55K |\n| Events | $180K | $42K | $138K |\n| Content | $80K | $38K | $42K |\n| Tools/Tech | $60K | $52K | $8K |\n| Agency | $40K | $28K | $12K |\n| **Total** | **$560K** | **$305K** | **$255K** |\n\n**Burn Rate:** On track (54% used, 50% through year)`));
        }

        // Campaign Execution (board_campaign_execution)
        else if (lowerContent.includes("tasks") && lowerContent.includes("behind")) {
          addMessage(createResponse(`**Tasks Behind Schedule:**\n\n| Task | Owner | Due | Days Late |\n|------|-------|-----|----------|\n| Landing page copy | Sarah | Jan 20 | 5 days |\n| Email templates | Mike | Jan 22 | 3 days |\n| Partner kit | Lisa | Jan 23 | 2 days |\n\n**Blockers:**\n- Landing page: Waiting on legal review\n- Email: Design resource conflict\n- Partner kit: Vendor delay on materials\n\n**Impact:** Launch at risk if not resolved by Jan 30`));
        }
        else if (lowerContent.includes("launch checklist")) {
          addMessage(createResponse(`**Today's Launch Checklist:**\n\n✅ Landing page live\n✅ Email sequences scheduled\n✅ Social posts queued\n⏳ Partner enablement call (2pm)\n⬜ Final creative review\n⬜ Press release approval\n⬜ Sales team briefing (4pm)\n\n**Status:** 3 of 7 complete\n**Launch Readiness:** 72%\n**Go/No-Go Decision:** Today 5pm`));
        }
        else if (lowerContent.includes("blocking execution")) {
          addMessage(createResponse(`**Execution Blockers:**\n\n🔴 **Critical:**\n- Legal hold on product claims (Day 3)\n- AWS capacity for landing page traffic\n\n🟡 **High:**\n- Design team bandwidth (2 days behind)\n- Partner materials not localized\n\n🟢 **Resolved Today:**\n- Budget approval obtained\n- Vendor contract signed\n\n**Escalations Needed:** Legal approval (VP sign-off required)`));
        }

        // Campaign Analytics (board_campaign_analytics)
        else if (lowerContent.includes("roi by channel")) {
          addMessage(createResponse(`**ROI by Channel:**\n\n| Channel | Spend | Revenue | ROI |\n|---------|-------|---------|-----|\n| Email | $12K | $101K | 8.4x |\n| Webinars | $28K | $171K | 6.1x |\n| LinkedIn | $45K | $234K | 5.2x |\n| Partners | $48K | $216K | 4.5x |\n| Google | $52K | $198K | 3.8x |\n\n**Insight:** Email has highest ROI - recommend increasing budget allocation.`));
        }
        else if (lowerContent.includes("attribution")) {
          addMessage(createResponse(`**Attribution Analysis:**\n\n**First Touch:**\n- Organic Search: 35%\n- Paid Ads: 28%\n- Referral: 22%\n- Direct: 15%\n\n**Last Touch:**\n- Email: 42%\n- Sales Outreach: 31%\n- Demo Request: 18%\n- Webinar: 9%\n\n**Multi-Touch (Weighted):**\nAverage 4.2 touches before conversion\nMost common path: Ad → Blog → Email → Demo → Close`));
        }
        else if (lowerContent.includes("creative") && lowerContent.includes("performing")) {
          addMessage(createResponse(`**Creative Performance:**\n\n**Top Performing Ads:**\n| Creative | CTR | Conv. | CPA |\n|----------|-----|-------|-----|\n| "Save 40% ROI" | 3.2% | 8.5% | $42 |\n| Video testimonial | 2.8% | 7.2% | $48 |\n| Product demo GIF | 2.4% | 6.8% | $52 |\n\n**Underperforming:**\n- Generic product shots (0.8% CTR)\n- Feature list ads (1.1% CTR)\n\n**Recommendation:** Scale testimonial content, pause feature ads.`));
        }

        // Customers Overview (board_customers)
        else if (lowerContent.includes("attention") || lowerContent.includes("at risk") || lowerContent.includes("churn")) {
          addMessage(createResponse(`**Accounts Requiring Attention:**\n\n**At Risk:**\n- **CloudNine Systems** (Enterprise, $720K ARR)\n  - Health Score: 45 (down 23pts)\n  - Last contact: 30+ days ago\n  - Action: Schedule executive review\n\n**Churning:**\n- **Summit Retail** (Mid-Market, $145K ARR)\n  - Health Score: 32, NPS: 15 (critical)\n  - Action: Escalate to CS leadership\n\n**Attention:**\n- **DataFlow Inc** (Mid-Market, $185K ARR)\n  - Health Score: 68, Support tickets up 40%\n  - Action: Proactive outreach\n\nTotal ARR at risk: **$1.05M**`));
          addArtifact({
            id: `artifact_at_risk_${Date.now()}`,
            type: "table",
            title: "At-Risk Customers Report",
            thumbnail: "/thumbnails/at-risk.png",
            createdAt: new Date().toISOString(),
            zone: "shared",
          });
        }
        else if (lowerContent.includes("expansion opportunities")) {
          addMessage(createResponse(`**Top Expansion Opportunities:**\n\n| Account | Current ARR | Potential | Score |\n|---------|-------------|-----------|-------|\n| TechCorp Global | $850K | +$320K | 92 |\n| Nordic Industries | $580K | +$220K | 85 |\n| Innovate Labs | $620K | +$180K | 82 |\n| Meridian Health | $210K | +$125K | 78 |\n\n**Total Pipeline:** $972K\n**Avg Expansion Rate:** 28%\n**Next Step:** QBRs scheduled for top 4`));
        }
        else if (lowerContent.includes("nps trend")) {
          addMessage(createResponse(`**NPS Trend Analysis:**\n\n| Quarter | NPS | Responses | Change |\n|---------|-----|-----------|--------|\n| Q1 2025 | 38 | 142 | - |\n| Q2 2025 | 41 | 156 | +3 |\n| Q3 2025 | 39 | 148 | -2 |\n| Q4 2025 | 42 | 165 | +3 |\n\n**Segment Breakdown:**\n- Enterprise: 52 (Promoters)\n- Mid-Market: 41 (Passive)\n- SMB: 35 (At Risk)\n\n**Top Detractor Themes:** Support response time, feature requests`));
        }

        // Customer 360 (board_customer_360)
        else if ((lowerContent.includes("show me") || lowerContent.includes("find") || lowerContent.includes("search") || lowerContent.includes("look up")) &&
                 (lowerContent.includes("mark") || lowerContent.includes("fred") || lowerContent.includes("schneider") || lowerContent.includes("kruger"))) {
          const customer = getCustomerByName(content);
          searchCustomer(content);
          addMessage(createResponse(`**${customer.name}'s Profile Updated**\n\nI've loaded ${customer.name}'s 360View.\n\n**Overview:**\n- **Title:** ${customer.title} at ${customer.company}\n- **ARR:** $${(customer.arr / 1000000).toFixed(1)}M\n- **Industry:** ${customer.industry}\n- **Health Score:** ${customer.healthScore}\n- **NPS:** ${customer.nps}\n\n**Quick Facts:**\n${customer.funFacts.map(f => `- ${f}`).join('\n')}\n\n**Network:** ${customer.networkSize} peer connections available.`));
        }
        else if (lowerContent.includes("highest arr")) {
          addMessage(createResponse(`**Customers by ARR (Top 5):**\n\n| Rank | Customer | ARR | Health |\n|------|----------|-----|--------|\n| 1 | TechCorp Global | $850K | 92 |\n| 2 | CloudNine Systems | $720K | 45 |\n| 3 | Innovate Labs | $620K | 85 |\n| 4 | Nordic Industries | $580K | 78 |\n| 5 | Meridian Health | $210K | 88 |\n\n**Note:** CloudNine is highest-risk high-ARR account. Recommend executive review.`));
        }

        // Customer Health (board_customer_health)
        else if (lowerContent.includes("accounts") && lowerContent.includes("risk")) {
          addMessage(createResponse(`**At-Risk Account Analysis:**\n\n**Critical (Health < 40):**\n- Summit Retail: 32 (churning signals)\n- DataTech Inc: 38 (support escalations)\n\n**Warning (Health 40-60):**\n- CloudNine Systems: 45 (engagement drop)\n- Vista Corp: 52 (delayed renewal)\n- Apex Solutions: 58 (champion left)\n\n**Total At Risk:** 5 accounts, $1.4M ARR\n**30-Day Forecast:** 2 likely to churn without intervention`));
        }
        else if (lowerContent.includes("health score trend")) {
          addMessage(createResponse(`**Health Score Trends (90 Days):**\n\n**Improving (+10 pts):**\n- Innovate Labs: 75 → 85\n- Meridian Health: 80 → 88\n\n**Declining (-10 pts):**\n- CloudNine: 68 → 45 ⚠️\n- Summit Retail: 48 → 32 ⚠️\n\n**Stable:**\n- TechCorp: 92 → 92\n- Nordic: 76 → 78\n\n**Overall Portfolio:** 78 avg (-2 from last quarter)`));
        }
        else if (lowerContent.includes("contacted recently") || lowerContent.includes("contact")) {
          addMessage(createResponse(`**Accounts Without Recent Contact:**\n\n| Account | Last Contact | Days | ARR |\n|---------|--------------|------|-----|\n| CloudNine Systems | Dec 20 | 38 | $720K |\n| Summit Retail | Nov 30 | 58 | $145K |\n| TechStart Inc | Jan 5 | 22 | $85K |\n| GrowthCo | Jan 8 | 19 | $62K |\n\n**SLA Breach (>30 days):** 2 accounts\n**ARR at Risk:** $865K\n**Action:** Immediate outreach scheduled`));
        }

        // Customer Expansion (board_customer_expansion)
        else if (lowerContent.includes("expansion pipeline")) {
          addMessage(createResponse(`**Expansion Pipeline:**\n\n**Total:** $1.2M potential expansion\n\n| Stage | Accounts | Value |\n|-------|----------|-------|\n| Qualified | 8 | $480K |\n| Proposal | 4 | $320K |\n| Negotiation | 3 | $280K |\n| Verbal Commit | 2 | $120K |\n\n**Expected Close (Q1):** $400K\n**Expansion Rate Target:** 115% NRR`));
        }
        else if (lowerContent.includes("ready for upsell")) {
          addMessage(createResponse(`**Upsell-Ready Accounts:**\n\n| Account | Signal | Opportunity |\n|---------|--------|-------------|\n| TechCorp | Usage 95% of limit | +$150K |\n| Innovate Labs | Requested features | +$80K |\n| Nordic | Team growth +40% | +$120K |\n| Meridian | New department | +$65K |\n\n**Qualification Criteria:**\n- Health Score > 75\n- Product usage > 80%\n- Active engagement last 30 days`));
        }
        else if (lowerContent.includes("cross-sell")) {
          addMessage(createResponse(`**Cross-Sell Opportunities:**\n\n| Account | Current | Cross-Sell | Value |\n|---------|---------|------------|-------|\n| TechCorp | Core | Analytics+ | $85K |\n| Nordic | Core + API | Security | $45K |\n| Meridian | Core | Integration | $35K |\n\n**Product Affinity Analysis:**\n- Core → Analytics: 42% attach rate\n- Core → API: 28% attach rate\n- Core → Security: 18% attach rate\n\n**Recommended Focus:** Analytics cross-sell (highest close rate)`));
        }

        // Default fallback
        else {
          addMessage(createResponse(`I've received your request: "${content}". Let me analyze the data and get back to you with insights.\n\n*Try asking specific questions like:*\n- "What's our current runway?"\n- "Show me flight risk employees"\n- "How is the campaign performing?"`));
        }
      }, 1500);
    },
    [addMessage, setEntityTyping, addArtifact, searchCustomer, openPersonDetail, entityName]
  );

  return (
    <AnimatePresence>
      {isPanelOpen && (
        <motion.div
          initial={{ x: 360, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 360, opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className={cn(
            "fixed right-0 top-0 z-40 flex h-full w-[360px] flex-col",
            "border-l border-[var(--g0-bg-elevated-3)] bg-[var(--g0-bg-base)]",
            className
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[var(--g0-bg-elevated-3)] px-4 py-2.5">
            <div className="flex items-center gap-3">
              {/* Model selector dropdown */}
              <button className="flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-[var(--g0-bg-elevated-2)] transition-colors">
                <Sparkles className="h-3.5 w-3.5 text-[var(--g0-accent-primary)]" />
                <span className="text-[12px] font-medium text-[var(--g0-text-primary)]">{entityName}</span>
                <ChevronDown className="h-3 w-3 text-[var(--g0-text-muted)]" />
              </button>
            </div>
            <div className="flex items-center gap-0.5">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-[var(--g0-text-muted)] hover:text-[var(--g0-text-primary)]"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-[var(--g0-text-muted)] hover:text-[var(--g0-text-primary)]"
              >
                <Settings className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-[var(--g0-text-muted)] hover:text-[var(--g0-text-primary)]"
                onClick={closePanel}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          {/* Entity Tools Panel */}
          <EntityToolsPanel
            entityName={entityName}
            onToolSelect={handleToolSelect}
          />

          {/* Artifacts Panel */}
          <ArtifactsPanel />

          {/* Messages */}
          <ChatMessages entityName={entityName} boardId={currentBoardId} onSuggestionClick={handleSend} />

          {/* Input */}
          <ChatInput entityName={entityName} onSend={handleSend} onToolSelect={handleToolSelect} />

          {/* Footer hints */}
          <div className="px-4 pb-2">
            <p className="text-[9px] text-[var(--g0-text-muted)] text-center">
              {entityName} can make mistakes. Verify important information.
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ChatMessage } from "./ChatMessage";
import { Text } from "@/components/smart-objects/atomics";
import { useChatStore } from "@/lib/stores";

// Board-specific suggested questions (with fallback to entity)
const boardQuestions: Record<string, string[]> = {
  // Finance boards
  "board_overview": [
    "What's our current runway?",
    "Show me YTD revenue vs budget",
    "Which KPIs need attention?",
  ],
  "board_controlling": [
    "Which cost centers are over budget?",
    "Show me OpEx breakdown by department",
    "What's the variance analysis?",
  ],
  "board_cash": [
    "What's the Q1 cash flow forecast?",
    "Show me accounts receivable aging",
    "When is our next cash crunch?",
  ],
  "board_hr": [
    "What's the total HR cost per employee?",
    "Show me benefits utilization",
    "Compare HR spend YoY",
  ],
  "board_forecast": [
    "What's the Q2 revenue projection?",
    "Show me the 12-month forecast",
    "What are the key assumptions?",
  ],

  // HR boards
  "board_hr_overview": [
    "Show me flight risk employees",
    "What's the headcount by department?",
    "How is employee engagement trending?",
  ],
  "board_recruiting": [
    "How many open positions do we have?",
    "What's our time-to-hire by role?",
    "Show me the recruiting pipeline",
  ],
  "board_compensation": [
    "How do we compare to market rates?",
    "Show me the salary band distribution",
    "Who is due for a compensation review?",
  ],
  "board_learning": [
    "What's the training completion rate?",
    "Which courses are most popular?",
    "Show me certifications expiring soon",
  ],
  "board_offboard": [
    "Who is leaving this month?",
    "What's our voluntary turnover rate?",
    "Show me exit interview insights",
  ],

  // Sales boards
  "board_launch_campaign": [
    "How is the campaign performing?",
    "What's our conversion rate by channel?",
    "Show me the lead funnel",
  ],
  "board_campaign_planning": [
    "What campaigns are scheduled?",
    "Show me the content calendar",
    "What's our budget allocation?",
  ],
  "board_campaign_execution": [
    "Which tasks are behind schedule?",
    "Show me today's launch checklist",
    "What's blocking execution?",
  ],
  "board_campaign_analytics": [
    "What's the ROI by channel?",
    "Show me attribution analysis",
    "Which creative is performing best?",
  ],
  "board_customers": [
    "Which customers need attention?",
    "Show me expansion opportunities",
    "What's our NPS trend?",
  ],
  "board_customer_360": [
    "Show me Mark Schneider",
    "Show me Fred Kruger",
    "Who has the highest ARR?",
  ],
  "board_customer_health": [
    "Which accounts are at risk?",
    "Show me health score trends",
    "Who hasn't been contacted recently?",
  ],
  "board_customer_expansion": [
    "What's our total expansion pipeline?",
    "Which accounts are ready for upsell?",
    "Show me cross-sell opportunities",
  ],
};

// Fallback entity-level questions
const entityQuestions: Record<string, string[]> = {
  "co-CFO": [
    "What's the Q1 cash flow forecast?",
    "Show me the financial overview",
    "Which KPIs are trending down?",
  ],
  "co-CHRO": [
    "Show me flight risk employees",
    "What's the headcount by department?",
    "How is employee engagement trending?",
  ],
  "co-CSO": [
    "How is the campaign performing?",
    "Which customers need attention?",
    "What's our conversion rate by channel?",
  ],
};

interface ChatMessagesProps {
  entityName?: string;
  boardId?: string;
  onSuggestionClick?: (question: string) => void;
  className?: string;
}

export function ChatMessages({
  entityName = "co-CFO",
  boardId,
  onSuggestionClick,
  className,
}: ChatMessagesProps) {
  const { messages, isEntityTyping } = useChatStore();
  // Use board-specific questions if available, otherwise fall back to entity questions
  const questions = (boardId && boardQuestions[boardId])
    ? boardQuestions[boardId]
    : (entityQuestions[entityName] || entityQuestions["co-CFO"]);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isEntityTyping]);

  return (
    <div
      data-scrollable="true"
      className={cn(
        "flex-1 overflow-y-auto px-4 py-4",
        className
      )}
    >
      {messages.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--g0-accent-amber)]/20 to-[var(--g0-accent-violet)]/20">
            <span className="text-2xl">💬</span>
          </div>
          <Text variant="h3" className="mb-2">
            Chat with {entityName}
          </Text>
          <Text variant="body" color="secondary" className="max-w-[200px]">
            Ask questions, generate reports, or explore your data.
          </Text>
        </div>
      ) : (
        <div className="space-y-6">
          {messages.map((message, index) => (
            <ChatMessage
              key={message.id}
              message={message}
              entityName={entityName}
              index={index}
            />
          ))}

          {/* Typing indicator */}
          {isEntityTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--g0-accent-violet)]">
                <span className="text-sm text-white">🤖</span>
              </div>
              <div className="rounded-2xl rounded-tl-md bg-[var(--g0-bg-elevated-2)] px-4 py-3">
                <div className="flex gap-1">
                  <motion.div
                    className="h-2 w-2 rounded-full bg-[var(--g0-accent-violet)]"
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                  />
                  <motion.div
                    className="h-2 w-2 rounded-full bg-[var(--g0-accent-violet)]"
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                  />
                  <motion.div
                    className="h-2 w-2 rounded-full bg-[var(--g0-accent-violet)]"
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Follow-up suggested questions */}
          {!isEntityTyping && onSuggestionClick && (
            <div className="flex flex-wrap gap-1 mt-3 pl-11">
              {questions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => onSuggestionClick(question)}
                  className={cn(
                    "px-2 py-0.5 rounded-full text-[9px] leading-tight",
                    "border border-[var(--g0-bg-elevated-3)] bg-[var(--g0-bg-elevated-1)]",
                    "text-[var(--g0-text-secondary)] hover:text-[var(--g0-text-primary)]",
                    "hover:border-[var(--g0-accent-primary)] hover:bg-[var(--g0-bg-elevated-2)]",
                    "transition-all duration-150"
                  )}
                >
                  {question}
                </button>
              ))}
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      )}
    </div>
  );
}

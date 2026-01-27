"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/Tooltip";
import { useChatStore } from "@/lib/stores";

interface ChatToggleButtonProps {
  className?: string;
}

export function ChatToggleButton({ className }: ChatToggleButtonProps) {
  const { isPanelOpen, togglePanel, messages } = useChatStore();

  // Don't show button when panel is open
  if (isPanelOpen) return null;

  const hasUnread = messages.length > 0;

  return (
    <TooltipProvider delayDuration={300}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn("fixed bottom-4 right-4 z-30", className)}
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="amber"
              size="icon"
              className="h-12 w-12 rounded-full shadow-lg"
              onClick={togglePanel}
            >
              <MessageCircle className="h-5 w-5" />
              {hasUnread && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--g0-accent-violet)] text-[10px] font-bold text-white">
                  {messages.length}
                </span>
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>Open chat</p>
            <kbd className="ml-2 rounded bg-[var(--g0-bg-elevated-3)] px-1.5 py-0.5 text-[10px]">
              J
            </kbd>
          </TooltipContent>
        </Tooltip>
      </motion.div>
    </TooltipProvider>
  );
}

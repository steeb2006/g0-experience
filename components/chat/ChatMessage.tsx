"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { User, Bot, GripVertical, Copy, ThumbsUp, ThumbsDown, RotateCcw, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Text } from "@/components/smart-objects/atomics";
import { ArtifactCard } from "./ArtifactCard";
import { MarkdownContent } from "./MarkdownContent";
import { formatMessageTime } from "@/lib/mock-data/chat-artifacts";
import type { ChatMessage as ChatMessageType } from "@/lib/mock-data/chat-artifacts";

interface ChatMessageProps {
  message: ChatMessageType;
  entityName?: string;
  index?: number;
  className?: string;
}

export function ChatMessage({
  message,
  entityName = "co-CFO",
  index = 0,
  className,
}: ChatMessageProps) {
  const isUser = message.role === "user";
  const [isDragging, setIsDragging] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    const dragData = {
      itemType: "text",
      title: `${isUser ? "You" : entityName} - ${formatMessageTime(message.timestamp)}`,
      content: message.content,
    };
    e.dataTransfer.setData("application/json", JSON.stringify(dragData));
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.03 }}
      className={cn("group", className)}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* User message - right aligned, minimal */}
      {isUser ? (
        <div className="flex justify-end">
          <div
            draggable
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            className={cn(
              "max-w-[85%] rounded-2xl rounded-br-md px-3.5 py-2 cursor-grab active:cursor-grabbing",
              "bg-[var(--g0-accent-primary)] text-white",
              isDragging && "opacity-50 ring-2 ring-[var(--g0-accent-cyan)]"
            )}
          >
            <p className="text-[13px] leading-relaxed whitespace-pre-wrap">
              {message.content}
            </p>
          </div>
        </div>
      ) : (
        /* Entity message - left aligned, full width feel */
        <div className="flex gap-2.5">
          {/* Avatar */}
          <div className="flex-shrink-0 mt-0.5">
            <div className="h-6 w-6 rounded-full bg-gradient-to-br from-[var(--g0-accent-primary)] to-[var(--g0-accent-indigo)] flex items-center justify-center">
              <Bot className="h-3.5 w-3.5 text-white" />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Name */}
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-medium text-[var(--g0-text-primary)]">{entityName}</span>
              <span className="text-[10px] text-[var(--g0-text-muted)]">{formatMessageTime(message.timestamp)}</span>
            </div>

            {/* Message bubble */}
            <div
              draggable
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              className={cn(
                "relative cursor-grab active:cursor-grabbing",
                isDragging && "opacity-50"
              )}
            >
              <MarkdownContent content={message.content} />

              {/* Action buttons - appear on hover */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: showActions ? 1 : 0 }}
                className="flex items-center gap-0.5 mt-2"
              >
                <button
                  onClick={handleCopy}
                  className="p-1.5 rounded-md hover:bg-[var(--g0-bg-elevated-2)] text-[var(--g0-text-muted)] hover:text-[var(--g0-text-secondary)] transition-colors"
                  title="Copy"
                >
                  <Copy className="h-3 w-3" />
                </button>
                <button
                  className="p-1.5 rounded-md hover:bg-[var(--g0-bg-elevated-2)] text-[var(--g0-text-muted)] hover:text-[var(--g0-text-secondary)] transition-colors"
                  title="Good response"
                >
                  <ThumbsUp className="h-3 w-3" />
                </button>
                <button
                  className="p-1.5 rounded-md hover:bg-[var(--g0-bg-elevated-2)] text-[var(--g0-text-muted)] hover:text-[var(--g0-text-secondary)] transition-colors"
                  title="Bad response"
                >
                  <ThumbsDown className="h-3 w-3" />
                </button>
                <button
                  className="p-1.5 rounded-md hover:bg-[var(--g0-bg-elevated-2)] text-[var(--g0-text-muted)] hover:text-[var(--g0-text-secondary)] transition-colors"
                  title="Regenerate"
                >
                  <RotateCcw className="h-3 w-3" />
                </button>
                <div className="w-px h-3 bg-[var(--g0-bg-elevated-3)] mx-1" />
                <span className="text-[9px] text-[var(--g0-text-muted)]">Drag to board</span>
              </motion.div>
            </div>

            {/* Artifacts */}
            {message.artifacts && message.artifacts.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {message.artifacts.map((artifact) => (
                  <ArtifactCard
                    key={artifact.id}
                    artifact={artifact}
                    size="sm"
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}

"use client";

import { useRef, useCallback, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Paperclip,
  ArrowUp,
  Mic,
  Image,
  Globe,
  Zap,
  X,
  FileText,
  PieChart,
  TrendingUp,
  Calculator,
  Network,
  Heart,
  AlertTriangle,
  UserPlus,
  DollarSign,
  Users,
  Megaphone,
  Target,
  HeartPulse,
  AlertCircle,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useChatStore } from "@/lib/stores";
import { ToolCard } from "./ToolCard";
import { getToolsForEntity, type EntityTool } from "@/lib/mock-data/entity-tools";

// Icon map for selected tool display
const iconMap: Record<string, LucideIcon> = {
  FileText,
  PieChart,
  TrendingUp,
  Calculator,
  Network,
  Heart,
  AlertTriangle,
  UserPlus,
  DollarSign,
  Users,
  Megaphone,
  Target,
  HeartPulse,
  AlertCircle,
  Sparkles,
};

interface ChatInputProps {
  onSend?: (message: string) => void;
  onToolSelect?: (tool: EntityTool) => void;
  entityName?: string;
  className?: string;
}

export function ChatInput({
  onSend,
  onToolSelect,
  entityName = "co-CFO",
  className,
}: ChatInputProps) {
  const { inputValue, setInputValue } = useChatStore();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const toolsButtonRef = useRef<HTMLButtonElement>(null);
  const [showToolsPopover, setShowToolsPopover] = useState(false);
  const [selectedTool, setSelectedTool] = useState<EntityTool | null>(null);
  const [popoverPosition, setPopoverPosition] = useState({ bottom: 0, left: 0 });
  const [mounted, setMounted] = useState(false);

  const tools = getToolsForEntity(entityName);

  // Track if component is mounted (for portal)
  useEffect(() => {
    setMounted(true);
  }, []);

  // Clear selected tool when entity changes
  useEffect(() => {
    setSelectedTool(null);
  }, [entityName]);

  // Update popover position when opening
  useEffect(() => {
    if (showToolsPopover && toolsButtonRef.current) {
      const rect = toolsButtonRef.current.getBoundingClientRect();
      // Position above the button with some gap
      setPopoverPosition({
        bottom: window.innerHeight - rect.top + 4,
        left: rect.left,
      });
    }
  }, [showToolsPopover]);

  // Close popover when clicking outside (but not on the button)
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      const isOutsidePopover = popoverRef.current && !popoverRef.current.contains(target);
      const isOutsideButton = toolsButtonRef.current && !toolsButtonRef.current.contains(target);

      if (isOutsidePopover && isOutsideButton) {
        setShowToolsPopover(false);
      }
    };

    if (showToolsPopover) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showToolsPopover]);

  const handleSubmit = useCallback(() => {
    if (!inputValue.trim()) return;
    onSend?.(inputValue.trim());
    setInputValue("");
    // Clear selected tool after sending
    setSelectedTool(null);

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [inputValue, onSend, setInputValue]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
    // Close popover on Escape
    if (e.key === "Escape" && showToolsPopover) {
      setShowToolsPopover(false);
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);

    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  };

  const handleToolClick = (tool: EntityTool) => {
    setShowToolsPopover(false);
    // Toggle: if same tool clicked, deselect it
    if (selectedTool?.id === tool.id) {
      setSelectedTool(null);
    } else {
      setSelectedTool(tool);
      onToolSelect?.(tool);
    }
    // Focus the textarea
    textareaRef.current?.focus();
  };

  const clearSelectedTool = () => {
    setSelectedTool(null);
  };

  // Get icon for selected tool
  const SelectedIcon = selectedTool ? (iconMap[selectedTool.icon] || Zap) : null;

  return (
    <div className={cn("px-3 py-3", className)}>
      <div className="rounded-2xl border border-[var(--g0-bg-elevated-3)] bg-[var(--g0-bg-elevated-1)] overflow-hidden">
        {/* Input field */}
        <textarea
          ref={textareaRef}
          value={inputValue}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder={selectedTool ? `Ask about ${selectedTool.displayName}...` : `Message ${entityName}...`}
          rows={1}
          className={cn(
            "w-full resize-none bg-transparent px-4 py-3 text-[13px]",
            "text-[var(--g0-text-primary)] placeholder:text-[var(--g0-text-muted)]",
            "focus:outline-none"
          )}
        />

        {/* Bottom action bar */}
        <div className="flex items-center justify-between px-2 py-1.5 border-t border-[var(--g0-bg-elevated-2)]">
          <div className="flex items-center gap-0.5">
            <button
              className="p-1.5 rounded-lg hover:bg-[var(--g0-bg-elevated-2)] text-[var(--g0-text-muted)] hover:text-[var(--g0-text-secondary)] transition-colors"
              title="Attach file"
            >
              <Paperclip className="h-4 w-4" />
            </button>
            <button
              className="p-1.5 rounded-lg hover:bg-[var(--g0-bg-elevated-2)] text-[var(--g0-text-muted)] hover:text-[var(--g0-text-secondary)] transition-colors"
              title="Add image"
            >
              <Image className="h-4 w-4" />
            </button>
            <button
              className="p-1.5 rounded-lg hover:bg-[var(--g0-bg-elevated-2)] text-[var(--g0-text-muted)] hover:text-[var(--g0-text-secondary)] transition-colors"
              title="Search web"
            >
              <Globe className="h-4 w-4" />
            </button>
            <div className="w-px h-4 bg-[var(--g0-bg-elevated-3)] mx-1" />

            {/* Tools button with popover */}
            <div className="relative">
              <button
                ref={toolsButtonRef}
                onClick={() => setShowToolsPopover(!showToolsPopover)}
                className={cn(
                  "flex items-center gap-1.5 px-2 py-1 rounded-lg transition-colors",
                  showToolsPopover || selectedTool
                    ? "bg-[var(--g0-accent-primary)]/20 text-[var(--g0-accent-primary)]"
                    : "hover:bg-[var(--g0-bg-elevated-2)] text-[var(--g0-text-muted)] hover:text-[var(--g0-text-secondary)]"
                )}
                title="Quick actions"
              >
                {selectedTool && SelectedIcon ? (
                  <>
                    <SelectedIcon className="h-3.5 w-3.5" />
                    <span className="text-[10px] max-w-[80px] truncate">{selectedTool.displayName}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        clearSelectedTool();
                      }}
                      className="p-0.5 rounded hover:bg-[var(--g0-accent-primary)]/30 -mr-1"
                    >
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </>
                ) : (
                  <>
                    <Zap className="h-3.5 w-3.5" />
                    <span className="text-[10px]">Tools</span>
                  </>
                )}
              </button>

              {/* Tools Popover - rendered via portal */}
              {mounted && createPortal(
                <AnimatePresence>
                  {showToolsPopover && (
                    <motion.div
                      ref={popoverRef}
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      style={{
                        position: "fixed",
                        bottom: popoverPosition.bottom,
                        left: popoverPosition.left,
                      }}
                      className={cn(
                        "w-56 z-[100]",
                        "rounded-lg border border-[var(--g0-bg-elevated-3)] bg-[var(--g0-bg-elevated-1)]",
                        "shadow-lg shadow-black/20"
                      )}
                    >
                      {/* Popover Header */}
                      <div className="flex items-center justify-between px-3 py-2 border-b border-[var(--g0-bg-elevated-3)]">
                        <span className="text-[11px] font-medium text-[var(--g0-text-secondary)]">
                          Select Tool
                        </span>
                        <button
                          onClick={() => setShowToolsPopover(false)}
                          className="p-0.5 rounded hover:bg-[var(--g0-bg-elevated-2)] text-[var(--g0-text-muted)]"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>

                      {/* Tools List */}
                      <div className="p-1.5 max-h-64 overflow-y-auto">
                        {tools.length > 0 ? (
                          tools.map((tool) => (
                            <ToolCard
                              key={tool.id}
                              tool={tool}
                              onClick={() => handleToolClick(tool)}
                              compact
                              isSelected={selectedTool?.id === tool.id}
                            />
                          ))
                        ) : (
                          <div className="px-2 py-3 text-center text-[11px] text-[var(--g0-text-muted)]">
                            No tools available
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>,
                document.body
              )}
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              className="p-1.5 rounded-lg hover:bg-[var(--g0-bg-elevated-2)] text-[var(--g0-text-muted)] hover:text-[var(--g0-text-secondary)] transition-colors"
              title="Voice input"
            >
              <Mic className="h-4 w-4" />
            </button>
            <button
              onClick={handleSubmit}
              disabled={!inputValue.trim()}
              className={cn(
                "p-1.5 rounded-lg transition-colors",
                inputValue.trim()
                  ? "bg-[var(--g0-accent-primary)] text-white hover:bg-[var(--g0-accent-dark)]"
                  : "bg-[var(--g0-bg-elevated-2)] text-[var(--g0-text-muted)]"
              )}
              title="Send message"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

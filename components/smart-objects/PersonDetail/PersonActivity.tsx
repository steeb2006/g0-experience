"use client";

import { motion } from "framer-motion";
import { Calendar, MessageSquare, BookOpen, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PersonDetailData } from "@/lib/mock-data/person-detail";

interface PersonActivityProps {
  person: PersonDetailData;
}

const activityIcons = {
  meeting: MessageSquare,
  review: Calendar,
  training: BookOpen,
  project: Briefcase,
};

const activityColors = {
  meeting: "text-blue-400 bg-blue-500/10",
  review: "text-amber-400 bg-amber-500/10",
  training: "text-violet-400 bg-violet-500/10",
  project: "text-emerald-400 bg-emerald-500/10",
};

export function PersonActivity({ person }: PersonActivityProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="px-4 pb-4">
      <h3 className="text-[11px] font-medium text-[var(--g0-text-muted)] uppercase tracking-wide mb-3">
        Recent Activity
      </h3>
      <div className="space-y-2">
        {person.recentActivity.slice(0, 4).map((activity, index) => {
          const Icon = activityIcons[activity.type];
          const colorClass = activityColors[activity.type];

          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: 0.5 + index * 0.05 }}
              className={cn(
                "flex items-start gap-3 p-2.5 rounded-lg",
                "bg-[var(--g0-bg-elevated-2)] border border-[var(--g0-bg-elevated-3)]"
              )}
            >
              <div
                className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0",
                  colorClass
                )}
              >
                <Icon className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-[var(--g0-text-primary)] line-clamp-2">
                  {activity.description}
                </p>
                <span className="text-[10px] text-[var(--g0-text-muted)] mt-0.5 block">
                  {formatDate(activity.date)}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Notes section */}
      {person.notes && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.7 }}
          className="mt-4"
        >
          <h3 className="text-[11px] font-medium text-[var(--g0-text-muted)] uppercase tracking-wide mb-2">
            HR Notes
          </h3>
          <p className="text-xs text-[var(--g0-text-secondary)] italic p-2.5 rounded-lg bg-[var(--g0-bg-elevated-2)] border border-[var(--g0-bg-elevated-3)]">
            "{person.notes}"
          </p>
        </motion.div>
      )}
    </div>
  );
}

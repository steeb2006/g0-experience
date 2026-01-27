"use client";

import { motion } from "framer-motion";
import { User, Mail, Phone, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PersonDetailData } from "@/lib/mock-data/person-detail";

interface PersonHeaderProps {
  person: PersonDetailData;
}

export function PersonHeader({ person }: PersonHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="flex items-start gap-4 p-4 border-b border-[var(--g0-bg-elevated-3)]"
    >
      {/* Avatar */}
      <div
        className={cn(
          "w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0",
          "bg-gradient-to-br from-[var(--g0-bg-elevated-2)] to-[var(--g0-bg-elevated)]",
          "border-2 border-emerald-500"
        )}
      >
        {person.avatar ? (
          <img
            src={person.avatar}
            alt={person.name}
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <User className="w-8 h-8 text-emerald-400" />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h2 className="text-lg font-semibold text-[var(--g0-text-primary)] truncate">
          {person.name}
        </h2>
        <p className="text-sm text-[var(--g0-text-secondary)]">
          {person.title} · {person.department}
        </p>

        {/* Contact info */}
        <div className="mt-2 flex flex-wrap gap-3">
          <a
            href={`mailto:${person.email}`}
            className={cn(
              "flex items-center gap-1.5 text-xs text-[var(--g0-text-muted)]",
              "hover:text-[var(--g0-accent-primary)] transition-colors"
            )}
          >
            <Mail className="w-3 h-3" />
            <span className="truncate">{person.email}</span>
          </a>
          {person.phone && (
            <a
              href={`tel:${person.phone}`}
              className={cn(
                "flex items-center gap-1.5 text-xs text-[var(--g0-text-muted)]",
                "hover:text-[var(--g0-accent-primary)] transition-colors"
              )}
            >
              <Phone className="w-3 h-3" />
              <span>{person.phone}</span>
            </a>
          )}
          {person.location && (
            <span className="flex items-center gap-1.5 text-xs text-[var(--g0-text-muted)]">
              <MapPin className="w-3 h-3" />
              <span>{person.location}</span>
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

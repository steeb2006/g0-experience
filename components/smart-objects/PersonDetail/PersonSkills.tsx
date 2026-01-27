"use client";

import { motion } from "framer-motion";
import { Award } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PersonDetailData } from "@/lib/mock-data/person-detail";

interface PersonSkillsProps {
  person: PersonDetailData;
}

export function PersonSkills({ person }: PersonSkillsProps) {
  return (
    <div className="px-4 pb-4">
      {/* Skills */}
      <div className="mb-4">
        <h3 className="text-[11px] font-medium text-[var(--g0-text-muted)] uppercase tracking-wide mb-2">
          Skills
        </h3>
        <div className="flex flex-wrap gap-2">
          {person.skills.map((skill, index) => (
            <motion.span
              key={skill}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: 0.3 + index * 0.03 }}
              className={cn(
                "px-2.5 py-1 rounded-full text-xs font-medium",
                "bg-[var(--g0-bg-elevated-2)] text-[var(--g0-text-secondary)]",
                "border border-[var(--g0-bg-elevated-3)]"
              )}
            >
              {skill}
            </motion.span>
          ))}
        </div>
      </div>

      {/* Certifications */}
      {person.certifications && person.certifications.length > 0 && (
        <div>
          <h3 className="text-[11px] font-medium text-[var(--g0-text-muted)] uppercase tracking-wide mb-2 flex items-center gap-1.5">
            <Award className="w-3 h-3" />
            Certifications
          </h3>
          <div className="flex flex-wrap gap-2">
            {person.certifications.map((cert, index) => (
              <motion.span
                key={cert}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.2,
                  delay: 0.4 + index * 0.03,
                }}
                className={cn(
                  "px-2.5 py-1 rounded-full text-xs font-medium",
                  "bg-emerald-500/10 text-emerald-400",
                  "border border-emerald-500/20"
                )}
              >
                {cert}
              </motion.span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

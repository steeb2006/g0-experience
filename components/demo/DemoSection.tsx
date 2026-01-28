"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";
import type { DemoSection as DemoSectionType } from "@/lib/demo-content";

interface DemoSectionProps {
  section: DemoSectionType;
}

export function DemoSection({ section }: DemoSectionProps) {
  return (
    <section
      id={section.id}
      className="scroll-mt-24 rounded-xl border border-[var(--g0-bg-elevated-3)] bg-[var(--g0-bg-elevated-1)] p-6"
    >
      {/* Section Title */}
      <h2 className="text-xl font-semibold text-[var(--g0-text-primary)] mb-3">
        {section.title}
      </h2>

      {/* Description */}
      <p className="text-[var(--g0-text-secondary)] mb-4 leading-relaxed">
        {section.description}
      </p>

      {/* Features List */}
      {section.features && section.features.length > 0 && (
        <div className="mb-4">
          <h3 className="text-sm font-medium text-[var(--g0-text-muted)] uppercase tracking-wider mb-2">
            Features
          </h3>
          <ul className="space-y-1.5">
            {section.features.map((feature, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-[var(--g0-text-secondary)]"
              >
                <span className="text-[var(--g0-accent-violet)] mt-1">•</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Commands */}
      {section.commands && section.commands.length > 0 && (
        <div className="mb-4">
          <h3 className="text-sm font-medium text-[var(--g0-text-muted)] uppercase tracking-wider mb-2">
            Try These Commands
          </h3>
          <div className="space-y-2">
            {section.commands.map((command, index) => (
              <code
                key={index}
                className="block rounded bg-[var(--g0-bg-elevated-2)] px-3 py-2 text-sm text-[var(--g0-text-secondary)] font-mono"
              >
                {command}
              </code>
            ))}
          </div>
        </div>
      )}

      {/* Shortcuts */}
      {section.shortcuts && section.shortcuts.length > 0 && (
        <div className="mb-4">
          <h3 className="text-sm font-medium text-[var(--g0-text-muted)] uppercase tracking-wider mb-2">
            Keyboard Shortcuts
          </h3>
          <div className="rounded bg-[var(--g0-bg-elevated-2)] overflow-hidden">
            <table className="w-full text-sm">
              <tbody>
                {section.shortcuts.map((shortcut, index) => (
                  <tr
                    key={index}
                    className="border-b border-[var(--g0-bg-elevated-3)] last:border-0"
                  >
                    <td className="px-3 py-2 font-mono text-[var(--g0-accent-cyan)]">
                      {shortcut.key}
                    </td>
                    <td className="px-3 py-2 text-[var(--g0-text-secondary)]">
                      {shortcut.action}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Try It Link */}
      {section.tryItLink && (
        <Link
          href={section.tryItLink}
          className="inline-flex items-center gap-2 rounded-lg bg-[var(--g0-accent-violet)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--g0-accent-violet)]/80"
        >
          {section.tryItLabel || "Try It"}
          <ExternalLink className="h-4 w-4" />
        </Link>
      )}
    </section>
  );
}

"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import type { DemoSection } from "@/lib/demo-content";

interface DemoTOCProps {
  sections: DemoSection[];
}

export function DemoTOC({ sections }: DemoTOCProps) {
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-20% 0px -70% 0px",
      }
    );

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [sections]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="rounded-xl border border-[var(--g0-bg-elevated-3)] bg-[var(--g0-bg-elevated-1)] p-4">
      <h3 className="text-xs font-medium text-[var(--g0-text-muted)] uppercase tracking-wider mb-3">
        Contents
      </h3>
      <ol className="space-y-1">
        {sections.map((section, index) => (
          <li key={section.id}>
            <button
              onClick={() => scrollToSection(section.id)}
              className={cn(
                "w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors",
                activeSection === section.id
                  ? "bg-[var(--g0-accent-violet)]/20 text-[var(--g0-accent-violet)]"
                  : "text-[var(--g0-text-secondary)] hover:bg-[var(--g0-bg-elevated-2)] hover:text-[var(--g0-text-primary)]"
              )}
            >
              <span className="text-[var(--g0-text-muted)] mr-2">
                {index + 1}.
              </span>
              {section.title}
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}

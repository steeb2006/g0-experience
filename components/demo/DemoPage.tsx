"use client";

import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { demoSections, demoIntro } from "@/lib/demo-content";
import { DemoSection } from "./DemoSection";
import { DemoTOC } from "./DemoTOC";
import { Button } from "@/components/ui";

export function DemoPage() {
  const router = useRouter();

  const handleClose = () => {
    // Go back if there's history, otherwise go to portal
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen bg-[var(--g0-bg-base)]">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-[var(--g0-bg-elevated-3)] bg-[var(--g0-bg-base)]/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--g0-accent-violet)]">
              <span className="text-sm font-bold text-white">G0</span>
            </div>
            <span className="text-lg font-semibold text-[var(--g0-text-primary)]">
              Demo Guide
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar TOC - Sticky on desktop */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <DemoTOC sections={demoSections} />
            </div>
          </aside>

          {/* Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Intro */}
            <div className="rounded-xl border border-[var(--g0-accent-violet)]/30 bg-gradient-to-br from-[var(--g0-accent-violet)]/10 to-transparent p-6">
              <h1 className="text-3xl font-bold text-[var(--g0-text-primary)] mb-2">
                {demoIntro.title}
              </h1>
              <p className="text-lg text-[var(--g0-accent-violet)] mb-4">
                {demoIntro.subtitle}
              </p>
              <p className="text-[var(--g0-text-secondary)] leading-relaxed">
                {demoIntro.description}
              </p>
            </div>

            {/* Mobile TOC */}
            <div className="lg:hidden">
              <DemoTOC sections={demoSections} />
            </div>

            {/* Sections */}
            {demoSections.map((section) => (
              <DemoSection key={section.id} section={section} />
            ))}

            {/* Footer */}
            <div className="rounded-xl border border-[var(--g0-bg-elevated-3)] bg-[var(--g0-bg-elevated-1)] p-6 text-center">
              <p className="text-[var(--g0-text-muted)] mb-4">
                Press <kbd className="rounded bg-[var(--g0-bg-elevated-2)] px-2 py-0.5 font-mono text-sm">Ctrl+Shift+D</kbd> anytime to return to this guide.
              </p>
              <Button onClick={() => router.push("/")} variant="violet">
                Start Exploring
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

"use client";

import { getGreeting, formatCurrentDate, getContextualReminder } from "@/lib/mock-data/portal";

interface TimeGreetingProps {
  userName?: string;
}

export function TimeGreeting({ userName = "Stefan" }: TimeGreetingProps) {
  const greeting = getGreeting();
  const currentDate = formatCurrentDate();
  const contextualReminder = getContextualReminder();

  return (
    <div className="space-y-1">
      <h1 className="text-2xl font-semibold text-[var(--g0-text-primary)]">
        {greeting}, {userName}
      </h1>
      <p className="text-sm text-[var(--g0-text-tertiary)]">
        {currentDate} {contextualReminder && (
          <span className="text-[var(--g0-accent-amber)]">
            {" "}• "{contextualReminder}"
          </span>
        )}
      </p>
    </div>
  );
}

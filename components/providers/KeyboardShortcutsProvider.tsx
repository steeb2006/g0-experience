"use client";

import { useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface KeyboardShortcutsProviderProps {
  children: ReactNode;
}

export function KeyboardShortcutsProvider({
  children,
}: KeyboardShortcutsProviderProps) {
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Shift+D - Open demo page
      if (e.ctrlKey && e.shiftKey && e.key === "D") {
        e.preventDefault();
        router.push("/~demo");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  return <>{children}</>;
}

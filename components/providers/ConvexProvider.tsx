"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode, useMemo } from "react";

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  const convex = useMemo(() => {
    const url = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!url) {
      // During build or when env var is missing, return null
      // This allows the app to build without Convex configured
      return null;
    }
    return new ConvexReactClient(url);
  }, []);

  // If Convex is not configured, render children without provider
  // This allows the app to work with mock data as fallback
  if (!convex) {
    return <>{children}</>;
  }

  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}

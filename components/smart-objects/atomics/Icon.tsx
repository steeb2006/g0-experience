"use client";

import { CSSProperties, useMemo } from "react";
import { cn } from "@/lib/utils";
import * as LucideIcons from "lucide-react";

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  strokeWidth?: number;
  className?: string;
  style?: CSSProperties;
}

// Type for Lucide icon components
type LucideIcon = React.ForwardRefExoticComponent<
  Omit<LucideIcons.LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
>;

// Cache of icon components
const iconCache = new Map<string, LucideIcon | null>();

/**
 * Get a Lucide icon component by name
 * Supports various naming conventions:
 * - "AlertCircle" (PascalCase)
 * - "alert-circle" (kebab-case)
 * - "alertCircle" (camelCase)
 */
function getIconComponent(name: string): LucideIcon | null {
  if (iconCache.has(name)) {
    return iconCache.get(name) ?? null;
  }

  // Try direct match first (PascalCase)
  if (name in LucideIcons) {
    const icon = (LucideIcons as Record<string, unknown>)[name] as LucideIcon;
    iconCache.set(name, icon);
    return icon;
  }

  // Convert kebab-case to PascalCase
  const pascalCase = name
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");

  if (pascalCase in LucideIcons) {
    const icon = (LucideIcons as Record<string, unknown>)[pascalCase] as LucideIcon;
    iconCache.set(name, icon);
    return icon;
  }

  // Convert camelCase to PascalCase
  const fromCamel = name.charAt(0).toUpperCase() + name.slice(1);
  if (fromCamel in LucideIcons) {
    const icon = (LucideIcons as Record<string, unknown>)[fromCamel] as LucideIcon;
    iconCache.set(name, icon);
    return icon;
  }

  iconCache.set(name, null);
  return null;
}

export function Icon({
  name,
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  className,
  style,
}: IconProps) {
  const IconComponent = useMemo(() => getIconComponent(name), [name]);

  if (!IconComponent) {
    // Fallback for unknown icons
    return (
      <div
        className={cn(
          "inline-flex items-center justify-center text-[var(--g0-text-muted)]",
          className
        )}
        style={{
          width: size,
          height: size,
          fontSize: size * 0.5,
          ...style,
        }}
        title={`Unknown icon: ${name}`}
      >
        ?
      </div>
    );
  }

  return (
    <IconComponent
      size={size}
      color={color}
      strokeWidth={strokeWidth}
      className={className}
      style={style}
    />
  );
}

// Common icon presets
export const IconPresets = {
  success: { name: "CheckCircle", color: "var(--g0-status-success)" },
  warning: { name: "AlertTriangle", color: "var(--g0-status-warning)" },
  error: { name: "XCircle", color: "var(--g0-status-error)" },
  info: { name: "Info", color: "var(--g0-accent-violet)" },
  user: { name: "User", color: "var(--g0-text-muted)" },
  settings: { name: "Settings", color: "var(--g0-text-muted)" },
  search: { name: "Search", color: "var(--g0-text-muted)" },
  plus: { name: "Plus", color: "var(--g0-text-muted)" },
  minus: { name: "Minus", color: "var(--g0-text-muted)" },
  close: { name: "X", color: "var(--g0-text-muted)" },
  menu: { name: "Menu", color: "var(--g0-text-muted)" },
  chevronRight: { name: "ChevronRight", color: "var(--g0-text-muted)" },
  chevronDown: { name: "ChevronDown", color: "var(--g0-text-muted)" },
  arrowUp: { name: "ArrowUp", color: "var(--g0-status-success)" },
  arrowDown: { name: "ArrowDown", color: "var(--g0-status-error)" },
} as const;

/**
 * Data Binding System for Smart Objects
 *
 * Resolves JSONPath bindings from schema definitions to actual data values.
 * Supports nested paths like "$.client.name" or "$.metrics.revenue".
 */

import type { BindingResult } from "./types";

/**
 * Resolve a JSONPath binding to a value from data
 *
 * @param path - JSONPath string, e.g., "$.client.name"
 * @param data - Data object to resolve from
 * @returns BindingResult with the resolved value
 *
 * @example
 * resolveBinding("$.client.name", { client: { name: "John" } })
 * // Returns: { value: "John", path: "$.client.name", found: true }
 */
export function resolveBinding<T = unknown>(
  path: string,
  data: Record<string, unknown>
): BindingResult<T> {
  // Handle empty or invalid paths
  if (!path || typeof path !== "string") {
    return { value: undefined, path, found: false };
  }

  // Normalize path: remove leading $. if present
  const normalizedPath = path.startsWith("$.") ? path.slice(2) : path;

  // Handle root reference
  if (normalizedPath === "" || normalizedPath === "$") {
    return { value: data as T, path, found: true };
  }

  // Split path into segments
  const segments = normalizedPath.split(".");

  // Traverse the data object
  let current: unknown = data;
  for (const segment of segments) {
    if (current === null || current === undefined) {
      return { value: undefined, path, found: false };
    }

    if (typeof current !== "object") {
      return { value: undefined, path, found: false };
    }

    // Handle array indexing: segment[0]
    const arrayMatch = segment.match(/^(\w+)\[(\d+)\]$/);
    if (arrayMatch) {
      const [, key, indexStr] = arrayMatch;
      const array = (current as Record<string, unknown>)[key];
      if (!Array.isArray(array)) {
        return { value: undefined, path, found: false };
      }
      const index = parseInt(indexStr, 10);
      current = array[index];
    } else {
      current = (current as Record<string, unknown>)[segment];
    }
  }

  return {
    value: current as T,
    path,
    found: current !== undefined,
  };
}

/**
 * Resolve multiple bindings at once
 */
export function resolveBindings(
  paths: string[],
  data: Record<string, unknown>
): Map<string, BindingResult> {
  const results = new Map<string, BindingResult>();
  for (const path of paths) {
    results.set(path, resolveBinding(path, data));
  }
  return results;
}

/**
 * Check if a binding path exists in data
 */
export function bindingExists(
  path: string,
  data: Record<string, unknown>
): boolean {
  return resolveBinding(path, data).found;
}

/**
 * Get all missing binding paths from a list
 */
export function getMissingBindings(
  paths: string[],
  data: Record<string, unknown>
): string[] {
  return paths.filter((path) => !bindingExists(path, data));
}

/**
 * Format a bound value for display
 *
 * Handles different types: numbers, dates, booleans, etc.
 */
export function formatBoundValue(
  value: unknown,
  format?: {
    type?: "number" | "currency" | "percent" | "date" | "string";
    locale?: string;
    currency?: string;
    decimals?: number;
  }
): string {
  if (value === null || value === undefined) {
    return "";
  }

  const locale = format?.locale || "en-US";

  switch (format?.type) {
    case "number":
      if (typeof value === "number") {
        return new Intl.NumberFormat(locale, {
          minimumFractionDigits: format.decimals ?? 0,
          maximumFractionDigits: format.decimals ?? 2,
        }).format(value);
      }
      break;

    case "currency":
      if (typeof value === "number") {
        return new Intl.NumberFormat(locale, {
          style: "currency",
          currency: format.currency || "USD",
          minimumFractionDigits: format.decimals ?? 0,
          maximumFractionDigits: format.decimals ?? 2,
        }).format(value);
      }
      break;

    case "percent":
      if (typeof value === "number") {
        return new Intl.NumberFormat(locale, {
          style: "percent",
          minimumFractionDigits: format.decimals ?? 0,
          maximumFractionDigits: format.decimals ?? 1,
        }).format(value);
      }
      break;

    case "date":
      if (value instanceof Date) {
        return new Intl.DateTimeFormat(locale).format(value);
      }
      if (typeof value === "string" || typeof value === "number") {
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
          return new Intl.DateTimeFormat(locale).format(date);
        }
      }
      break;
  }

  // Default: convert to string
  if (typeof value === "object") {
    return JSON.stringify(value);
  }
  return String(value);
}

/**
 * Set a value at a binding path (for editing scenarios)
 *
 * Creates intermediate objects as needed.
 */
export function setBinding(
  path: string,
  value: unknown,
  data: Record<string, unknown>
): Record<string, unknown> {
  // Clone the data to avoid mutation
  const result = JSON.parse(JSON.stringify(data));

  // Normalize path
  const normalizedPath = path.startsWith("$.") ? path.slice(2) : path;
  const segments = normalizedPath.split(".");

  // Navigate to parent and set value
  let current = result;
  for (let i = 0; i < segments.length - 1; i++) {
    const segment = segments[i];
    if (!(segment in current)) {
      current[segment] = {};
    }
    current = current[segment] as Record<string, unknown>;
  }

  // Set the final value
  const lastSegment = segments[segments.length - 1];
  current[lastSegment] = value;

  return result;
}

/**
 * Extract all leaf paths from a data object
 *
 * Useful for discovering available bindings.
 */
export function extractPaths(
  data: unknown,
  prefix: string = "$"
): string[] {
  const paths: string[] = [];

  function traverse(obj: unknown, currentPath: string) {
    if (obj === null || obj === undefined) {
      paths.push(currentPath);
      return;
    }

    if (Array.isArray(obj)) {
      paths.push(currentPath);
      // Also traverse first element as example
      if (obj.length > 0) {
        traverse(obj[0], `${currentPath}[0]`);
      }
      return;
    }

    if (typeof obj === "object") {
      for (const [key, value] of Object.entries(obj)) {
        traverse(value, `${currentPath}.${key}`);
      }
      return;
    }

    // Primitive value
    paths.push(currentPath);
  }

  traverse(data, prefix);
  return paths;
}

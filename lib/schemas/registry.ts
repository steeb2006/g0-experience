/**
 * Schema Registry for Smart Objects
 *
 * Loads, caches, and resolves Smart Object schemas.
 * Supports version resolution (e.g., @1.0 → @1.0.2).
 */

import type {
  SmartObjectSchema,
  ParsedSchemaUri,
  SchemaRegistryEntry,
} from "./types";
import { validateSmartObjectSchema } from "./validators";

// In-memory schema cache
const schemaCache = new Map<string, SchemaRegistryEntry>();

// Available schema definitions (will be populated from JSON files)
const schemaDefinitions = new Map<string, SmartObjectSchema>();

/**
 * Parse a schema URI into its components
 *
 * @example
 * parseSchemaUri("g0://smart-objects/client-card@1.0")
 * // Returns: { protocol: "g0", namespace: "smart-objects", name: "client-card", version: "1.0" }
 */
export function parseSchemaUri(uri: string): ParsedSchemaUri | null {
  const regex = /^g0:\/\/smart-objects\/([a-z0-9-]+)(?:@(.+))?$/;
  const match = uri.match(regex);

  if (!match) {
    return null;
  }

  return {
    protocol: "g0",
    namespace: "smart-objects",
    name: match[1],
    version: match[2],
  };
}

/**
 * Build a schema URI from components
 */
export function buildSchemaUri(
  name: string,
  version?: string
): string {
  const base = `g0://smart-objects/${name}`;
  return version ? `${base}@${version}` : base;
}

/**
 * Register a schema definition
 */
export function registerSchema(schema: SmartObjectSchema): {
  success: boolean;
  errors?: string[];
} {
  // Validate the schema
  const validation = validateSmartObjectSchema(schema);
  if (!validation.valid) {
    return { success: false, errors: validation.errors };
  }

  // Build the cache key
  const parsed = parseSchemaUri(schema.schema);
  if (!parsed) {
    return { success: false, errors: ["Invalid schema URI"] };
  }

  const cacheKey = buildSchemaUri(parsed.name, schema.version);

  // Store in definitions
  schemaDefinitions.set(cacheKey, schema);

  // Also cache it
  schemaCache.set(cacheKey, {
    schema,
    loadedAt: Date.now(),
    source: "inline",
  });

  return { success: true };
}

/**
 * Get a schema by URI
 *
 * Supports version resolution:
 * - Exact: "g0://smart-objects/client-card@1.0.0"
 * - Major.Minor: "g0://smart-objects/client-card@1.0" → latest 1.0.x
 * - Major: "g0://smart-objects/client-card@1" → latest 1.x.x
 * - Latest: "g0://smart-objects/client-card" → latest version
 */
export function getSchema(uri: string): SmartObjectSchema | null {
  // Check cache first
  const cached = schemaCache.get(uri);
  if (cached) {
    return cached.schema;
  }

  // Parse the URI
  const parsed = parseSchemaUri(uri);
  if (!parsed) {
    return null;
  }

  // If exact version requested, try to find it
  if (parsed.version) {
    const exactKey = buildSchemaUri(parsed.name, parsed.version);
    const exact = schemaDefinitions.get(exactKey);
    if (exact) {
      return exact;
    }

    // Try version resolution
    const resolved = resolveVersion(parsed.name, parsed.version);
    if (resolved) {
      return resolved;
    }
  }

  // Return latest version
  return getLatestVersion(parsed.name);
}

/**
 * Resolve a version prefix to the latest matching version
 */
function resolveVersion(
  name: string,
  versionPrefix: string
): SmartObjectSchema | null {
  const matchingVersions: Array<{ version: string; schema: SmartObjectSchema }> = [];

  const entries = Array.from(schemaDefinitions.entries());
  for (const [key, schema] of entries) {
    const parsed = parseSchemaUri(key);
    if (parsed?.name !== name) continue;

    const version = schema.version;
    if (version.startsWith(versionPrefix)) {
      matchingVersions.push({ version, schema });
    }
  }

  if (matchingVersions.length === 0) {
    return null;
  }

  // Sort by version (descending) and return latest
  matchingVersions.sort((a, b) => compareVersions(b.version, a.version));
  return matchingVersions[0].schema;
}

/**
 * Get the latest version of a schema
 */
function getLatestVersion(name: string): SmartObjectSchema | null {
  const versions: Array<{ version: string; schema: SmartObjectSchema }> = [];

  const entries = Array.from(schemaDefinitions.entries());
  for (const [key, schema] of entries) {
    const parsed = parseSchemaUri(key);
    if (parsed?.name === name) {
      versions.push({ version: schema.version, schema });
    }
  }

  if (versions.length === 0) {
    return null;
  }

  versions.sort((a, b) => compareVersions(b.version, a.version));
  return versions[0].schema;
}

/**
 * Compare two semver versions
 * Returns negative if a < b, positive if a > b, 0 if equal
 */
function compareVersions(a: string, b: string): number {
  const partsA = a.split(".").map(Number);
  const partsB = b.split(".").map(Number);

  for (let i = 0; i < Math.max(partsA.length, partsB.length); i++) {
    const partA = partsA[i] || 0;
    const partB = partsB[i] || 0;
    if (partA !== partB) {
      return partA - partB;
    }
  }

  return 0;
}

/**
 * List all registered schemas
 */
export function listSchemas(): Array<{
  uri: string;
  name: string;
  version: string;
  description?: string;
}> {
  const schemas: Array<{
    uri: string;
    name: string;
    version: string;
    description?: string;
  }> = [];

  const values = Array.from(schemaDefinitions.values());
  for (const schema of values) {
    const parsed = parseSchemaUri(schema.schema);
    if (parsed) {
      schemas.push({
        uri: buildSchemaUri(parsed.name, schema.version),
        name: schema.name || parsed.name,
        version: schema.version,
        description: schema.description,
      });
    }
  }

  return schemas;
}

/**
 * Check if a schema exists
 */
export function schemaExists(uri: string): boolean {
  return getSchema(uri) !== null;
}

/**
 * Clear the schema cache
 */
export function clearCache(): void {
  schemaCache.clear();
}

/**
 * Clear all registered schemas (useful for testing)
 */
export function clearRegistry(): void {
  schemaDefinitions.clear();
  schemaCache.clear();
}

// Import schema definitions statically
import clientCardSchema from "./definitions/client-card.json";
import oceanRadarSchema from "./definitions/ocean-radar.json";

/**
 * Load schemas from JSON definitions
 * This will be called during app initialization
 */
export function loadSchemaDefinitions(): void {
  // Register all schema definitions
  registerSchema(clientCardSchema as unknown as SmartObjectSchema);
  registerSchema(oceanRadarSchema as unknown as SmartObjectSchema);
}

/**
 * React hook for accessing schemas
 * (To be used in components)
 */
export function useSchema(uri: string): {
  schema: SmartObjectSchema | null;
  loading: boolean;
  error: string | null;
} {
  // For now, synchronous lookup
  // Could be enhanced with async loading
  const schema = getSchema(uri);
  return {
    schema,
    loading: false,
    error: schema ? null : `Schema not found: ${uri}`,
  };
}

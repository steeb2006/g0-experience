"use client";

import { useEffect, useState } from "react";
import type { SmartObjectSchema } from "@/lib/schemas/types";
import { getSchema, loadSchemaDefinitions } from "@/lib/schemas/registry";
import { Frame } from "./atomics";
import { AtomicRenderer } from "./AtomicRenderer";

interface SmartObjectRendererProps {
  /** Schema URI, e.g., "g0://smart-objects/client-card@1.0" */
  schemaUri: string;
  /** Optional data to use instead of schema's sampleData */
  data?: Record<string, unknown>;
  /** Optional class name for the container */
  className?: string;
}

/**
 * Renders a Smart Object from its schema definition
 *
 * Features:
 * - Loads schema by URI (with version resolution)
 * - Falls back to sampleData if no data provided
 * - Composes atomic objects based on schema definition
 * - Resolves data bindings to actual values
 */
export function SmartObjectRenderer({
  schemaUri,
  data,
  className,
}: SmartObjectRendererProps) {
  const [schema, setSchema] = useState<SmartObjectSchema | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSchema() {
      setLoading(true);
      setError(null);

      try {
        // Ensure definitions are loaded
        loadSchemaDefinitions();

        // Get the schema
        const loadedSchema = getSchema(schemaUri);
        if (loadedSchema) {
          setSchema(loadedSchema);
        } else {
          setError(`Schema not found: ${schemaUri}`);
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load schema");
      } finally {
        setLoading(false);
      }
    }

    loadSchema();
  }, [schemaUri]);

  // Loading state
  if (loading) {
    return (
      <div className={className}>
        <div className="flex items-center justify-center p-8 rounded-2xl bg-[var(--g0-bg-elevated-1)] border border-[var(--g0-bg-elevated-3)]">
          <div className="animate-pulse text-[var(--g0-text-muted)]">
            Loading Smart Object...
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !schema) {
    return (
      <div className={className}>
        <div className="flex flex-col items-center justify-center p-8 rounded-2xl bg-rose-500/10 border border-rose-500/30">
          <div className="text-rose-400 text-sm font-medium mb-2">
            Failed to load Smart Object
          </div>
          <div className="text-[var(--g0-text-muted)] text-xs font-mono">
            {error || "Unknown error"}
          </div>
          <div className="text-[var(--g0-text-muted)] text-xs mt-2">
            URI: {schemaUri}
          </div>
        </div>
      </div>
    );
  }

  // Use provided data or fall back to sample data
  const effectiveData = data ?? schema.sampleData;
  const { root, children } = schema.composition;

  return (
    <div className={className}>
      <Frame
        width={root.width}
        height={root.height}
        padding={root.padding}
        background={root.background}
        border={root.border}
      >
        {children.map((child) => (
          <AtomicRenderer
            key={child.id}
            definition={child}
            data={effectiveData}
          />
        ))}
      </Frame>
    </div>
  );
}

/**
 * Inline version for rendering schemas directly (without loading from registry)
 */
export function SmartObjectFromSchema({
  schema,
  data,
  className,
}: {
  schema: SmartObjectSchema;
  data?: Record<string, unknown>;
  className?: string;
}) {
  const effectiveData = data ?? schema.sampleData;
  const { root, children } = schema.composition;

  return (
    <div className={className}>
      <Frame
        width={root.width}
        height={root.height}
        padding={root.padding}
        background={root.background}
        border={root.border}
      >
        {children.map((child) => (
          <AtomicRenderer
            key={child.id}
            definition={child}
            data={effectiveData}
          />
        ))}
      </Frame>
    </div>
  );
}

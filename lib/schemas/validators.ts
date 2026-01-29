/**
 * Zod Validators for Smart Object Schemas
 *
 * Runtime validation for schema structure, version format,
 * and binding path existence in sample data.
 */

import { z } from "zod";

// Atomic types enum
export const AtomicTypeSchema = z.enum([
  // Shapes
  "Frame",
  "Rectangle",
  "Circle",
  "Ellipse",
  // Text
  "Text",
  "Label",
  "Badge",
  // Media
  "Image",
  "Avatar",
  "Icon",
  // Charts
  "BarChart",
  "PieChart",
  "LineChart",
  "DonutChart",
  "Sparkline",
  "RadarChart",
  // Connectors
  "Edge",
  "Line",
  "Arrow",
]);

// Position schema
export const PositionSchema = z.object({
  x: z.number(),
  y: z.number(),
});

// Size schema
export const SizeSchema = z.object({
  width: z.number().positive(),
  height: z.number().positive(),
});

// Text style schema
export const TextStyleSchema = z.object({
  variant: z.enum(["h1", "h2", "h3", "body", "small", "label"]).optional(),
  color: z.string().optional(),
  weight: z.enum(["normal", "medium", "semibold", "bold"]).optional(),
  align: z.enum(["left", "center", "right"]).optional(),
});

// Shape style schema
export const ShapeStyleSchema = z.object({
  fill: z.string().optional(),
  stroke: z.string().optional(),
  strokeWidth: z.number().optional(),
  opacity: z.number().min(0).max(1).optional(),
  radius: z.number().optional(),
  // Background image support
  backgroundImage: z.string().optional(),
  backgroundSize: z.enum(["cover", "contain", "auto"]).optional(),
  backgroundPosition: z.string().optional(),
});

// Combined style schema
export const AtomicStyleSchema = TextStyleSchema.merge(ShapeStyleSchema);

// Atomic definition schema (recursive for children)
export const AtomicDefinitionSchema: z.ZodType<{
  id: string;
  type: z.infer<typeof AtomicTypeSchema>;
  position: z.infer<typeof PositionSchema>;
  size?: z.infer<typeof SizeSchema>;
  binding?: string;
  style?: z.infer<typeof AtomicStyleSchema>;
  children?: z.infer<typeof AtomicDefinitionSchema>[];
  radius?: number;
  content?: string;
  src?: string;
  alt?: string;
  data?: unknown[] | Record<string, unknown>;
  labels?: string[];
  from?: string;
  to?: string;
  showLabels?: boolean;
  showValues?: boolean;
  showGrid?: boolean;
}> = z.lazy(() =>
  z.object({
    id: z.string().min(1, "Atomic ID is required"),
    type: AtomicTypeSchema,
    position: PositionSchema,
    size: SizeSchema.optional(),
    binding: z.string().optional(),
    style: AtomicStyleSchema.optional(),
    children: z.array(AtomicDefinitionSchema).optional(),
    // Type-specific properties
    radius: z.number().optional(),
    content: z.string().optional(),
    src: z.string().optional(),
    alt: z.string().optional(),
    data: z.union([z.array(z.unknown()), z.record(z.string(), z.unknown())]).optional(),
    labels: z.array(z.string()).optional(),
    // RadarChart properties
    showLabels: z.boolean().optional(),
    showValues: z.boolean().optional(),
    showGrid: z.boolean().optional(),
    from: z.string().optional(),
    to: z.string().optional(),
  })
);

// Frame definition schema
export const FrameDefinitionSchema = z.object({
  type: z.literal("Frame"),
  width: z.number().positive("Frame width must be positive"),
  height: z.number().positive("Frame height must be positive"),
  padding: z.number().optional(),
  background: z.string().optional(),
  border: z
    .object({
      color: z.string(),
      width: z.number(),
      radius: z.number().optional(),
    })
    .optional(),
});

// Schema URI regex: g0://smart-objects/[name]
const SCHEMA_URI_REGEX = /^g0:\/\/smart-objects\/[a-z0-9-]+$/;

// Semver regex: X.Y.Z
const SEMVER_REGEX = /^\d+\.\d+\.\d+$/;

// Complete Smart Object schema validator
export const SmartObjectSchemaValidator = z.object({
  schema: z.string().regex(SCHEMA_URI_REGEX, {
    message: 'Schema URI must follow format: g0://smart-objects/[name]',
  }),
  version: z.string().regex(SEMVER_REGEX, {
    message: 'Version must be semver format: X.Y.Z',
  }),
  name: z.string().optional(),
  description: z.string().optional(),
  composition: z.object({
    root: FrameDefinitionSchema,
    children: z.array(AtomicDefinitionSchema),
  }),
  sampleData: z.record(z.string(), z.any()),
});

// Type inference from schema
export type SmartObjectSchemaInput = z.input<typeof SmartObjectSchemaValidator>;
export type SmartObjectSchemaOutput = z.output<typeof SmartObjectSchemaValidator>;

/**
 * Validate a Smart Object schema
 */
export function validateSchema(schema: unknown): {
  success: boolean;
  data?: SmartObjectSchemaOutput;
  errors?: z.ZodError;
} {
  const result = SmartObjectSchemaValidator.safeParse(schema);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, errors: result.error };
}

/**
 * Extract all binding paths from a schema
 */
export function extractBindingPaths(schema: SmartObjectSchemaOutput): string[] {
  const paths: string[] = [];

  function extractFromChildren(children: typeof schema.composition.children) {
    for (const child of children) {
      if (child.binding) {
        paths.push(child.binding);
      }
      if (child.children) {
        extractFromChildren(child.children);
      }
    }
  }

  extractFromChildren(schema.composition.children);
  return paths;
}

/**
 * Validate that all binding paths exist in the sample data
 */
export function validateBindings(
  schema: SmartObjectSchemaOutput
): { valid: boolean; missingPaths: string[] } {
  const paths = extractBindingPaths(schema);
  const missingPaths: string[] = [];

  for (const path of paths) {
    if (!pathExistsInData(path, schema.sampleData)) {
      missingPaths.push(path);
    }
  }

  return {
    valid: missingPaths.length === 0,
    missingPaths,
  };
}

/**
 * Check if a JSONPath exists in data
 */
function pathExistsInData(path: string, data: Record<string, unknown>): boolean {
  // Remove leading $. if present
  const normalizedPath = path.startsWith("$.") ? path.slice(2) : path;
  const segments = normalizedPath.split(".");

  let current: unknown = data;
  for (const segment of segments) {
    if (current === null || current === undefined) {
      return false;
    }
    if (typeof current !== "object") {
      return false;
    }
    current = (current as Record<string, unknown>)[segment];
  }

  return current !== undefined;
}

/**
 * Validate unique IDs in a schema
 */
export function validateUniqueIds(
  schema: SmartObjectSchemaOutput
): { valid: boolean; duplicates: string[] } {
  const ids = new Set<string>();
  const duplicates: string[] = [];

  function checkChildren(children: typeof schema.composition.children) {
    for (const child of children) {
      if (ids.has(child.id)) {
        duplicates.push(child.id);
      } else {
        ids.add(child.id);
      }
      if (child.children) {
        checkChildren(child.children);
      }
    }
  }

  checkChildren(schema.composition.children);

  return {
    valid: duplicates.length === 0,
    duplicates,
  };
}

/**
 * Complete validation of a Smart Object schema
 */
export function validateSmartObjectSchema(schema: unknown): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // 1. Validate structure
  const structureResult = validateSchema(schema);
  if (!structureResult.success) {
    const zodErrors = structureResult.errors?.issues || [];
    errors.push(
      ...zodErrors.map((e) => `${e.path.join(".")}: ${e.message}`)
    );
    return { valid: false, errors };
  }

  const validSchema = structureResult.data!;

  // 2. Validate unique IDs
  const idsResult = validateUniqueIds(validSchema);
  if (!idsResult.valid) {
    errors.push(`Duplicate IDs found: ${idsResult.duplicates.join(", ")}`);
  }

  // 3. Validate bindings exist in sampleData
  const bindingsResult = validateBindings(validSchema);
  if (!bindingsResult.valid) {
    errors.push(
      `Missing binding paths in sampleData: ${bindingsResult.missingPaths.join(", ")}`
    );
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

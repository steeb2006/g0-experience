/**
 * Schema-Driven Smart Object Type Definitions
 *
 * These types define the structure of Smart Object schemas that
 * compose atomic primitives with data bindings.
 */

// Atomic object types that can be composed into Smart Objects
export type AtomicType =
  // Shapes
  | "Frame"
  | "Rectangle"
  | "Circle"
  | "Ellipse"
  // Text
  | "Text"
  | "Label"
  | "Badge"
  // Media
  | "Image"
  | "Avatar"
  | "Icon"
  // Charts
  | "BarChart"
  | "PieChart"
  | "LineChart"
  | "DonutChart"
  | "Sparkline"
  | "RadarChart"
  // Connectors
  | "Edge"
  | "Line"
  | "Arrow";

// Position in the composition
export interface Position {
  x: number;
  y: number;
}

// Size definition
export interface Size {
  width: number;
  height: number;
}

// Text styling options
export interface TextStyle {
  variant?: "h1" | "h2" | "h3" | "body" | "small" | "label";
  color?: "primary" | "secondary" | "muted" | "accent" | string;
  weight?: "normal" | "medium" | "semibold" | "bold";
  align?: "left" | "center" | "right";
}

// Shape styling options
export interface ShapeStyle {
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
  radius?: number; // border radius for rectangles
  // Background image support
  backgroundImage?: string; // URL or CSS gradient (e.g., "linear-gradient(...)")
  backgroundSize?: "cover" | "contain" | "auto";
  backgroundPosition?: string; // CSS position value (e.g., "center", "top left")
}

// Combined style type
export type AtomicStyle = TextStyle & ShapeStyle;

// Definition of an atomic object within a composition
export interface AtomicDefinition {
  id: string;
  type: AtomicType;
  position: Position;
  size?: Size;
  binding?: string; // JSONPath: "$.client.name"
  style?: AtomicStyle;
  children?: AtomicDefinition[];

  // Type-specific properties
  // Circle
  radius?: number;
  // Text
  content?: string; // Static content (used if no binding)
  // Image/Avatar
  src?: string;
  alt?: string;
  // Chart
  data?: unknown[] | unknown;
  labels?: string[];
  // RadarChart
  showLabels?: boolean;
  showValues?: boolean;
  showGrid?: boolean;
  // Edge/Line
  from?: string; // ID reference
  to?: string; // ID reference
}

// Root frame definition (container for the Smart Object)
export interface FrameDefinition {
  type: "Frame";
  width: number;
  height: number;
  padding?: number;
  background?: string;
  border?: {
    color: string;
    width: number;
    radius?: number;
  };
}

// Complete Smart Object schema definition
export interface SmartObjectSchema {
  // Schema URI: "g0://smart-objects/client-card"
  schema: string;

  // Semver version: "1.0.0"
  version: string;

  // Human-readable name and description
  name?: string;
  description?: string;

  // Composition of atomic objects
  composition: {
    root: FrameDefinition;
    children: AtomicDefinition[];
  };

  // Sample data for immediate rendering
  sampleData: Record<string, unknown>;
}

// Parsed schema URI
export interface ParsedSchemaUri {
  protocol: "g0";
  namespace: "smart-objects";
  name: string;
  version?: string; // Optional, e.g., "1.0" or "1.0.0"
}

// Schema registry entry with metadata
export interface SchemaRegistryEntry {
  schema: SmartObjectSchema;
  loadedAt: number;
  source: "file" | "remote" | "inline";
}

// Binding resolution result
export interface BindingResult<T = unknown> {
  value: T | undefined;
  path: string;
  found: boolean;
}

// Validation result for schemas
export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

export interface ValidationError {
  path: string;
  message: string;
  code: string;
}

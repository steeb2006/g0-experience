/**
 * Smart Object Schema System
 *
 * This module provides the foundation for schema-driven Smart Objects:
 * - Type definitions for schemas and atomics
 * - Zod validators for runtime validation
 * - JSONPath binding resolution
 * - Schema registry for loading and caching
 */

// Types
export type {
  AtomicType,
  Position,
  Size,
  TextStyle,
  ShapeStyle,
  AtomicStyle,
  AtomicDefinition,
  FrameDefinition,
  SmartObjectSchema,
  ParsedSchemaUri,
  SchemaRegistryEntry,
  BindingResult,
  ValidationResult,
  ValidationError,
} from "./types";

// Validators
export {
  AtomicTypeSchema,
  PositionSchema,
  SizeSchema,
  TextStyleSchema,
  ShapeStyleSchema,
  AtomicStyleSchema,
  AtomicDefinitionSchema,
  FrameDefinitionSchema,
  SmartObjectSchemaValidator,
  validateSchema,
  validateBindings,
  validateUniqueIds,
  validateSmartObjectSchema,
  extractBindingPaths,
} from "./validators";

// Bindings
export {
  resolveBinding,
  resolveBindings,
  bindingExists,
  getMissingBindings,
  formatBoundValue,
  setBinding,
  extractPaths,
} from "./bindings";

// Registry
export {
  parseSchemaUri,
  buildSchemaUri,
  registerSchema,
  getSchema,
  listSchemas,
  schemaExists,
  clearCache,
  clearRegistry,
  loadSchemaDefinitions,
  useSchema,
} from "./registry";

# Plan: Schema-Driven Smart Object System

## Goal
Transform Smart Objects from hardcoded React components to schema-driven, composable objects assembled from atomic primitives with data bindings.

---

## Current State
- 7 hardcoded dashboard components (FinanceKPIDashboard, HRDashboard, etc.)
- 2 atomic components (Text, Sparkline)
- No JSON schema definitions
- No data binding system
- Data imported directly from mock files

## Target State
- JSON schemas define Smart Object structure
- Atomic objects rendered dynamically from schema
- Data bindings connect schema fields to data values
- Schema versioning (`g0://smart-objects/name@1.0.0`)
- Sample data enables immediate rendering

---

## Implementation Plan

### Phase 1: Schema Foundation

**1.1 Create schema types** (`lib/schemas/types.ts`)
```typescript
interface SmartObjectSchema {
  schema: string;        // "g0://smart-objects/client-card"
  version: string;       // "1.0.0"
  composition: {
    root: FrameDefinition;
    children: AtomicDefinition[];
  };
  sampleData: Record<string, unknown>;
}

interface AtomicDefinition {
  id: string;
  type: AtomicType;
  position: { x: number; y: number };
  size?: { width: number; height: number };
  binding?: string;      // JSONPath: "$.client.name"
  style?: AtomicStyle;
  children?: AtomicDefinition[];
}

type AtomicType =
  | "Frame" | "Rectangle" | "Circle"
  | "Text" | "Label" | "Badge"
  | "Image" | "Avatar" | "Icon"
  | "BarChart" | "PieChart" | "Sparkline"
  | "Edge" | "Line";
```

**1.2 Create Zod validators** (`lib/schemas/validators.ts`)
- Validate schema structure
- Validate version format (semver)
- Validate binding paths exist in sampleData

**1.3 Create schema registry** (`lib/schemas/registry.ts`)
- Load schemas from JSON files
- Cache parsed schemas
- Version resolution (`@1.0` → `@1.0.2`)

---

### Phase 2: Atomic Object Library

**2.1 Expand atomic components** (`components/smart-objects/atomics/`)

| Atomic | Props | Binding Support |
|--------|-------|-----------------|
| Frame | width, height, padding, background | - |
| Rectangle | width, height, fill, stroke, radius | - |
| Circle | radius, fill, stroke | color binding |
| Text | content, variant, color | text binding |
| Label | text, icon | text binding |
| Badge | text, variant | text binding |
| Image | src, alt, fit | url binding |
| Avatar | src, name, size | url/text binding |
| BarChart | data, labels | array binding |
| PieChart | data, labels | array binding |
| Sparkline | data, color | array binding |
| Edge | from, to, style | - |

**2.2 Create atomic renderer** (`lib/schemas/AtomicRenderer.tsx`)
```typescript
function AtomicRenderer({
  definition: AtomicDefinition,
  data: Record<string, unknown>
}) {
  const value = definition.binding
    ? resolveBinding(definition.binding, data)
    : undefined;

  switch (definition.type) {
    case "Text": return <Text {...definition.style}>{value}</Text>;
    case "Circle": return <Circle {...definition} fill={value} />;
    // ... etc
  }
}
```

---

### Phase 3: Data Binding System

**3.1 JSONPath resolver** (`lib/schemas/bindings.ts`)
```typescript
// Resolve "$.client.name" from { client: { name: "John" } }
function resolveBinding(path: string, data: Record<string, unknown>): unknown;

// Validate all bindings exist in data
function validateBindings(schema: SmartObjectSchema, data: Record<string, unknown>): ValidationResult;
```

**3.2 Binding types**
- String bindings → Text, Label, Badge
- Number bindings → formatted display
- Array bindings → Charts, lists
- URL bindings → Image, Avatar
- Color bindings → fill, stroke

---

### Phase 4: Smart Object Renderer

**4.1 Create SmartObjectRenderer** (`components/smart-objects/SmartObjectRenderer.tsx`)
```typescript
interface SmartObjectRendererProps {
  schemaUri: string;     // "g0://smart-objects/client-card@1.0"
  data?: Record<string, unknown>;  // Real data (falls back to sampleData)
}

function SmartObjectRenderer({ schemaUri, data }: SmartObjectRendererProps) {
  const schema = useSchema(schemaUri);
  const effectiveData = data ?? schema.sampleData;

  return (
    <Frame {...schema.composition.root}>
      {schema.composition.children.map(child => (
        <AtomicRenderer
          key={child.id}
          definition={child}
          data={effectiveData}
        />
      ))}
    </Frame>
  );
}
```

**4.2 Update board page** (`app/[orgId]/[workspaceId]/[boardId]/page.tsx`)
```typescript
// Replace hardcoded switch
const renderSmartObject = () => {
  const board = useBoard(boardId);
  return (
    <SmartObjectRenderer
      schemaUri={board.smartObjectType}
      data={board.currentData}
    />
  );
};
```

---

### Phase 5: Example Schema Migration

**5.1 Create first schema** (`lib/schemas/definitions/client-card.json`)
```json
{
  "schema": "g0://smart-objects/client-card",
  "version": "1.0.0",
  "composition": {
    "root": { "type": "Frame", "width": 300, "height": 200, "padding": 16 },
    "children": [
      {
        "id": "avatar",
        "type": "Avatar",
        "position": { "x": 24, "y": 24 },
        "size": { "width": 64, "height": 64 },
        "binding": "$.client.avatar"
      },
      {
        "id": "name",
        "type": "Text",
        "position": { "x": 100, "y": 32 },
        "style": { "variant": "h2" },
        "binding": "$.client.name"
      },
      {
        "id": "title",
        "type": "Text",
        "position": { "x": 100, "y": 56 },
        "style": { "variant": "body", "color": "muted" },
        "binding": "$.client.title"
      }
    ]
  },
  "sampleData": {
    "client": {
      "name": "Maria Schmidt",
      "title": "VP of Engineering",
      "avatar": "/avatars/maria.jpg"
    }
  }
}
```

---

## Files to Create

| File | Purpose |
|------|---------|
| `lib/schemas/types.ts` | TypeScript interfaces |
| `lib/schemas/validators.ts` | Zod validation |
| `lib/schemas/registry.ts` | Schema loading/caching |
| `lib/schemas/bindings.ts` | JSONPath resolver |
| `lib/schemas/AtomicRenderer.tsx` | Dynamic atomic rendering |
| `components/smart-objects/SmartObjectRenderer.tsx` | Main renderer |
| `components/smart-objects/atomics/Frame.tsx` | Frame container |
| `components/smart-objects/atomics/Rectangle.tsx` | Rectangle shape |
| `components/smart-objects/atomics/Circle.tsx` | Circle shape |
| `components/smart-objects/atomics/Avatar.tsx` | Avatar component |
| `components/smart-objects/atomics/Badge.tsx` | Badge component |
| `components/smart-objects/atomics/BarChart.tsx` | Bar chart |
| `components/smart-objects/atomics/PieChart.tsx` | Pie chart |
| `lib/schemas/definitions/client-card.json` | First schema example |

## Files to Modify

| File | Change |
|------|--------|
| `app/[orgId]/[workspaceId]/[boardId]/page.tsx` | Use SmartObjectRenderer |
| `convex/schema.ts` | Add schema fields to boards |

---

## Verification

1. **Schema loads**: `useSchema("g0://smart-objects/client-card@1.0")` returns parsed schema
2. **Bindings resolve**: `$.client.name` extracts "Maria Schmidt" from sample data
3. **Atomics render**: Each atomic type renders correctly with bound data
4. **Fallback works**: Missing data falls back to sampleData
5. **Board renders**: Board page shows SmartObjectRenderer with schema

---

## Scope

**In scope:**
- Schema types and validation
- Atomic object library (10+ components)
- Data binding system
- SmartObjectRenderer component
- 1 example schema (client-card)

**Out of scope (future):**
- Migrating all 7 existing dashboards to schemas
- Schema editor UI
- Entity data push integration
- Real-time schema updates

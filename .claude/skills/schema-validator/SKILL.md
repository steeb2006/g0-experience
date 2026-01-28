# Schema Validator

Use this skill when creating or validating Smart Object schemas.

## Schema Structure

Every Smart Object schema must have:

```json
{
  "schema": "g0://smart-objects/[name]",
  "version": "X.Y.Z",
  "composition": {
    "root": { "type": "Frame", "width": number, "height": number },
    "children": [ /* atomic objects */ ]
  },
  "sampleData": { /* realistic sample data */ }
}
```

## Version Rules

- **MAJOR (X)**: Breaking changes - data shape changed, atomics removed
- **MINOR (Y)**: New features - optional bindings, new atomics added
- **PATCH (Z)**: Bug fixes - rendering improvements, no contract changes

## Atomic Objects

Each child in composition must reference a valid atomic:

| Category | Atomics |
|----------|---------|
| Shapes | Rectangle, Circle, Ellipse, Polygon |
| Text | Text, Paragraph, Label, Badge |
| Connectors | Edge, Line, Arrow, Curve |
| Containers | Frame, Group, Section |
| Media | Image, Icon, Avatar |
| Charts | BarChart, PieChart, LineChart, DonutChart |
| Specialized | OceanChart, Heatmap, NetworkGraph |

## Atomic Definition

```json
{
  "id": "unique-id",
  "type": "Circle",
  "position": { "x": 100, "y": 100 },
  "radius": 50,
  "binding": "$.client.photo"
}
```

## Bindings

Use JSONPath syntax for data bindings:
- `$.client.name` - binds to client.name in data
- `$.metrics.revenue` - binds to metrics.revenue
- `$.ocean.O` - binds to ocean.O (openness score)

## Sample Data Requirements

1. **Must be realistic** - use actual-looking data, not "test123"
2. **Must match bindings** - every binding path must exist in sampleData
3. **Must be complete** - no missing required fields

## Validation Checklist

- [ ] Schema URI follows `g0://smart-objects/[name]@[version]` format
- [ ] Version follows semver (X.Y.Z)
- [ ] Root is a Frame with width/height
- [ ] All children have unique IDs
- [ ] All atomic types are valid
- [ ] All bindings have corresponding sampleData paths
- [ ] sampleData is realistic and complete

## Example: Valid Schema

```json
{
  "schema": "g0://smart-objects/client-card",
  "version": "1.0.0",
  "composition": {
    "root": { "type": "Frame", "width": 300, "height": 200 },
    "children": [
      {
        "id": "avatar",
        "type": "Avatar",
        "position": { "x": 24, "y": 24 },
        "size": 64,
        "binding": "$.client.photo"
      },
      {
        "id": "name",
        "type": "Text",
        "position": { "x": 100, "y": 40 },
        "binding": "$.client.name"
      }
    ]
  },
  "sampleData": {
    "client": {
      "name": "Maria Schmidt",
      "photo": "https://example.com/avatars/maria.jpg"
    }
  }
}
```

## Zod Validation (Runtime)

```typescript
import { z } from "zod";

const AtomicSchema = z.object({
  id: z.string(),
  type: z.enum(["Rectangle", "Circle", "Text", "Image", ...]),
  position: z.object({ x: z.number(), y: z.number() }),
  binding: z.string().optional(),
});

const SmartObjectSchema = z.object({
  schema: z.string().regex(/^g0:\/\/smart-objects\/.+/),
  version: z.string().regex(/^\d+\.\d+\.\d+$/),
  composition: z.object({
    root: z.object({ type: z.literal("Frame"), width: z.number(), height: z.number() }),
    children: z.array(AtomicSchema),
  }),
  sampleData: z.record(z.any()),
});
```

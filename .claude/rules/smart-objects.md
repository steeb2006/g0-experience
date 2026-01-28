---
paths:
  - "lib/schemas/**/*.ts"
  - "lib/schemas/**/*.json"
  - "components/smart-objects/**/*.tsx"
  - "convex/smartObjects.ts"
---

# Smart Object Rules

## Schema Format
- URI: `g0://smart-objects/[name]@[version]`
- Version: semver (X.Y.Z)
- Root must be Frame with width/height

## Required Fields
- `schema` - URI string
- `version` - semver string
- `composition.root` - Frame definition
- `composition.children` - array of atomics
- `sampleData` - realistic sample data

## Bindings
- Use JSONPath: `$.client.name`, `$.metrics.revenue`
- Every binding must exist in sampleData
- Bindings are optional per atomic

## Atomics
- Each child needs unique `id`
- Valid types: Rectangle, Circle, Text, Image, Frame, Avatar, BarChart, PieChart, etc.
- Position is `{ x: number, y: number }`

## Board Rule
- 1 Board = 1 Smart Object (always)
- Multiple Smart Objects = use sub-boards

## Sample Data
- Must be realistic (not "test123")
- Must cover all binding paths
- Use actual-looking names, numbers, URLs

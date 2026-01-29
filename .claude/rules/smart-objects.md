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

## Dashboard Layout Pattern (CRITICAL)

**ALWAYS use the `RadialLayout` component for radial positioning.** Never use manual pixel calculations.

### RadialLayout Component (components/smart-objects/shared/RadialLayout.tsx)

This component handles all the positioning math correctly every time:
- Uses `50%` with calc() for horizontal centering (never fixed pixels)
- Includes Edit mode for fine-tuning element positions
- Provides utilities for calculating radial offsets

### Usage Pattern

```tsx
import { RadialLayout } from "../shared";

// Calculate offsets using the utility
const kpiOffsets = RadialLayout.calculateOffsets({
  count: 5,        // Number of items
  radius: 110,     // Distance from center
  startAngle: -90, // Start from top
});

// In JSX - 3-column layout
<div className="absolute top-14 bottom-14 left-0 right-0 flex">
  {/* Left sidebar: w-[220px] */}
  <div className="w-[220px] p-4" style={{ borderRight: "1px solid #1a1a1a" }}>
    {/* Sidebar content */}
  </div>

  {/* Center: RadialLayout handles all positioning */}
  <RadialLayout.Root centerY={206} showEditToggle>
    <RadialLayout.Ring radius={110} />

    <RadialLayout.Center id="entity">
      {/* Center element (entity badge, avatar, etc.) */}
    </RadialLayout.Center>

    {items.map((item, i) => (
      <RadialLayout.Item
        key={item.id}
        id={item.id}
        offsetX={offsets[i].x}
        offsetY={offsets[i].y}
      >
        {/* Item content */}
      </RadialLayout.Item>
    ))}
  </RadialLayout.Root>

  {/* Right sidebar: w-[220px] */}
  <div className="w-[220px] p-4" style={{ borderLeft: "1px solid #1a1a1a" }}>
    {/* Sidebar content */}
  </div>
</div>
```

### Key Rules

1. **NEVER use fixed pixel values** for horizontal centering (no `left: 260px`)
2. **ALWAYS use RadialLayout** for radial/orbital arrangements
3. **Edit mode is standard** - always enable `showEditToggle` for user polish
4. **3-column layout**: Left sidebar (220px) | Center (flex-1) | Right sidebar (220px)
5. **Header/Footer**: h-14 (56px) each, positioned absolutely

### Why This Works

The RadialLayout component uses `left: calc(50% + ${offset.x}px)` which:
- Centers relative to the parent container width (whatever that may be)
- Adds the radial offset from center
- Works regardless of actual pixel dimensions

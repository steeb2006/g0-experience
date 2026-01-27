# G0 Experience

> The Universal Canvas for AI Entities

## IMPORTANT: Development Server

**Port 3000 is occupied by another application (G0 Memory).**

**G0 Experience always runs on port 3005.**

```bash
# Start dev server
cd "/Users/stefanebner/Documents/G0 Experience" && npm run dev -- -p 3005

# Access the app
http://localhost:3005
```

---

## Vision

G0 Experience is where AI entities become **visible**, **interactive**, and **collaborative**. It transforms the invisible work of AI agents into tangible objects that humans can see, manipulate, and trust.

The core insight: As AI agents proliferate across every framework (Google ADK, LangChain, OpenAI Assistants, CrewAI), there's no unified place to *see* what they're doing. G0 Experience is that place—a visual coordination layer that sits above all agent frameworks.

## Core Metaphor

Think of G0 as a **war room** meets **design tool** meets **dashboard**:
- **War room**: Where strategy becomes visible through spatial arrangement
- **Design tool**: Where AI outputs are objects you can move, connect, and compose
- **Dashboard**: Where live data from agents updates in real-time

## Architecture

### System Boundary

G0 Experience is a **visualization layer only**. It does not own data or context.

```
┌─────────────────────────────────────────────────────────────┐
│              EXTERNAL SYSTEMS (Not G0)                      │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Context & Memory (Letta, etc.)         │   │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────────────────┐ │   │
│  │  │  Meta   │  │ Co-Orga │  │      Mission        │ │   │
│  │  └─────────┘  └─────────┘  └─────────────────────┘ │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                   Agent Frameworks                   │   │
│  │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────────┐  │   │
│  │  │ ADK  │ │ Lang │ │OpenAI│ │ Crew │ │  Custom  │  │   │
│  │  └──────┘ └──────┘ └──────┘ └──────┘ └──────────┘  │   │
│  └─────────────────────────────────────────────────────┘   │
└──────────────────────────┬──────────────────────────────────┘
                           │
              Protocols: MCP, A2A, REST/WebSocket
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                     G0 EXPERIENCE                           │
│                  (Visualization Layer)                      │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │   Canvas    │  │    Chat     │  │   Board Management  │ │
│  │  (Visual)   │  │ (Language)  │  │   (Organization)    │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
│                                                             │
│  Workspaces have Entity Owners (e.g., "co-CFO")            │
│  Boards inherit entity from workspace → determines context  │
└─────────────────────────────────────────────────────────────┘
```

### What Boards Store

**Critical**: Boards store **metadata and layout ONLY** - never data.

| Stored in Board | NOT Stored in Board |
|-----------------|---------------------|
| Smart Object reference (1 per board) | Smart Object data values |
| Workspace zone contents (chat outputs) | Entity context |
| Layout/viewport configuration | Business data |
| Visual styling | Raw source data |
| Sub-board references (hierarchy) | Computed content |

**1 Board = 1 Smart Object Rule**: Each board has exactly ONE Smart Object in its center zone. Workspace zones (shared above, private below) hold chat outputs and artifacts, not additional Smart Objects.

Data always flows live from the connected entity. The board is a "window" into the entity's world, not a container of data.

### Data Flow at Runtime

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│   Entity ("co-CFO")                                                     │
│        │                                                                │
│        │ provides data + chat capabilities                              │
│        ▼                                                                │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │  BOARD (infinite zoomable canvas)                               │   │
│   │                                                                 │   │
│   │  ┌─────────────────────────────────────────────────────────┐   │   │
│   │  │  SHARED WORKSPACE ZONE                                   │   │   │
│   │  │  • Chat outputs (reports, summaries) ← from entity tools │   │   │
│   │  │  • Collaborative artifacts                               │   │   │
│   │  └─────────────────────────────────────────────────────────┘   │   │
│   │                                                                 │   │
│   │  ┌─────────────────────────────────────────────────────────┐   │   │
│   │  │  SMART OBJECT ZONE (center)                             │   │   │
│   │  │  ┌───────────────────────────────────────────────────┐  │   │   │
│   │  │  │                                                   │  │   │   │
│   │  │  │   1 SMART OBJECT                                  │  │   │   │
│   │  │  │   data: ←──────────────────────────── from entity │  │   │   │
│   │  │  │                                                   │  │   │   │
│   │  │  └───────────────────────────────────────────────────┘  │   │   │
│   │  └─────────────────────────────────────────────────────────┘   │   │
│   │                                                                 │   │
│   │  ┌─────────────────────────────────────────────────────────┐   │   │
│   │  │  PRIVATE WORKSPACE ZONE                                 │   │   │
│   │  │  • My personal chat outputs                             │   │   │
│   │  │  • Private artifacts (only I see)                       │   │   │
│   │  └─────────────────────────────────────────────────────────┘   │   │
│   │                                                                 │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**Separation of Concerns**:
- **Board** = WHERE things are (layout, zones, viewport)
- **Smart Object Zone** = CENTER, exactly 1 Smart Object per board
- **Workspace Zones** = Chat outputs, artifacts, conversation outcomes
- **Entity** = WHAT things show (data, content) + OWNS the Smart ID mappings
- **Schema** = HOW things look (rendering rules)
- **G0** = Generates IDs, renders visuals, knows nothing about semantics

## Board Creation Workflow

### How Boards Get Created (Tool-Assisted)

A tool like Claude Code can assemble a complete "board of boards" structure:

```
┌─────────────────────────────────────────────────────────────────────────┐
│  1. TOOL RECEIVES REQUIREMENTS                                          │
│                                                                         │
│     User: "Create a client profile board for wealth management"        │
│                                                                         │
│     Tool (Claude Code) has access to:                                  │
│     • Available schemas: GET /schemas                                  │
│     • Available atomics: GET /atomics                                  │
│     • Board structure requirements                                      │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│  2. TOOL ASSEMBLES BOARD STRUCTURE (JSON)                              │
│                                                                         │
│     {                                                                   │
│       "board": {                                                        │
│         "name": "Client Profile - Mark P Porsche",                     │
│         "boundEntity": "co-CFO",                                       │
│         "subBoards": [                                                  │
│           {                                                             │
│             "name": "Personal",                                         │
│             "smartObject": {                                            │
│               "schema": "g0://smart-objects/wer-building-blocks@1.2",  │
│               "sampleData": { ... }                                    │
│             }                                                           │
│           },                                                            │
│           {                                                             │
│             "name": "Financial",                                        │
│             "smartObject": {                                            │
│               "schema": "g0://smart-objects/financial-overview@2.0",   │
│               "sampleData": { ... }                                    │
│             }                                                           │
│           }                                                             │
│         ]                                                               │
│       }                                                                 │
│     }                                                                   │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│  3. VALIDATION & CREATION (via MCP/API)                                │
│                                                                         │
│     Tool ──► POST /boards (JSON payload)                               │
│                                                                         │
│     G0 validates:                                                       │
│     • All schema references exist and versions are valid               │
│     • Sample data conforms to schema bindings                          │
│     • Entity binding is valid                                           │
│                                                                         │
│     G0 creates:                                                         │
│     • Board with sub-boards                                            │
│     • Smart Objects assembled from atomics                             │
│     • Renders with sample data immediately                             │
│                                                                         │
│     G0 returns:                                                         │
│     {                                                                   │
│       "boardId": "board_abc123",                                       │
│       "smartObjectIds": {                                               │
│         "Personal": "so_def456",                                       │
│         "Financial": "so_ghi789"                                       │
│       }                                                                 │
│     }                                                                   │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│  4. ADMIN POLISH (Layout Only)                                         │
│                                                                         │
│     Admin User can adjust:                                              │
│     ✓ Smart Object positions on board                                  │
│     ✓ Sub-board arrangement                                            │
│     ✓ Visual styling (colors, borders, labels)                         │
│     ✓ Zoom levels, viewport defaults                                   │
│     ✗ NOT the data (data comes from entity)                            │
│     ✗ NOT the atomic structure within Smart Objects (schema-defined)   │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│  5. ENTITY RECEIVES IDs & PUSHES REAL DATA                             │
│                                                                         │
│     Entity stores the returned Smart Object IDs                        │
│     Entity pushes real data to replace sample data:                    │
│                                                                         │
│     POST /smart-objects/so_def456/data                                 │
│     { "client": { "name": "Mark P Porsche", "ocean": {...} } }         │
│                                                                         │
│     G0 re-renders with real data                                       │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**Key Principle**: The tool (Claude Code) creates the STRUCTURE. The entity owns the DATA. G0 owns the RENDERING.

### Board Hierarchy & Entity Inheritance

Boards inherit entity from their **workspace**. Sub-boards inherit from parent board (which inherits from workspace).

```
┌─────────────────────────────────────────────────────────────────────────┐
│  WORKSPACE: Finance                                                     │
│  Entity Owner: "co-CFO"                                                │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  Board: "Client Profile - Mark P Porsche"                       │   │
│  │  Entity: (inherits "co-CFO" from workspace)                     │   │
│  │                                                                  │   │
│  │  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐│  │
│  │  │   Sub-Board A    │  │   Sub-Board B    │  │   Sub-Board C    ││  │
│  │  │   "Personal"     │  │   "Financial"    │  │   "HR Notes"     ││  │
│  │  │                  │  │                  │  │                  ││  │
│  │  │  Entity: (none)  │  │  Entity: (none)  │  │  Entity: "co-HR" ││  │
│  │  │  → inherits      │  │  → inherits      │  │  → OVERRIDES     ││  │
│  │  │    "co-CFO"      │  │    "co-CFO"      │  │                  ││  │
│  │  └──────────────────┘  └──────────────────┘  └──────────────────┘│  │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**Inheritance Chain**:
1. Workspace has entity owner (e.g., "co-CFO")
2. Boards in workspace inherit that entity
3. Sub-boards inherit from parent board
4. Any level can **override** with a different entity (rare, but possible)

### Chat Interface (Entity-Driven)

The chat interface is **generic** but its **capabilities are entity-specific**:

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Board Loads                                                            │
│       │                                                                 │
│       ▼                                                                 │
│  Query Entity: "What functions/tools do you provide?"                   │
│       │                                                                 │
│       ▼                                                                 │
│  Entity Returns: [                                                      │
│    { name: "generate_quarterly_report", params: [...] },                │
│    { name: "analyze_portfolio", params: [...] },                        │
│    { name: "create_client_summary", params: [...] }                     │
│  ]                                                                      │
│       │                                                                 │
│       ▼                                                                 │
│  Chat UI renders with these capabilities                                │
│  (Generic interface, like Claude Code, but with business outcomes)      │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**Key Insight**: The chat looks like Claude Desktop - clean conversation with artifacts panel - but instead of general-purpose tools, it has business tools discovered from the entity. User says "create quarterly report" and gets a real business artifact in the artifacts panel.

### Predefined Content Types

Entities can expose predefined content generators:

| Content Type | Description | Output |
|--------------|-------------|--------|
| `quarterly_report` | Financial summary for the quarter | PDF/Smart Object |
| `client_brief` | Executive summary of client relationship | Document |
| `risk_assessment` | Analysis of portfolio risks | Dashboard view |
| `relationship_map` | Visual network of connections | Graph Smart Object |

These are discoverable at board load time based on the bound entity's capabilities.

## Key Concepts

### Object Hierarchy: Atomic → Smart → Board

```
┌─────────────────────────────────────────────────────────────────────────┐
│  ATOMIC OBJECTS (Primitives - like Miro's basic shapes)                │
│                                                                         │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐    │
│  │Rectangle│ │ Circle │ │  Text  │ │  Line  │ │ Image  │ │ Frame  │    │
│  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘ └────────┘    │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐                          │
│  │  Edge  │ │PieChart│ │BarChart│ │  ...   │  ← The building blocks    │
│  └────────┘ └────────┘ └────────┘ └────────┘                          │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│  SMART OBJECT (Assembly of Atomic Objects + Data Bindings)             │
│                                                                         │
│  Example: "WeR Building Blocks" Smart Object                           │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  Composed of:                                                    │   │
│  │  • Circle (center) ──────────────► binds to: client.photo       │   │
│  │  • Text (name label) ────────────► binds to: client.name        │   │
│  │  • Circle (Personal category)                                    │   │
│  │    • Circle (Lifestyle) ─────────► binds to: client.lifestyle   │   │
│  │    • Circle (Philanthropy) ──────► binds to: client.philanthropy│   │
│  │    • Circle (Values) ────────────► binds to: client.values      │   │
│  │  • BarChart (OCEAN) ─────────────► binds to: client.ocean       │   │
│  │  • ... more atomic objects with bindings                         │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│  BOARD (Container for Smart Objects)                                   │
│                                                                         │
│  Stores: positions of Smart Objects, sub-board hierarchy               │
│  Does NOT store: the internal structure of Smart Objects               │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Schema Architecture (Versioned JSON)

Every Smart Object type is defined by a **versioned JSON schema** that specifies:
1. Which atomic objects compose it
2. How they're arranged relative to each other
3. What data bindings exist
4. Sample data for immediate rendering

```json
{
  "schema": "g0://smart-objects/wer-building-blocks",
  "version": "1.2.0",

  "composition": {
    "root": { "type": "Frame", "width": 800, "height": 800 },
    "children": [
      {
        "id": "profile-photo",
        "type": "Circle",
        "position": { "x": "center", "y": "center" },
        "radius": 60,
        "binding": "$.client.photo"
      },
      {
        "id": "name-label",
        "type": "Text",
        "position": { "x": "center", "y": "center+80" },
        "binding": "$.client.name"
      },
      {
        "id": "ocean-chart",
        "type": "BarChart",
        "position": { "x": 50, "y": 50 },
        "binding": "$.client.ocean"
      }
      // ... more atomic objects
    ]
  },

  "sampleData": {
    "client": {
      "name": "Sample Client",
      "photo": "https://placeholder.com/avatar.jpg",
      "ocean": { "O": 3, "C": 4, "E": 2, "A": 3, "N": 2 },
      "lifestyle": { "score": 3, "label": "Moderate" }
    }
  }
}
```

### Import Flow (Always with Sample Data)

```
┌─────────────────────────────────────────────────────────────────────────┐
│  1. ENTITY SENDS IMPORT REQUEST                                        │
│                                                                         │
│     Entity ──► Schema reference + Sample data (or use schema default)  │
│               {                                                         │
│                 "schema": "g0://smart-objects/wer-building-blocks@1.2", │
│                 "boardId": "board_xyz",                                 │
│                 "sampleData": { ... } // optional override              │
│               }                                                         │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│  2. G0 VALIDATES & CREATES                                             │
│                                                                         │
│     G0 ──► Validates schema version exists                             │
│         ──► Assembles atomic objects per schema                        │
│         ──► Binds sample data to binding points                        │
│         ──► Renders immediately (user sees something right away!)      │
│         ──► Generates Smart ID: "so_abc123"                            │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│  3. G0 RETURNS SMART ID                                                │
│                                                                         │
│     G0 ──► { "smartObjectId": "so_abc123", "status": "created" }       │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│  4. ENTITY STORES MAPPING & PUSHES REAL DATA                           │
│                                                                         │
│     Entity ──► Stores: { clientId: "mark-porsche", soId: "so_abc123" } │
│             ──► Pushes real data: { "so_abc123": realClientData }      │
│                                                                         │
│     G0 ──► Re-renders with real data (sample data replaced)            │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**Why Sample Data Matters**:
- Smart Object renders **immediately** on import (no blank placeholders)
- Admin can polish layout while seeing realistic visualization
- Schema validation catches data shape issues early
- Progressive enhancement: sample → real data is seamless

### Smart Object ↔ Entity Binding

**The entity owns the semantic mapping.** G0 just stores layout + renders data.

```
Entity's Mapping Table:
┌────────────────────┬──────────────────┬─────────────────────────┐
│ Entity Data Source │ Smart Object ID  │ Board ID                │
├────────────────────┼──────────────────┼─────────────────────────┤
│ client:mark-porsche│ so_abc123        │ board_client-profiles   │
│ client:jane-doe    │ so_def456        │ board_client-profiles   │
│ portfolio:growth   │ so_ghi789        │ board_portfolios        │
└────────────────────┴──────────────────┴─────────────────────────┘

G0 knows nothing about "mark-porsche" - it just renders what's pushed to so_abc123
```

**Key Points**:
- G0 generates Smart IDs, but doesn't know what data they represent
- Entity maintains the semantic mapping (which Smart Object shows what data)
- Import/updates are always initiated by the entity, not G0
- G0 is a "dumb renderer" - it displays what the entity sends
- Sample data ensures something always renders

### Atomic Objects Catalog

G0 provides a versioned set of atomic objects (like Miro's primitives):

| Category | Atomics | Purpose |
|----------|---------|---------|
| **Shapes** | `Rectangle`, `Circle`, `Ellipse`, `Polygon` | Basic geometric shapes |
| **Text** | `Text`, `Paragraph`, `Label`, `Badge` | Text rendering with styles |
| **Connectors** | `Edge`, `Line`, `Arrow`, `Curve` | Connect objects visually |
| **Containers** | `Frame`, `Group`, `Section` | Group and organize atomics |
| **Media** | `Image`, `Icon`, `Avatar` | Visual assets |
| **Charts** | `BarChart`, `PieChart`, `LineChart`, `DonutChart` | Data visualizations |
| **Specialized** | `OceanChart`, `Heatmap`, `NetworkGraph` | Domain-specific visuals |
| **Interactive** | `Button`, `Toggle`, `Slider` | User interaction points |

Each atomic has:
- **Properties**: position, size, rotation, opacity, z-index
- **Styling**: fill, stroke, shadow, border-radius
- **Bindings**: which data path populates it
- **Constraints**: min/max size, aspect ratio locks

```json
// Example: Circle atomic definition
{
  "type": "Circle",
  "version": "1.0.0",
  "properties": {
    "x": { "type": "number", "required": true },
    "y": { "type": "number", "required": true },
    "radius": { "type": "number", "default": 50 }
  },
  "styling": {
    "fill": { "type": "color", "default": "#ffffff" },
    "stroke": { "type": "color", "default": "#000000" },
    "strokeWidth": { "type": "number", "default": 1 }
  },
  "binding": {
    "type": "any",  // What data type this atomic can display
    "renderAs": "image" | "color" | "text"  // How bound data is rendered
  }
}
```

### G0 Context (External Memory Layer)

**Critical**: G0 Experience does NOT own or manage context. Context and memory live in external systems. G0 Experience **connects to** and **visualizes** this context.

```
┌──────────────────────────────────────────────────────────┐
│                 EXTERNAL CONTEXT SYSTEMS                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │
│  │    Meta     │  │   Co-Orga   │  │     Mission     │  │
│  │   Context   │  │   Context   │  │     Context     │  │
│  │   (Letta?)  │  │   (Letta?)  │  │    (Letta?)     │  │
│  └──────┬──────┘  └──────┬──────┘  └────────┬────────┘  │
└─────────┼────────────────┼──────────────────┼───────────┘
          │                │                  │
          ▼                ▼                  ▼
┌──────────────────────────────────────────────────────────┐
│              G0 EXPERIENCE (Visualization)               │
│                                                          │
│   Board ◄──── bound to ────► Entity (e.g., "co-CFO")    │
│                                                          │
│   The board renders the world AS SEEN BY that entity    │
└──────────────────────────────────────────────────────────┘
```

| Layer | What It Holds | Where It Lives |
|-------|---------------|----------------|
| **Meta** | Org identity, culture, compliance | External memory system |
| **Co-Orga** | Roles, relationships, archetypes (OCEAN, etc.) | External memory system |
| **Mission** | Current objectives, sprint context, active tasks | External memory system |

### Organizational Hierarchy

```
┌─────────────────────────────────────────────────────────────────────────┐
│  ORGANIZATION (e.g., "Acme Wealth Management")                         │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  WORKSPACE: Finance                                                │ │
│  │  Entity Owner: "co-CFO"                                           │ │
│  │                                                                    │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐               │ │
│  │  │   Board 1   │  │   Board 2   │  │   Board 3   │               │ │
│  │  │  Client A   │  │  Client B   │  │  Portfolio  │               │ │
│  │  │  Profile    │  │  Profile    │  │  Overview   │               │ │
│  │  └─────────────┘  └─────────────┘  └─────────────┘               │ │
│  │                                                                    │ │
│  │  All boards inherit "co-CFO" entity unless overridden             │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  WORKSPACE: Operations                                             │ │
│  │  Entity Owner: "co-COO"                                           │ │
│  │                                                                    │ │
│  │  ┌─────────────┐  ┌─────────────┐                                │ │
│  │  │   Board 1   │  │   Board 2   │                                │ │
│  │  │  Process    │  │  Team       │                                │ │
│  │  │  Dashboard  │  │  Overview   │                                │ │
│  │  └─────────────┘  └─────────────┘                                │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  WORKSPACE: HR                                                     │ │
│  │  Entity Owner: "co-CHRO"                                          │ │
│  │  ...                                                               │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**Hierarchy Rules**:
- **Organization** = top-level container (company)
- **Workspace** = domain/department (Finance, Ops, HR) + has an **Entity Owner**
- **Board** = individual canvas, inherits entity from workspace
- **Sub-Board** = child of board, inherits entity from parent board (which inherits from workspace)

### Entity Inheritance Chain

```
Organization
    └── Workspace (entity: "co-CFO")
            └── Board (inherits "co-CFO")
                    └── Sub-Board (inherits "co-CFO", unless overridden)
```

**Override Example**: A sub-board in the Finance workspace might override to "co-HR" for HR-related data within a client profile.

### What Entity Ownership Means

The workspace's entity owner determines:
- What context is available (the entity's view of the world)
- What actions/tools are possible (the entity's capabilities)
- What relationships are visible (the entity's network)
- What chat tools are discovered on board load

```
┌─────────────────────────────────────────────────────────────┐
│  WORKSPACE: Finance                                         │
│  Entity Owner: "co-CFO"                                     │
│                                                             │
│  All boards in this workspace see the world as co-CFO:     │
│  • Financial data the co-CFO has access to                 │
│  • Relationships the co-CFO maintains                      │
│  • Missions the co-CFO is involved in                      │
│  • Client profiles from co-CFO's perspective               │
│                                                             │
│  The "WeR Building Blocks" visualization shows a client    │
│  (Mark P Porsche) AS UNDERSTOOD BY co-CFO                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Same client, different workspaces**:
- Client in Finance workspace (co-CFO) → sees financial data, risk profiles
- Client in Operations workspace (co-COO) → sees operational touchpoints, service history

### Board Structure (1 Board = 1 Smart Object)

Every board is an **infinite zoomable canvas** with three zones:

```
                    ∞ infinite canvas ∞
    ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─
   │                                               │
   │  ┌─────────────────────────────────────────┐  │
   │  │         SHARED WORKSPACE ZONE           │  │
   │  │                                         │  │
   │  │  • Chat outputs visible to all          │  │
   │  │  • Collaborative artifacts              │  │
   │  │  • Shared conversation outcomes         │  │
   │  │                                         │  │
   │  ├─────────────────────────────────────────┤  │
   │  │                                         │  │
   │  │         SMART OBJECT ZONE               │  │
   │  │            (CENTER)                     │  │
   │  │                                         │  │
   │  │   ┌─────────────────────────────────┐   │  │
   │  │   │                                 │   │  │
   │  │   │    EXACTLY 1 SMART OBJECT       │   │  │
   │  │   │                                 │   │  │
   │  │   │    (e.g., WeR Building Blocks   │   │  │
   │  │   │     for Mark P Porsche)         │   │  │
   │  │   │                                 │   │  │
   │  │   └─────────────────────────────────┘   │  │
   │  │                                         │  │
   │  ├─────────────────────────────────────────┤  │
   │  │         PRIVATE WORKSPACE ZONE          │  │
   │  │                                         │  │
   │  │  • My personal chat outputs             │  │
   │  │  • Private notes and artifacts          │  │
   │  │  • Only I can see this                  │  │
   │  │                                         │  │
   │  └─────────────────────────────────────────┘  │
   │                                               │
    ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─
                    ∞ infinite canvas ∞
```

**Key Rules**:
- **1 Board = 1 Smart Object** (always in the center zone)
- **Workspace zones** = for chat outputs, not primary content
- **Shared zone (above)** = team can see/collaborate
- **Private zone (below)** = only you see
- **Canvas is infinite** = zoom in/out, pan freely like Miro/Figma

### Board of Boards (Hierarchy)

When you need multiple Smart Objects, you create a **board of boards**:

```
┌─────────────────────────────────────────────────────────────────────────┐
│  PARENT BOARD (bound to "co-CFO")                                      │
│                                                                         │
│  Smart Object Zone contains: Navigation/Overview Smart Object          │
│                                                                         │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐        │
│  │   SUB-BOARD 1   │  │   SUB-BOARD 2   │  │   SUB-BOARD 3   │        │
│  │   "Personal"    │  │   "Financial"   │  │   "Engagement"  │        │
│  │                 │  │                 │  │                 │        │
│  │  1 Smart Object │  │  1 Smart Object │  │  1 Smart Object │        │
│  │  (WeR Blocks)   │  │  (Portfolio)    │  │  (Network Map)  │        │
│  │                 │  │                 │  │                 │        │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘        │
│                                                                         │
│  Each sub-board inherits entity from parent unless overridden          │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**The "WeR Building Blocks" screenshot** = ONE Smart Object in ONE board, showing a client profile. The donut/circular visualization with all the categories (Personal, Financial, Engagement, etc.) is a single assembled Smart Object.

## Chat: Claude Desktop for Business

The chat interface follows the **Claude Desktop interaction model** - clean, conversational, with an artifacts panel:

| Claude Desktop | G0 Experience Chat |
|----------------|-------------------|
| Artifacts panel (code, documents, diagrams) | Artifacts panel (Smart Objects, reports, visualizations) |
| Clean conversational UI | Same clean UI, business-focused |
| General knowledge context | Entity-specific context (co-CFO's view of the world) |
| User: Consumer | User: Knowledge worker, executive, analyst |

**Same Pattern**:
1. User makes request in natural language
2. System determines which tool(s) to invoke
3. Tool executes against context (entity data, relationships, mission)
4. Result rendered as **artifact** (document, visualization, or inline response)

**Key Difference**: No hardcoded tools. Tools are **discovered at board load** from the bound entity. The chat is a generic shell that becomes specialized based on what entity it's connected to.

```
┌─────────────────────────────────────────────────────────────────────────┐
│  CHAT (Claude Desktop-style)                    │  ARTIFACTS PANEL     │
│  ┌──────────────────────────────────────────────┼─────────────────────┐│
│  │                                              │                     ││
│  │  User: "Create a quarterly report for       │  ┌─────────────────┐││
│  │         Mark P Porsche"                     │  │  Q4 2025 Report ││
│  │                                              │  │  ─────────────  │││
│  │  ─────────────────────────────────────────  │  │  Client: Mark P │││
│  │                                              │  │  Porsche        │││
│  │  Assistant: "I'll generate the quarterly    │  │                 │││
│  │  report for Mark P Porsche. Here's the      │  │  [PDF Preview]  │││
│  │  Q4 2025 summary..."                        │  │                 │││
│  │                                              │  │                 │││
│  │  [Clean conversational response, no         │  │  ┌───────────┐  │││
│  │   visible tool calls - just results]        │  │  │ Download  │  │││
│  │                                              │  │  └───────────┘  │││
│  │                                              │  │                 │││
│  │  ─────────────────────────────────────────  │  │  [Drop to Board]│││
│  │                                              │  └─────────────────┘││
│  │  [Artifact appears in panel →]              │                     ││
│  │  [Can drag to Shared or Private zone]       │                     ││
│  │                                              │                     ││
│  └──────────────────────────────────────────────┴─────────────────────┘│
└─────────────────────────────────────────────────────────────────────────┘
```

**Chat Output Destinations**:
- **Shared Workspace Zone** (above Smart Object): Team-visible outputs, collaborative artifacts
- **Private Workspace Zone** (below Smart Object): Personal notes, drafts, private outputs
- **Smart Object Zone** (center): Only updated by entity data pushes, NOT chat outputs

The chat produces artifacts that land in workspace zones. The central Smart Object is only updated when the entity pushes new data.

## Challenges to the Current Concept

### 1. Context Connection Reliability
**Issue**: G0 Experience depends on external context systems. What happens when:
- Context service is unavailable?
- Context data is stale or inconsistent?
- Entity's context permissions change mid-session?

**Proposed solution**:
- **Graceful degradation**: Show last-known context with staleness indicators
- **Context health dashboard**: Visual indicator of connection status to external systems
- **Permission refresh**: Periodic re-validation of entity access rights
- **Offline context cache**: Local snapshot for disconnected operation

### 2. Entity-Board Identity
**Issue**: When a board is bound to an entity like "co-CFO", what exactly defines that binding?
- Is it the entity's ID in the external system?
- What happens if the entity is renamed or restructured?
- Can a board be re-bound to a different entity?

**Proposed solution**:
- **Stable entity references**: Use immutable IDs, display names can change
- **Binding audit trail**: Log when bindings change
- **Re-binding workflow**: Explicit UX for changing board's bound entity with impact preview

### 3. Smart Object Schema Rigidity
**Issue**: Pre-defined schemas (PieChart, OceanChart, etc.) assume we know all visualization needs upfront. Novel data structures won't fit.

**Proposed solution**: Implement a **generative schema** approach:
- Core primitives that compose (not just pre-built types)
- AI-assisted schema generation: "Here's my data, suggest a visualization"
- User-defined Smart Object templates that become reusable

### 3. Protocol Proliferation
**Issue**: Supporting MCP, A2A, and REST/WebSocket simultaneously creates integration tax. Each protocol has different semantics.

**Proposed solution**: Prioritize ruthlessly:
- **Phase 1**: REST/WebSocket only (simple, proven)
- **Phase 2**: MCP (emerging standard, strategic importance)
- **Phase 3**: A2A (only if multi-agent orchestration becomes core use case)

### 4. Chat Interface Scope
**Issue**: The chat could be overloaded with file upload, outcome generation, canvas manipulation, batch operations, and runtime queries.

**Proposed solution**: Keep chat focused, separate other concerns:
- **Chat + Artifacts panel** for conversational requests and generated outputs (Claude Desktop pattern)
- **Command palette** for canvas operations (fast, keyboard-driven, ⌘K)
- **Action bar** for common operations (visible, clickable)
- **Drag-and-drop** for moving artifacts to board zones

### 5. The "Where Does Data Come From?" Problem
**Issue**: Smart Objects display data, but the PRD is vague on data provenance. Is data:
- Pulled on demand from external systems?
- Cached/snapshotted at import time?
- Continuously synced?

**Proposed solution**: Explicit data modes per Smart Object:
- **Snapshot**: Point-in-time capture, manually refreshable
- **Live**: Real-time connection to source (with staleness indicators)
- **Computed**: Derived from other Smart Objects on the board

### 6. Collaboration Semantics
**Issue**: CRDT handles technical conflict resolution, but what about semantic conflicts?
- User A moves an object to mean "high priority"
- User B moves the same object to mean "archived"
- CRDT merges positions; meaning is lost

**Proposed solution**:
- **Intent annotations**: Users can tag why they're making changes
- **Conflict surfaces**: Show when concurrent edits happened, let users resolve meaning
- **Ownership locks**: Optional "I'm working on this" mode for focused editing

## Concept Extensions

### 1. Temporal Canvas
The current design is purely spatial. Add a temporal dimension:

- **Timeline view**: See how a board evolved over time
- **Playback**: Replay the creation/modification sequence
- **Branch points**: "What if" scenarios from historical states
- **Scheduled states**: Board configurations that activate at future times

### 2. Agent Provenance & Explainability
When AI generates content, users need to understand *why*:

- **Generation trace**: Click any AI-generated Smart Object to see reasoning
- **Source attribution**: What data/context informed this output?
- **Confidence indicators**: Visual cues for AI certainty levels
- **Edit history**: Track human modifications to AI outputs

### 3. Cross-Board Topology
Boards shouldn't be islands:

- **Portal objects**: Windows into other boards
- **Relationship edges**: Connect objects across boards
- **Board inheritance**: Child boards that extend parent layouts
- **Global search**: Find objects across all boards in a workspace

### 4. Reactive Smart Objects
Smart Objects that respond to each other:

```
┌──────────────┐       triggers        ┌──────────────┐
│  Data Source │  ──────────────────▶  │   Analysis   │
│    Object    │                       │    Object    │
└──────────────┘                       └──────────────┘
                                              │
                                              │ updates
                                              ▼
                                       ┌──────────────┐
                                       │   Summary    │
                                       │    Object    │
                                       └──────────────┘
```

- Define data flows between objects
- Changes propagate automatically
- Visual indication of active flows

### 5. Multi-Modal Outputs
Beyond static visualizations:

- **Narrated boards**: AI generates voice-over for presentation mode
- **Video exports**: Animated board walkthroughs
- **Interactive reports**: Exported boards retain interactivity
- **Embed mode**: Boards embedded in external applications

### 6. Agent Workspace
Dedicated space for agent orchestration:

- **Agent topology view**: See all registered agents and their relationships
- **Message inspector**: Watch agent-to-agent communication
- **Budget dashboard**: Token usage, API calls, cost tracking
- **Debugging mode**: Step through agent execution

### 7. Context as First-Class Objects
Make G0 Context visible on the canvas itself:

- **Context cards**: Drag Meta/Co-Orga/Mission context onto boards
- **Context diff**: See what changed between board sessions
- **Context scoping**: Different board areas have different context visibility

## Technical Principles

### Offline-First
- IndexedDB as primary storage
- Sync when connected, work when not
- Clear conflict resolution UX

### Performance Budgets
- Canvas render: <100ms for 500 objects
- Chat first token: <3s
- Smart Object import: <2s for 1MB payload

### Schema Evolution & Versioning

**Atomic Objects** are versioned by G0:
```
g0://atomics/circle@1.0.0
g0://atomics/barchart@2.1.0
g0://atomics/text@1.3.0
```

**Smart Object Schemas** are versioned by whoever creates them:
```
g0://smart-objects/wer-building-blocks@1.2.0    (Tribe.One defined)
g0://smart-objects/portfolio-summary@3.0.0      (Custom customer schema)
```

**Version Rules**:
- MAJOR: Breaking changes (data shape changed, atomics removed)
- MINOR: New features (new optional bindings, new atomics added)
- PATCH: Bug fixes (rendering improvements, no contract changes)

**Backward Compatibility**:
- G0 maintains at least 2 major versions of each atomic
- Smart Object schemas must declare min/max atomic versions they support
- Migration path documented when breaking changes occur

**Schema Discovery**:
```
GET /schemas                         → List all available schemas
GET /schemas/wer-building-blocks     → Get latest version
GET /schemas/wer-building-blocks@1.2 → Get specific version
GET /atomics                         → List all available atomic objects
```

## Open Questions

### Entity & Context
1. **Entity Registry**: Where do entities (co-CFO, co-CMO, etc.) get registered? Is there a central entity catalog?

2. **Context Protocol**: What protocol does G0 use to query external context systems? MCP? Custom API?

3. **Entity Permissions**: How are entity access rights defined and enforced? In G0 or in the external system?

4. **Multi-Entity Boards**: Can a board have multiple bound entities? Or is it always 1:1?

5. **Smart ID Persistence**: When a board is duplicated or versioned, what happens to Smart IDs? Do entities need to re-map?

### Technical
6. **Agent Authentication**: How do agents authenticate to G0? API keys per workspace, or agent-level credentials?

7. **Data Residency**: Does G0 cache Smart Object data, or always fetch from source?

8. **Plugin System**: Can third parties create new Smart Object types? What's the extension model?

### Product
9. **Billing Model**: Is pricing per-seat, per-entity, per-token-consumed, or per-board?

10. **Mobile Strategy**: Is this desktop-only, or is there a mobile/tablet experience?

11. **Accessibility**: How do screen readers interact with a spatial canvas? What's the a11y story?

12. **White-Label Depth**: How deep does customization go? Just branding, or layout/feature toggles?

## Technology Recommendations

### Why Fresh + Fast Matters

G0 needs to feel like a **2026 product**, not a 2020 enterprise tool:
- Canvas interactions must be **instant** (60fps)
- UI should feel **native** (no spinners, no page reloads)
- Design should be **minimal chrome** (canvas-first, not toolbar-heavy)
- Must support **dark mode** as default

### Recommended Stack

| Layer | Technology | Why |
|-------|------------|-----|
| **Canvas Engine** | **tldraw** or **React Flow** | Battle-tested infinite canvas, MIT licensed, handles zoom/pan/selection |
| **UI Framework** | React 18 + TypeScript | Team expertise, ecosystem |
| **Styling** | Tailwind CSS + Radix UI | Utility-first + accessible primitives |
| **Animations** | Framer Motion | Smooth, declarative, performant |
| **State** | Zustand (or Valtio) | Simple, fast, TypeScript-native |
| **Database** | **Convex** | Real-time by default, TypeScript-native, serverless |
| **Collaboration** | Convex subscriptions (or YJS) | Built-in real-time, simpler than YJS for most cases |
| **Chat UI** | Custom (Claude Desktop-inspired) | Conversational UI with artifacts panel |
| **Deployment** | **Vercel** | Edge functions, fast deploys, preview URLs |
| **Schema Validation** | Zod + Convex validators | Runtime + compile-time safety |

### Infrastructure & Deployment

```
┌─────────────────────────────────────────────────────────────────────────┐
│  INFRASTRUCTURE                                                         │
│                                                                         │
│  GitHub ──► Vercel ──► Production                                      │
│    │          │                                                         │
│    │          ├── Preview deployments (per PR)                         │
│    │          ├── Edge functions                                        │
│    │          └── CDN for static assets                                │
│    │                                                                    │
│    └── Author: stefan.ebner@braintribe.com                             │
│                                                                         │
│  Convex (Backend)                                                       │
│    ├── Real-time subscriptions                                         │
│    ├── Serverless functions                                            │
│    ├── File storage                                                    │
│    └── Authentication (Clerk integration)                              │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Why Convex over Supabase

| Feature | Convex | Supabase |
|---------|--------|----------|
| **Real-time** | Native, automatic | Requires setup |
| **TypeScript** | End-to-end typed | SQL + client types |
| **Serverless** | Built-in functions | Separate edge functions |
| **Complexity** | Lower (one platform) | Higher (Postgres + APIs) |
| **Scaling** | Automatic | Manual configuration |
| **Learning curve** | Gentler | Steeper (SQL knowledge) |

**Convex fits G0 well** because:
- Real-time updates for Smart Object data pushes
- TypeScript validators match our Zod schemas
- Serverless functions for entity integration
- Built-in file storage for chat artifacts

### Repository Setup

```bash
# Repository
github.com/[org]/g0-experience

# Git config
git config user.email "stefan.ebner@braintribe.com"
git config user.name "Stefan Ebner"

# Branch strategy
main        → Production (auto-deploy to Vercel)
develop     → Staging (preview deploy)
feature/*   → Feature branches (preview deploy per PR)
```

### Project Structure (Next.js + Convex)

```
g0-experience/
├── app/                        # Next.js App Router
│   ├── (auth)/                 # Auth routes (login, signup)
│   ├── (dashboard)/            # Main app routes
│   │   ├── [orgId]/
│   │   │   ├── [workspaceId]/
│   │   │   │   └── [boardId]/
│   │   │   │       └── page.tsx
│   │   │   └── page.tsx
│   │   └── page.tsx
│   ├── api/                    # API routes (if needed)
│   └── layout.tsx
├── components/
│   ├── canvas/                 # tldraw wrapper, zones
│   ├── chat/                   # Chat UI components
│   ├── smart-objects/          # Smart Object renderers
│   ├── navigation/             # Board nav, workspace switcher
│   └── ui/                     # Design system (Radix-based)
├── convex/
│   ├── schema.ts               # Convex schema definitions
│   ├── organizations.ts        # Org mutations/queries
│   ├── workspaces.ts           # Workspace mutations/queries
│   ├── boards.ts               # Board mutations/queries
│   ├── smartObjects.ts         # Smart Object mutations/queries
│   └── _generated/             # Auto-generated types
├── lib/
│   ├── schemas/                # Smart Object JSON schemas
│   ├── atomics/                # Atomic object definitions
│   └── utils/                  # Helpers
├── public/
├── convex.json                 # Convex config
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

### Convex Schema (Preview)

```typescript
// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  organizations: defineTable({
    name: v.string(),
    slug: v.string(),
    settings: v.optional(v.object({})),
    createdBy: v.string(),
  }).index("by_slug", ["slug"]),

  workspaces: defineTable({
    organizationId: v.id("organizations"),
    name: v.string(),
    entityOwnerId: v.string(),  // e.g., "co-CFO"
    settings: v.optional(v.object({})),
  }).index("by_org", ["organizationId"]),

  boards: defineTable({
    workspaceId: v.id("workspaces"),
    parentBoardId: v.optional(v.id("boards")),  // for sub-boards
    name: v.string(),
    smartObjectId: v.optional(v.string()),      // 1 per board
    layout: v.object({
      viewport: v.object({ x: v.number(), y: v.number(), zoom: v.number() }),
      zones: v.object({}),  // zone configurations
    }),
    entityOverride: v.optional(v.string()),     // override workspace entity
  }).index("by_workspace", ["workspaceId"])
    .index("by_parent", ["parentBoardId"]),

  smartObjects: defineTable({
    boardId: v.id("boards"),
    schemaUri: v.string(),        // e.g., "g0://smart-objects/wer-building-blocks@1.2"
    sampleData: v.any(),          // default sample data
    currentData: v.optional(v.any()),  // pushed from entity
    position: v.object({ x: v.number(), y: v.number() }),
    size: v.object({ width: v.number(), height: v.number() }),
  }).index("by_board", ["boardId"]),

  artifacts: defineTable({
    boardId: v.id("boards"),
    zone: v.union(v.literal("shared"), v.literal("private")),
    ownerId: v.optional(v.string()),  // for private zone
    type: v.string(),                  // "pdf", "image", "text", etc.
    content: v.any(),
    position: v.object({ x: v.number(), y: v.number() }),
    createdAt: v.number(),
  }).index("by_board_zone", ["boardId", "zone"]),
});

### Canvas Library Comparison

| Library | Pros | Cons | Verdict |
|---------|------|------|---------|
| **tldraw** | Full-featured canvas, used by Notion/Linear, MIT, active | Opinionated styling | ✅ Best for fast start |
| **React Flow** | Great for node graphs, highly customizable | Less suited for free-form canvas | ✅ Good for board-of-boards nav |
| **Konva/React-Konva** | Low-level control, performant | More work to build UX | Consider for custom needs |
| **Excalidraw** | Hand-drawn aesthetic | Wrong visual language | ❌ Not for enterprise |
| **Fabric.js** | Powerful, SVG-based | Older patterns, heavier | ❌ Dated feel |

**Recommendation**: Start with **tldraw** for the infinite canvas, use **React Flow** for board navigation/hierarchy views.

### Design Language

For a "fresh 2026" look:
- **Dark mode first** (with light mode option)
- **Glassmorphism accents** - subtle blurs, transparency
- **Minimal UI chrome** - canvas dominates, tools appear contextually
- **Command palette** (⌘K) - like Linear, Raycast
- **Chat panel** - Claude Desktop-style with artifacts sidebar
- **Smooth transitions** - 200-300ms easing on all state changes
- **Spatial audio cues** (optional) - subtle sounds for collaboration presence

### Component Library Approach

```
┌─────────────────────────────────────────────────────────────────────────┐
│  DESIGN SYSTEM                                                          │
│                                                                         │
│  Primitives (Radix UI)     →  Components (Custom)    →  Features       │
│  ├─ Button                     ├─ SmartObjectCard        ├─ Canvas      │
│  ├─ Dialog                     ├─ ChatMessage            ├─ ChatPanel   │
│  ├─ DropdownMenu               ├─ BoardThumbnail         ├─ BoardNav    │
│  ├─ Tooltip                    ├─ EntityBadge            ├─ Workspace   │
│  └─ ...                        └─ ZoneIndicator          └─ ...         │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Environment Setup

```bash
# 1. Create Next.js project
npx create-next-app@latest g0-experience --typescript --tailwind --eslint --app --src-dir=false

# 2. Add Convex
npm install convex
npx convex dev  # Initialize Convex project

# 3. Add UI dependencies
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-tooltip
npm install framer-motion
npm install zustand
npm install zod

# 4. Add canvas library
npm install tldraw

# 5. Git setup
git init
git config user.email "stefan.ebner@braintribe.com"
git config user.name "Stefan Ebner"

# 6. Connect to GitHub
gh repo create g0-experience --private
git remote add origin git@github.com:[org]/g0-experience.git
git push -u origin main

# 7. Connect to Vercel
vercel link
vercel env pull  # Pull environment variables
```

### Environment Variables

```bash
# .env.local (gitignored)
CONVEX_DEPLOYMENT=dev:your-deployment-name
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud

# Vercel will auto-inject these in production
# Add to Vercel dashboard:
# - CONVEX_DEPLOYMENT
# - NEXT_PUBLIC_CONVEX_URL
```

## Sprint Structure

### Phase 1: UX Proof of Concept
**Goal**: Working prototype with mocked data to validate core UX patterns

| Deliverable | Description |
|-------------|-------------|
| **Infinite canvas** | tldraw integration, zoom/pan, dark mode |
| **Zone layout** | Shared / Smart Object / Private zone structure |
| **Basic atomics** | Rectangle, Circle, Text, Image rendering |
| **Smart Object rendering** | WeR Building Blocks with mocked sample data |
| **Board navigation** | Workspace switcher, board list (mocked hierarchy) |
| **Chat UI shell** | Claude Desktop-style panel with artifacts sidebar |
| **Design system** | Colors, typography, component primitives (Radix-based) |

**Mocked Data**:

```
Organization: "Acme Wealth Management"
└── Workspace: "Finance" (Entity: co-CFO)
    └── Board: "Finance Overview"
        │   Smart Object: Finance KPI Dashboard
        │   (Key metrics, trends, alerts)
        │
        ├── Sub-Board: "Controlling"
        │   Smart Object: Cost Center Analysis
        │
        ├── Sub-Board: "Cash"
        │   Smart Object: Cash Flow Overview
        │
        ├── Sub-Board: "HR"
        │   Smart Object: Headcount & Costs
        │
        └── Sub-Board: "Forecast"
            Smart Object: Financial Projections
```

- 5 Smart Object schemas for co-CFO domain
- Sample JSON with realistic financial data
- Board hierarchy demonstrating 1 board = 1 smart object pattern

**Key UX Questions to Validate**:
- How does the three-zone layout feel?
- Is 1 board = 1 smart object intuitive?
- Does Claude Desktop-style chat work for business workflows?
- Is the board-of-boards navigation clear?

---

### Phase 2: Chat & Entity Integration
**Goal**: Connect chat to entities, enable real data flow (still with mocked board structure)

| Deliverable | Description |
|-------------|-------------|
| **Chat message streaming** | Real-time token streaming |
| **Tool discovery** | Query entity for available tools at board load |
| **Tool execution** | Call entity tools, render results as artifacts |
| **Artifact placement** | Drag from artifacts panel to workspace zones |
| **Entity connection** | REST/MCP integration for data push/pull |
| **Real data rendering** | Replace sample data with live entity data |
| **Connection health** | Status indicators, graceful degradation |

---

### Phase 3: Schema & Data Layer
**Goal**: Real schema system with Convex backend

| Deliverable | Description |
|-------------|-------------|
| **Convex setup** | Database schema, real-time subscriptions |
| **Organization/Workspace/Board CRUD** | Full hierarchy with persistence |
| **Schema parser** | Load and validate Smart Object JSON schemas |
| **Atomic assembly engine** | Compose atomics from schema definitions |
| **Data binding** | Bind data to atomic properties dynamically |
| **Sample data on import** | Immediate rendering with placeholder data |
| **Smart ID generation** | Create and return IDs on Smart Object creation |

---

### Phase 4: Collaboration & Production
**Goal**: Multi-user real-time collaboration, production hardening

| Deliverable | Description |
|-------------|-------------|
| **Real-time sync** | Convex subscriptions or YJS for collaborative editing |
| **Presence indicators** | Show who's viewing/editing |
| **Conflict resolution** | Handle concurrent edits gracefully |
| **Performance optimization** | Smooth rendering at 500+ objects |
| **Error boundaries** | Graceful failure handling |
| **Offline support** | Cache last-known state |
| **Authentication** | Clerk integration, workspace permissions |

---

### Phase Summary

```
Phase 1 ─────────► Phase 2 ─────────► Phase 3 ─────────► Phase 4
    │                  │                  │                  │
   UX POC            Chat &           Schema &           Collab &
 (Mocked Data)   Entity Integration   Data Layer        Production
    │                  │                  │                  │
 Validate UX     Connect Entities    Add Persistence     Ship It
```

## Implementation Priorities

### Must Have (P0)
- [ ] Infinite zoomable canvas with zone layout
- [ ] Core atomic objects (Rectangle, Circle, Text, Image, Frame, Edge)
- [ ] Smart Object schema parsing and rendering
- [ ] Organization/Workspace/Board hierarchy
- [ ] Claude Desktop-style chat with artifacts panel
- [ ] Entity tool discovery and execution
- [ ] Real-time data push from entities

### Should Have (P1)
- [ ] Advanced atomics (PieChart, BarChart, NetworkGraph)
- [ ] Real-time collaboration (multi-user)
- [ ] MCP protocol support
- [ ] Offline mode with sync

### Nice to Have (P2)
- [ ] Temporal canvas (timeline, playback)
- [ ] Cross-board relationships
- [ ] Agent workspace/debugging
- [ ] A2A protocol support
- [ ] Presentation mode

## Development Guidelines

### When Building Features
1. Start with the JSON schema - define the data contract first
2. Build the simplest rendering that works
3. Add interactivity incrementally
4. Test with real agent outputs, not mock data

### When Designing UX
1. Canvas is primary, chat is secondary
2. Direct manipulation > menus > chat commands
3. Make AI contributions visually distinct
4. Always show data freshness/source

### When Integrating Agents
1. Assume agents will fail - build graceful degradation
2. Log everything for debugging
3. Rate limit by default
4. Validate all incoming JSON strictly

## File Structure (Proposed)

```
g0-experience/
├── apps/
│   ├── web/                    # React frontend
│   │   ├── src/
│   │   │   ├── canvas/         # Canvas rendering & interaction
│   │   │   ├── chat/           # Chat interface
│   │   │   ├── boards/         # Board management
│   │   │   ├── smart-objects/  # Smart Object components
│   │   │   ├── context/        # G0 Context UI
│   │   │   └── shared/         # Shared components
│   │   └── ...
│   └── api/                    # FastAPI backend
│       ├── routers/
│       ├── services/
│       ├── models/
│       └── agents/             # Agent integration layer
├── packages/
│   ├── schemas/                # Shared JSON schemas (Zod)
│   ├── protocols/              # MCP/A2A adapters
│   └── sync/                   # YJS/Hocuspocus config
├── docs/
│   ├── architecture/
│   ├── smart-objects/
│   └── api/
└── claude.md                   # This file
```

## Key Decisions Log

| Decision | Rationale | Date | Revisit If |
|----------|-----------|------|------------|
| React 18 + TypeScript | Team expertise, ecosystem | Jan 2026 | Performance issues at scale |
| Valtio for state | Simpler than Redux, proxy-based | Jan 2026 | Complex derived state needs |
| YJS for CRDT | Most mature, good Hocuspocus integration | Jan 2026 | P2P needs change |
| Supabase | Fast to start, good auth, real-time built-in | Jan 2026 | Enterprise self-host requirements |
| Google ADK | Tribe.One alignment, good tooling | Jan 2026 | Multi-framework becomes priority |

---

*This document is a living artifact. Update it as the product evolves.*

// Demo content for the hidden demo page

export interface DemoSection {
  id: string;
  title: string;
  description: string;
  features?: string[];
  tryItLink?: string;
  tryItLabel?: string;
  commands?: string[];
  shortcuts?: { key: string; action: string }[];
}

export const demoSections: DemoSection[] = [
  {
    id: "portal",
    title: "Portal Homepage",
    description:
      "The main entry point showing all workspaces at a glance. This is your command center for the entire organization.",
    features: [
      "Workspace cards with live KPI summaries",
      "Organization health score with trend indicators",
      "Activity feed showing recent actions across workspaces",
      "Trending metrics highlighting key changes",
      "Recent boards for quick access",
      "Cross-workspace insights and announcements",
    ],
    tryItLink: "/",
    tryItLabel: "Open Portal",
  },
  {
    id: "navigation",
    title: "Navigation & Workspaces",
    description:
      "The navigation drawer provides access to all workspaces and their boards. Each workspace is owned by an AI entity (co-CFO, co-CHRO, etc.) that shapes the context and capabilities.",
    features: [
      "G0 button in header opens navigation drawer",
      "Organization switcher for multi-org users",
      "Workspace tree with expandable board hierarchy",
      "Sub-board organization (nested boards)",
      "Persistent expand/collapse state",
      "Quick search via Command Palette",
    ],
    shortcuts: [
      { key: "ESC", action: "Close navigation drawer" },
    ],
  },
  {
    id: "dashboards",
    title: "Smart Objects & Dashboards",
    description:
      "Each board displays a Smart Object - an interactive visualization composed of atomic objects (charts, text, shapes). Data flows from the workspace's entity owner.",
    features: [
      "Finance KPI Dashboard - Key financial metrics and trends",
      "HR Dashboard - Organizational charts and people metrics",
      "Recruiting Dashboard - Pipeline and hiring analytics",
      "Customer 360 View - Complete customer profiles",
      "Radial and Grid view modes for different perspectives",
      "Real-time data updates from connected entities",
    ],
    tryItLink: "/sns/finance/finance-overview",
    tryItLabel: "Open Finance Dashboard",
  },
  {
    id: "hr-dashboard",
    title: "HR Dashboard Deep Dive",
    description:
      "The HR Dashboard showcases advanced visualization capabilities with multiple view modes and interactive elements.",
    features: [
      "Radial org chart view - Visual hierarchy in concentric circles",
      "Grid metrics view - KPI tiles with trends",
      "Click any person node to see detailed profile",
      "Department filtering and navigation",
      "Headcount and turnover metrics",
      "View mode toggle in canvas controls",
    ],
    tryItLink: "/sns/hr/hr-overview",
    tryItLabel: "Open HR Dashboard",
  },
  {
    id: "chat",
    title: "Chat Interface",
    description:
      "Each workspace has an AI entity you can converse with. The chat panel (Claude Desktop-style) provides natural language access to workspace data and actions.",
    features: [
      "Blue chat button opens the conversation panel",
      "Entity-aware responses (co-CFO speaks finance, co-CHRO speaks HR)",
      "Predefined questions per workspace for common queries",
      "Artifact generation (reports, summaries)",
      "Context-aware suggestions based on current board",
    ],
    commands: [
      '"Show me Sarah" - Opens person detail overlay',
      '"What\'s the headcount?" - Returns current org size',
      '"Flight risk report" - Generates at-risk employee summary',
      '"Quarterly summary" - Creates financial overview',
    ],
  },
  {
    id: "overlays",
    title: "Overlays & Person Details",
    description:
      "Clicking interactive elements opens detail overlays without leaving the current board. This enables drill-down exploration while maintaining context.",
    features: [
      "Person Detail overlay - Full profile with OCEAN traits",
      "Click person in org chart to open",
      "Chat command can also trigger overlays",
      "ESC key closes any open overlay",
      "Smooth animations for overlay transitions",
    ],
    tryItLink: "/sns/hr/hr-overview",
    tryItLabel: "Try in HR Dashboard",
    shortcuts: [
      { key: "ESC", action: "Close overlay" },
    ],
  },
  {
    id: "canvas",
    title: "Canvas Controls",
    description:
      "The board canvas is an infinite zoomable space. Controls are positioned at the edges for easy access without cluttering the view.",
    features: [
      "Zoom controls (+/-) in bottom-left",
      "View mode toggle (Radial/Grid) for supported dashboards",
      "Presentation mode (expand icon) for full-screen focus",
      "Shared workspace zone (above) - Team-visible content",
      "Private workspace zone (below) - Personal notes",
    ],
  },
  {
    id: "command-palette",
    title: "Command Palette",
    description:
      "Quick keyboard-driven navigation and actions. Press ⌘K (or Ctrl+K) to open from anywhere in the app.",
    features: [
      "Fuzzy search across boards and entities",
      "Quick navigation to any workspace or board",
      "Action shortcuts for common operations",
      "Recent items for quick access",
      "Keyboard-first interaction model",
    ],
    shortcuts: [
      { key: "⌘K / Ctrl+K", action: "Open command palette" },
      { key: "ESC", action: "Close command palette" },
      { key: "↑/↓", action: "Navigate results" },
      { key: "Enter", action: "Select item" },
    ],
  },
  {
    id: "shortcuts",
    title: "All Keyboard Shortcuts",
    description:
      "G0 Experience is designed for keyboard-first users. These shortcuts work globally across the application.",
    shortcuts: [
      { key: "⌘K / Ctrl+K", action: "Open command palette" },
      { key: "ESC", action: "Close any overlay, drawer, or panel" },
      { key: "Ctrl+Shift+D", action: "Open this demo page" },
    ],
  },
];

export const demoIntro = {
  title: "G0 Experience Demo",
  subtitle: "The Universal Canvas for AI Entities",
  description:
    "Welcome to G0 Experience - where AI entities become visible, interactive, and collaborative. This demo guide walks you through all major features of the application.",
};

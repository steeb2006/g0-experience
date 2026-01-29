// Smart Object Container (reusable wrapper)
export { SmartObjectContainer } from "./SmartObjectContainer";

// Shared layout components
export { RadialLayout, calculateRadialOffsets } from "./shared";
export type { Position, RadialPositionConfig } from "./shared";

// Legacy hardcoded dashboards
export { FinanceKPIDashboard } from "./FinanceKPIDashboard";
export { HRDashboard } from "./HRDashboard";
export { ForecastDashboard } from "./ForecastDashboard";
export { LaunchCampaignDashboard, CustomersDashboard, Customer360View } from "./SalesDashboard";
export { OrgOverviewBoard } from "./OrgOverviewBoard";
export { RecruitingDashboard } from "./RecruitingDashboard";
export { PersonDetail } from "./PersonDetail";
export { CEODashboard } from "./CEODashboard";

// Schema-driven Smart Object system
export { SmartObjectRenderer, SmartObjectFromSchema } from "./SmartObjectRenderer";
export { AtomicRenderer } from "./AtomicRenderer";
export { AtomicGallery } from "./AtomicGallery";

// Atomic components
export {
  Text,
  Sparkline,
  Frame,
  Rectangle,
  Circle,
  Avatar,
  Badge,
  Line,
  Image,
  Icon,
  BarChart,
  DonutChart,
  PieChart,
  LineChart,
  ProgressBar,
  Edge,
  Arrow,
  Tooltip,
  RadarChart,
} from "./atomics";

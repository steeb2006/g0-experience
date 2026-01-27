export * from "./organization";
export * from "./finance-dashboard";
export * from "./chat-artifacts";
export * from "./hr-dashboard";
export * from "./hr-chat";
export * from "./recruiting-dashboard";
export * from "./forecast-dashboard";
export * from "./entity-tools";
export {
  launchCampaignData,
  customersData,
  salesSampleChatMessages,
  salesSampleArtifacts,
  salesEntityTools,
  formatSalesCurrency,
  formatSalesPercentage,
  getHealthColor,
  getStatusColor as getSalesStatusColor,
  type CampaignMetric,
  type CampaignPhase,
  type CampaignChannel,
  type LaunchCampaignData,
  type CustomerSegment,
  type CustomerAccount,
  type CustomerMetric,
  type CustomersData,
} from "./sales-dashboard";
export {
  markSchneiderData,
  fredKrugerData,
  allCustomers,
  getCustomerByName,
  formatCustomerARR,
  type Customer360Data,
  type PeerConnection,
} from "./customer-360";
export {
  portalAnnouncements,
  activityEvents,
  trendingMetrics,
  workspaceSummaries,
  notifications,
  crossWorkspaceInsights,
  quickActions,
  getOrgHealthScore,
  getUnreadNotificationsCount,
  formatTrendingChange,
  getContextualReminder,
  getGreeting,
  formatCurrentDate,
  type PortalAnnouncement,
  type ActivityEvent,
  type TrendingMetric,
  type WorkspaceKPI,
  type WorkspaceSummary,
  type Notification,
  type CrossWorkspaceInsight,
  type QuickAction,
} from "./portal";

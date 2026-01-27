// ============================================================================
// CUSTOMER 360 VIEW DATA
// ============================================================================

export interface PeerConnection {
  id: string;
  name: string;
  title: string;
  company: string;
  relationship: string; // "Met at conference", "Board member", etc.
  avatar?: string;
}

export interface Customer360Data {
  id: string;
  name: string;
  title: string;
  company: string;
  avatar: string;
  arr: number;
  industry: string;
  hobbies: string[];
  funFacts: string[];
  lastTouch: string;
  networkSize: number;
  peerConnections: PeerConnection[];
  healthScore: number;
  nps: number;
}

// Default customer on load
export const markSchneiderData: Customer360Data = {
  id: "customer_mark",
  name: "Mark Schneider",
  title: "CEO",
  company: "TechCorp Global",
  avatar: "/avatars/mark.png",
  arr: 2100000,
  industry: "Enterprise SaaS",
  hobbies: ["Golf", "Sailing", "Wine collecting"],
  funFacts: [
    "Speaks 4 languages fluently",
    "Former Olympic rowing alternate",
    "Angel investor in 12 startups",
  ],
  lastTouch: "3 days ago",
  networkSize: 12,
  peerConnections: [
    {
      id: "peer_1",
      name: "Sarah Chen",
      title: "CFO",
      company: "Acme Corp",
      relationship: "Met at Davos 2024",
    },
    {
      id: "peer_2",
      name: "John Park",
      title: "CTO",
      company: "DataFlow Inc",
      relationship: "Stanford MBA classmate",
    },
    {
      id: "peer_3",
      name: "Lisa Wang",
      title: "CEO",
      company: "CloudNine",
      relationship: "Board member together",
    },
  ],
  healthScore: 92,
  nps: 72,
};

// Search result customer
export const fredKrugerData: Customer360Data = {
  id: "customer_fred",
  name: "Fred Kruger",
  title: "VP Engineering",
  company: "Nightmare Labs",
  avatar: "/avatars/fred.png",
  arr: 450000,
  industry: "Gaming & Entertainment",
  hobbies: ["Horror movies", "Costume design", "Night hiking"],
  funFacts: [
    "Holds 3 patents in haptic feedback",
    "Runs a popular horror podcast",
    "Competed in Iron Chef amateur",
  ],
  lastTouch: "2 weeks ago",
  networkSize: 7,
  peerConnections: [
    {
      id: "peer_4",
      name: "Jason Vorhees",
      title: "CTO",
      company: "Camp Crystal",
      relationship: "Horror convention speaker",
    },
    {
      id: "peer_5",
      name: "Michael Myers",
      title: "CEO",
      company: "Haddonfield Tech",
      relationship: "Y Combinator batch-mate",
    },
  ],
  healthScore: 68,
  nps: 45,
};

// All customers for lookup
export const allCustomers: Customer360Data[] = [
  markSchneiderData,
  fredKrugerData,
];

// Lookup function
export function getCustomerByName(name: string): Customer360Data {
  const normalized = name.toLowerCase();
  if (normalized.includes("fred") || normalized.includes("kruger")) {
    return fredKrugerData;
  }
  if (normalized.includes("mark") || normalized.includes("schneider")) {
    return markSchneiderData;
  }
  // Default to Mark Schneider
  return markSchneiderData;
}

// Format ARR for display
export function formatCustomerARR(value: number): string {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`;
  }
  return `$${value.toFixed(0)}`;
}

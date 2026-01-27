export interface PersonDetailData {
  id: string;
  name: string;
  avatar?: string;
  title: string;
  department: string;
  email: string;
  phone?: string;

  // Metrics
  engagement: number; // 0-100
  teamSize: number;
  tenure: string; // "2y 3m"
  directReports: string[]; // IDs of direct reports

  // Extended info
  skills: string[];
  certifications?: string[];
  location?: string;

  // Activity
  recentActivity: {
    id: string;
    type: "meeting" | "review" | "training" | "project";
    description: string;
    date: string;
  }[];

  // Notes (from manager/HR)
  notes?: string;
}

// Extended data for HR team members
export const personDetailData: Record<string, PersonDetailData> = {
  emp_1: {
    id: "emp_1",
    name: "Sarah Chen",
    title: "CEO",
    department: "Executive",
    email: "sarah.chen@company.com",
    phone: "+1 (555) 100-0001",
    engagement: 94,
    teamSize: 156,
    tenure: "5y 2m",
    directReports: ["emp_2", "emp_3", "emp_4", "emp_5", "emp_6", "emp_7"],
    skills: ["Leadership", "Strategy", "M&A", "Public Speaking", "Board Relations"],
    certifications: ["Harvard MBA", "CPA"],
    location: "San Francisco, CA",
    recentActivity: [
      {
        id: "act_1",
        type: "meeting",
        description: "Q1 Board Meeting - Presented growth strategy",
        date: "2025-01-20",
      },
      {
        id: "act_2",
        type: "project",
        description: "Launched Series C fundraising process",
        date: "2025-01-15",
      },
      {
        id: "act_3",
        type: "meeting",
        description: "All-hands meeting - Company vision 2025",
        date: "2025-01-10",
      },
    ],
    notes: "Outstanding leader. Driving company through rapid growth phase.",
  },
  emp_2: {
    id: "emp_2",
    name: "Mike Ross",
    title: "VP Engineering",
    department: "Engineering",
    email: "mike.ross@company.com",
    phone: "+1 (555) 100-0002",
    engagement: 92,
    teamSize: 45,
    tenure: "3y 8m",
    directReports: ["eng_1", "eng_2", "eng_3", "eng_4"],
    skills: ["System Architecture", "Team Leadership", "Agile", "Cloud Infrastructure", "React"],
    certifications: ["AWS Solutions Architect Pro", "Certified Scrum Master"],
    location: "San Francisco, CA",
    recentActivity: [
      {
        id: "act_4",
        type: "project",
        description: "Completed platform migration to AWS",
        date: "2025-01-18",
      },
      {
        id: "act_5",
        type: "review",
        description: "Conducted Q4 performance reviews",
        date: "2025-01-12",
      },
      {
        id: "act_6",
        type: "training",
        description: "Led architecture design workshop",
        date: "2025-01-08",
      },
    ],
    notes: "Strong technical leader. Team morale is high under his guidance.",
  },
  emp_3: {
    id: "emp_3",
    name: "Lisa Park",
    title: "VP People",
    department: "HR",
    email: "lisa.park@company.com",
    phone: "+1 (555) 100-0003",
    engagement: 95,
    teamSize: 8,
    tenure: "2y 4m",
    directReports: ["hr_1", "hr_2"],
    skills: ["HR Strategy", "Talent Acquisition", "Employee Relations", "Compensation", "Culture"],
    certifications: ["SHRM-SCP", "PHR"],
    location: "San Francisco, CA",
    recentActivity: [
      {
        id: "act_7",
        type: "project",
        description: "Launched new employee engagement program",
        date: "2025-01-19",
      },
      {
        id: "act_8",
        type: "training",
        description: "Manager effectiveness training rollout",
        date: "2025-01-14",
      },
      {
        id: "act_9",
        type: "review",
        description: "Completed compensation benchmarking analysis",
        date: "2025-01-09",
      },
    ],
    notes: "Exceptional at building culture. Key retention driver.",
  },
  emp_4: {
    id: "emp_4",
    name: "John Davis",
    title: "VP Finance",
    department: "Finance",
    email: "john.davis@company.com",
    phone: "+1 (555) 100-0004",
    engagement: 88,
    teamSize: 12,
    tenure: "4y 1m",
    directReports: ["fin_1", "fin_2", "fin_3"],
    skills: ["Financial Planning", "M&A", "Investor Relations", "FP&A", "Treasury"],
    certifications: ["CPA", "CFA"],
    location: "San Francisco, CA",
    recentActivity: [
      {
        id: "act_10",
        type: "project",
        description: "Completed annual budget planning",
        date: "2025-01-17",
      },
      {
        id: "act_11",
        type: "meeting",
        description: "Series C investor presentations",
        date: "2025-01-13",
      },
      {
        id: "act_12",
        type: "review",
        description: "Q4 financial close completed",
        date: "2025-01-07",
      },
    ],
    notes: "Rock-solid financial leadership. Board trusts his projections.",
  },
  emp_5: {
    id: "emp_5",
    name: "Emma Wilson",
    title: "VP Sales",
    department: "Sales",
    email: "emma.wilson@company.com",
    phone: "+1 (555) 100-0005",
    engagement: 78,
    teamSize: 32,
    tenure: "1y 9m",
    directReports: ["sales_1", "sales_2", "sales_3", "sales_4"],
    skills: ["Enterprise Sales", "Sales Strategy", "Negotiations", "CRM", "Team Building"],
    certifications: ["Sandler Sales Certification"],
    location: "New York, NY",
    recentActivity: [
      {
        id: "act_13",
        type: "project",
        description: "Closed TechCorp enterprise deal ($850K)",
        date: "2025-01-16",
      },
      {
        id: "act_14",
        type: "meeting",
        description: "Sales kickoff planning meeting",
        date: "2025-01-11",
      },
      {
        id: "act_15",
        type: "training",
        description: "New product training for sales team",
        date: "2025-01-06",
      },
    ],
    notes: "Strong closer. Engagement dip due to stretch targets - monitoring.",
  },
  emp_6: {
    id: "emp_6",
    name: "Alex Turner",
    title: "VP Operations",
    department: "Operations",
    email: "alex.turner@company.com",
    phone: "+1 (555) 100-0006",
    engagement: 81,
    teamSize: 28,
    tenure: "2y 11m",
    directReports: ["ops_1", "ops_2", "ops_3"],
    skills: ["Operations Strategy", "Process Optimization", "Supply Chain", "Vendor Management", "Analytics"],
    certifications: ["Six Sigma Black Belt", "PMP"],
    location: "Austin, TX",
    recentActivity: [
      {
        id: "act_16",
        type: "project",
        description: "Implemented new ticketing system",
        date: "2025-01-15",
      },
      {
        id: "act_17",
        type: "review",
        description: "Vendor contract renegotiations",
        date: "2025-01-10",
      },
      {
        id: "act_18",
        type: "meeting",
        description: "Ops efficiency review with CEO",
        date: "2025-01-05",
      },
    ],
    notes: "Solid operator. Delivering efficiency gains consistently.",
  },
  emp_7: {
    id: "emp_7",
    name: "Rachel Green",
    title: "VP Marketing",
    department: "Marketing",
    email: "rachel.green@company.com",
    phone: "+1 (555) 100-0007",
    engagement: 85,
    teamSize: 15,
    tenure: "1y 6m",
    directReports: ["mkt_1", "mkt_2"],
    skills: ["Brand Strategy", "Digital Marketing", "Content", "Product Marketing", "Analytics"],
    certifications: ["Google Analytics", "HubSpot Inbound"],
    location: "San Francisco, CA",
    recentActivity: [
      {
        id: "act_19",
        type: "project",
        description: "Launched spring product campaign",
        date: "2025-01-20",
      },
      {
        id: "act_20",
        type: "training",
        description: "AI marketing tools workshop",
        date: "2025-01-12",
      },
      {
        id: "act_21",
        type: "meeting",
        description: "Brand refresh kickoff",
        date: "2025-01-08",
      },
    ],
    notes: "Creative leader. Campaign performance exceeding targets.",
  },
};

// Helper function to get person detail by employee ID
export function getPersonDetailById(id: string): PersonDetailData | null {
  return personDetailData[id] || null;
}

// Helper function to extract name from a message (removes common phrases)
function extractNameFromMessage(message: string): string {
  const lowerMessage = message.toLowerCase();
  // Remove common command prefixes
  const prefixes = [
    "show me",
    "show",
    "open",
    "tell me about",
    "find",
    "search for",
    "look up",
    "who is",
    "profile of",
    "profile for",
    "'s profile",
    "details for",
    "details of",
  ];

  let cleanedName = lowerMessage;
  for (const prefix of prefixes) {
    cleanedName = cleanedName.replace(prefix, "");
  }

  return cleanedName.trim();
}

// Helper function to get person detail by name (case-insensitive partial match)
// Handles full messages like "show me Sarah Chen" or just "Sarah" or "Mike"
export function getPersonDetailByName(input: string): PersonDetailData | null {
  const searchName = extractNameFromMessage(input);

  if (!searchName) return null;

  // Try to find a match
  const entry = Object.values(personDetailData).find((person) => {
    const personNameLower = person.name.toLowerCase();
    const personFirstName = personNameLower.split(" ")[0];
    const personLastName = personNameLower.split(" ")[1] || "";

    // Check if the search matches:
    // 1. Full name contains search term
    // 2. First name matches
    // 3. Last name matches
    // 4. Search term contains the person's name
    return (
      personNameLower.includes(searchName) ||
      personFirstName === searchName ||
      personLastName === searchName ||
      searchName.includes(personFirstName) ||
      searchName.includes(personNameLower)
    );
  });

  return entry || null;
}

// Get all person details as an array
export function getAllPersonDetails(): PersonDetailData[] {
  return Object.values(personDetailData);
}

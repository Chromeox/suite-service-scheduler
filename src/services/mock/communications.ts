
import { ChatRoom } from "@/services/chat";

// Define the Communication type locally since it's not exported from CommunicationsList
interface Communication {
  id: string;
  type: "announcement" | "team" | "direct";
  sender: {
    id: string;
    name: string;
    role?: string;
    avatar?: string;
  };
  recipients: {
    id: string;
    name: string;
    role?: string;
  }[];
  subject: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  isPriority: boolean;
}

export const mockCommunications: Communication[] = [
  {
    id: "1",
    type: "announcement",
    sender: {
      id: "1",
      name: "Venue Manager",
      role: "Manager",
    },
    recipients: [
      { id: "all", name: "All Staff", role: "Various" }
    ],
    subject: "Event Day Protocols",
    message: "Please remember to follow all event day protocols. Staff should arrive 2 hours before the event starts.\n\nAll suites must be serviced before VIPs arrive at 5:30 PM.",
    timestamp: new Date(new Date().getTime() - 60 * 60 * 1000).toISOString(), // 1 hour ago
    isRead: false,
    isPriority: true,
  },
  {
    id: "2",
    type: "team",
    sender: {
      id: "2",
      name: "Floor Supervisor",
      role: "Supervisor",
    },
    recipients: [
      { id: "3", name: "Suite Attendants", role: "Attendant" },
      { id: "4", name: "Food Runners", role: "Runner" }
    ],
    subject: "VIP in Suite 201",
    message: "Suite 201 has a VIP client today. Please prioritize all service requests from this suite and notify me of any issues immediately.",
    timestamp: new Date(new Date().getTime() - 30 * 60 * 1000).toISOString(), // 30 mins ago
    isRead: true,
    isPriority: true,
  },
  {
    id: "3",
    type: "direct",
    sender: {
      id: "5",
      name: "John Smith",
      role: "Runner",
      avatar: "https://i.pravatar.cc/150?img=59", 
    },
    recipients: [
      { id: "6", name: "Current User", role: "Attendant" }
    ],
    subject: "Order for Suite 304",
    message: "I'm bringing up the food order for Suite 304 now. Should arrive in about 5 minutes.",
    timestamp: new Date(new Date().getTime() - 5 * 60 * 1000).toISOString(), // 5 mins ago
    isRead: false,
    isPriority: false,
  },
  {
    id: "4",
    type: "direct",
    sender: {
      id: "7",
      name: "Sarah Johnson",
      role: "Attendant",
      avatar: "https://i.pravatar.cc/150?img=47",
    },
    recipients: [
      { id: "6", name: "Current User", role: "Attendant" }
    ],
    subject: "Need assistance",
    message: "Can you help me with Suite 512? They have a large group and I need some support with drinks service.",
    timestamp: new Date(new Date().getTime() - 15 * 60 * 1000).toISOString(), // 15 mins ago
    isRead: true,
    isPriority: false,
  },
  {
    id: "5",
    type: "team",
    sender: {
      id: "8",
      name: "Kitchen Manager",
      role: "Kitchen Staff",
    },
    recipients: [
      { id: "9", name: "Service Team", role: "Various" }
    ],
    subject: "Menu change tonight",
    message: "We're out of the salmon entree. Please inform guests that we're substituting with the herb-crusted halibut at no additional charge.",
    timestamp: new Date(new Date().getTime() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
    isRead: true,
    isPriority: false,
  },
];

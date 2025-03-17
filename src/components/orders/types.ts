
// Define common types for the orders components
export interface OrderItem {
  name: string;
  quantity: number;
  status: string;
  price?: number;
}

export interface Order {
  id: string;
  suiteId: string;
  suiteName: string;
  location: string;
  items: OrderItem[];
  status: string;
  createdAt: string;
  deliveryTime: string;
  isPreOrder: boolean;
}

// Adding the missing OrderStatus type
export type OrderStatus = "pending" | "in-progress" | "ready" | "completed";

export interface OrderFiltersProps {
  role?: string;
  selectedFloor: string;
  setSelectedFloor: (floor: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  setShowGameDayOrderDialog: (show: boolean) => void;
}

export interface OrdersListProps {
  orders: Order[];
  role?: string;
  handleStatusChange: (orderId: string, newStatus: OrderStatus) => void;
  setShowGameDayOrderDialog?: (show: boolean) => void;
}

export interface OrderFormProps {
  showGameDayOrderDialog: boolean;
  setShowGameDayOrderDialog: (show: boolean) => void;
  handleAddGameDayOrder: () => void;
  gameDayOrder: {
    suiteId: string;
    items: { name: string; quantity: number }[];
  };
  setGameDayOrder: React.Dispatch<
    React.SetStateAction<{
      suiteId: string;
      items: { name: string; quantity: number }[];
    }>
  >;
}

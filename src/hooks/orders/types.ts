
import { Order, OrderStatus } from "@/components/orders/types";

export interface OrderState {
  orders: Order[];
  filteredOrders: Order[];
  isLoading: boolean;
  error: Error | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  showGameDayOrderDialog: boolean;
  setShowGameDayOrderDialog: (show: boolean) => void;
  selectedFloor: string;
  setSelectedFloor: (floor: string) => void;
  gameDayOrder: {
    suiteId: string;
    items: { name: string; quantity: number; }[];
  };
  setGameDayOrder: (order: {
    suiteId: string;
    items: { name: string; quantity: number; }[];
  }) => void;
  handleStatusChange: (orderId: string, newStatus: OrderStatus) => void;
  handleAddGameDayOrder: () => void;
  isRealTimeEnabled?: boolean;
  setRealTimeEnabled?: (enabled: boolean) => void;
}

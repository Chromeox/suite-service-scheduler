
import { Order } from "@/components/orders/types";

export interface OrderState {
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
    items: { name: string; quantity: number }[];
  };
  setGameDayOrder: React.Dispatch<
    React.SetStateAction<{
      suiteId: string;
      items: { name: string; quantity: number }[];
    }>
  >;
  orders: Order[];
  isLoading: boolean;
  error: Error | null;
  handleStatusChange: (orderId: string, newStatus: string) => void;
  handleAddGameDayOrder: () => void;
  filteredOrders: Order[];
}

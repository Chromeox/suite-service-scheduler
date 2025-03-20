
import { Order } from "@/components/orders/types";

// Function to filter orders based on active tab, search query, and floor
export const filterOrders = (
  orders: Order[], 
  activeTab: string, 
  searchQuery: string, 
  selectedFloor: string
): Order[] => {
  return orders.filter(order => {
    const matchesTab = 
      activeTab === "all" || 
      (activeTab === "pre-orders" && order.isPreOrder) ||
      (activeTab === "game-day" && !order.isPreOrder);
    
    const matchesSearch = 
      order.suiteId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.suiteName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    
    const matchesFloor = 
      selectedFloor === "all" || 
      (selectedFloor === "200" && order.suiteId.startsWith("2")) ||
      (selectedFloor === "500" && order.suiteId.startsWith("5"));
    
    return matchesTab && matchesSearch && matchesFloor;
  });
};

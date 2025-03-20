
import { Order, OrderStatus } from "@/components/orders/types";

// Cache key constants
const ORDERS_CACHE_KEY = "suitesync_orders_cache";
const ORDERS_CACHE_TIMESTAMP = "suitesync_orders_timestamp";
const PENDING_ACTIONS_KEY = "suitesync_pending_actions";

// Cache expiration time (24 hours in milliseconds)
const CACHE_EXPIRATION = 24 * 60 * 60 * 1000;

// Types for pending actions
type PendingAction = {
  type: "status_change";
  orderId: string;
  newStatus: OrderStatus;
  timestamp: number;
} | {
  type: "new_order";
  order: Order;
  timestamp: number;
};

export const useOfflineCache = () => {
  // Save orders to local storage
  const cacheOrders = (orders: Order[]) => {
    try {
      localStorage.setItem(ORDERS_CACHE_KEY, JSON.stringify(orders));
      localStorage.setItem(ORDERS_CACHE_TIMESTAMP, Date.now().toString());
    } catch (error) {
      console.error("Error caching orders:", error);
    }
  };

  // Get cached orders
  const getCachedOrders = (): { orders: Order[] | null; isStale: boolean } => {
    try {
      const cachedOrdersJson = localStorage.getItem(ORDERS_CACHE_KEY);
      const cachedTimestamp = localStorage.getItem(ORDERS_CACHE_TIMESTAMP);
      
      if (!cachedOrdersJson || !cachedTimestamp) {
        return { orders: null, isStale: true };
      }
      
      const cachedOrders = JSON.parse(cachedOrdersJson) as Order[];
      const timestamp = parseInt(cachedTimestamp, 10);
      const now = Date.now();
      
      // Check if cache is stale (older than expiration time)
      const isStale = now - timestamp > CACHE_EXPIRATION;
      
      return { orders: cachedOrders, isStale };
    } catch (error) {
      console.error("Error retrieving cached orders:", error);
      return { orders: null, isStale: true };
    }
  };

  // Add pending action to queue when offline
  const addPendingAction = (action: PendingAction) => {
    try {
      const pendingActionsJson = localStorage.getItem(PENDING_ACTIONS_KEY);
      const pendingActions: PendingAction[] = pendingActionsJson 
        ? JSON.parse(pendingActionsJson) 
        : [];
      
      pendingActions.push(action);
      localStorage.setItem(PENDING_ACTIONS_KEY, JSON.stringify(pendingActions));
    } catch (error) {
      console.error("Error adding pending action:", error);
    }
  };

  // Get pending actions for sync
  const getPendingActions = (): PendingAction[] => {
    try {
      const pendingActionsJson = localStorage.getItem(PENDING_ACTIONS_KEY);
      return pendingActionsJson ? JSON.parse(pendingActionsJson) : [];
    } catch (error) {
      console.error("Error retrieving pending actions:", error);
      return [];
    }
  };

  // Clear pending actions after sync
  const clearPendingActions = () => {
    localStorage.removeItem(PENDING_ACTIONS_KEY);
  };

  // Update cached order status
  const updateCachedOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    const { orders } = getCachedOrders();
    
    if (!orders) return;
    
    const updatedOrders = orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    
    cacheOrders(updatedOrders);
  };

  return {
    cacheOrders,
    getCachedOrders,
    addPendingAction,
    getPendingActions,
    clearPendingActions,
    updateCachedOrderStatus
  };
};

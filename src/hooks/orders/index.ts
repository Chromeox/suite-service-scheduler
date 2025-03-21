
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Order } from "@/components/orders/types";
import { OrderState } from "./types";
import { useOrderState } from "./useOrderState";
import { useOrdersQuery } from "./useOrdersQuery";
import { filterOrders } from "./filterOrders";
import { useOrderMutations } from "./useMutations";

export function useOrders(role?: string): OrderState {
  // Initialize state
  const state = useOrderState();
  
  // Fetch orders with React Query
  const { 
    data: orders = [], 
    isLoading, 
    error 
  } = useOrdersQuery(role);

  // Reset order form function
  const resetOrderForm = () => {
    // Create default delivery time (2:00 PM today)
    const createDefaultDeliveryTime = () => {
      const today = new Date();
      today.setHours(14, 0, 0, 0); // 2:00 PM
      return today.toISOString();
    };

    state.setGameDayOrder({
      suiteId: "",
      items: [{ name: "", quantity: 1 }],
      deliveryTime: createDefaultDeliveryTime()
    });
  };

  // Close dialog function
  const closeDialog = () => {
    state.setShowGameDayOrderDialog(false);
  };

  // Create mutations
  const { updateOrderMutation, addOrderMutation } = useOrderMutations(
    resetOrderForm,
    closeDialog
  );

  const handleStatusChange = (orderId: string, newStatus: string) => {
    updateOrderMutation.mutate({ orderId, newStatus });
    
    // Show toast notification
    toast({
      title: "Order Updated",
      description: `Order ${orderId} status changed to ${newStatus}`,
    });
  };

  const handleAddGameDayOrder = () => {
    // Validate input
    if (!state.gameDayOrder.suiteId || state.gameDayOrder.items.some(item => !item.name)) {
      toast({
        title: "Invalid Input",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // Add the order using the mutation
    addOrderMutation.mutate({
      suiteId: state.gameDayOrder.suiteId,
      items: state.gameDayOrder.items,
      isPreOrder: false,
      deliveryTime: state.gameDayOrder.deliveryTime
    });
  };

  // Filter orders based on tab, search, and floor
  const filteredOrders = filterOrders(
    orders, 
    state.activeTab, 
    state.searchQuery, 
    state.selectedFloor
  );

  return {
    ...state,
    orders,
    isLoading,
    error: error as Error | null,
    handleStatusChange,
    handleAddGameDayOrder,
    filteredOrders
  };
}

// Re-export types
export type { OrderState } from './types';

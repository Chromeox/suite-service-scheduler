
import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { OrderState } from "@/hooks/orders/types";
import DesktopOrderTable from "./list/DesktopOrderTable";
import EmptyOrders from "./list/EmptyOrders";
import VirtualizedOrdersList from "./list/VirtualizedOrdersList";
import { formatDeliveryTime } from "./utils/suiteUtils";
import { useState } from "react";
import { useNetworkStatus } from "@/hooks/use-network";

interface OrdersContentProps {
  orderState: OrderState;
  role?: string;
}

const OrdersContent = ({ orderState, role }: OrdersContentProps) => {
  const { filteredOrders, isLoading, error, handleStatusChange, setShowGameDayOrderDialog } = orderState;
  const isMobile = useIsMobile();
  const { isOnline } = useNetworkStatus();
  
  // Add sort state for the desktop table
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>('asc');
  
  // Add toggle function for sorting
  const toggleSort = () => {
    if (sortDirection === 'asc') {
      setSortDirection('desc');
    } else if (sortDirection === 'desc') {
      setSortDirection(null);
    } else {
      setSortDirection('asc');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-pulse text-muted-foreground">Loading orders...</div>
      </div>
    );
  }

  if (error && isOnline) {
    return (
      <div className="text-destructive p-4 border border-destructive rounded-md">
        Error loading orders: {error.message}
      </div>
    );
  }

  if (error && !isOnline) {
    return (
      <div className="p-4 border border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-700 rounded-md">
        <h3 className="font-medium">You're currently offline</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Showing cached orders. Some features may be limited until you reconnect.
        </p>
      </div>
    );
  }

  if (filteredOrders.length === 0) {
    return <EmptyOrders />;
  }

  return (
    <div className="pb-3">
      {!isOnline && (
        <div className="mb-3 p-2 text-xs border rounded-md bg-background border-yellow-400 text-yellow-700 dark:text-yellow-400">
          Working in offline mode. Changes will sync when online.
        </div>
      )}
      
      {isMobile ? (
        <VirtualizedOrdersList
          orders={filteredOrders}
          role={role}
          handleStatusChange={handleStatusChange}
          setShowGameDayOrderDialog={setShowGameDayOrderDialog}
        />
      ) : (
        <DesktopOrderTable
          orders={filteredOrders}
          role={role}
          handleStatusChange={handleStatusChange}
          setShowGameDayOrderDialog={setShowGameDayOrderDialog}
          sortDirection={sortDirection}
          toggleSort={toggleSort}
          formatDeliveryTime={formatDeliveryTime}
        />
      )}
    </div>
  );
};

export default OrdersContent;

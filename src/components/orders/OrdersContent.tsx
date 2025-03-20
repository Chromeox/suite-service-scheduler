
import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { OrderState } from "@/hooks/orders/types";
import DesktopOrderTable from "./list/DesktopOrderTable";
import EmptyOrders from "./list/EmptyOrders";
import VirtualizedOrdersList from "./list/VirtualizedOrdersList";

interface OrdersContentProps {
  orderState: OrderState;
  role?: string;
}

const OrdersContent = ({ orderState, role }: OrdersContentProps) => {
  const { filteredOrders, isLoading, error, handleStatusChange, setShowGameDayOrderDialog } = orderState;
  const isMobile = useIsMobile();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-pulse text-muted-foreground">Loading orders...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-destructive p-4 border border-destructive rounded-md">
        Error loading orders: {error.message}
      </div>
    );
  }

  if (filteredOrders.length === 0) {
    return <EmptyOrders />;
  }

  return (
    <div className="pb-3">
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
        />
      )}
    </div>
  );
};

export default OrdersContent;

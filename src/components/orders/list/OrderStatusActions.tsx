
import React from "react";
import { OrderStatus } from "@/components/orders/types";
import OrderStatusSelector from "./OrderStatusSelector";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface OrderStatusActionsProps {
  orderId: string;
  status: OrderStatus;
  role?: string;
  handleStatusChange: (orderId: string, newStatus: string) => void;
  setShowGameDayOrderDialog?: (show: boolean) => void;
}

const OrderStatusActions = ({
  orderId,
  status,
  role,
  handleStatusChange,
}: OrderStatusActionsProps) => {
  const isMobile = useIsMobile();
  
  // Only show action buttons for attendants and runners, not for supervisors
  if (role === "supervisor") {
    // Supervisors can see and edit status but no action buttons
    return (
      <OrderStatusSelector 
        status={status} 
        onChange={(newStatus) => handleStatusChange(orderId, newStatus)}
      />
    );
  }

  // For attendants, show only the status selector
  if (role === "attendant") {
    return (
      <OrderStatusSelector 
        status={status} 
        onChange={(newStatus) => handleStatusChange(orderId, newStatus)}
      />
    );
  }

  // For runners, show action buttons based on status and also status selector
  return (
    <div className="flex flex-col space-y-2">
      <OrderStatusSelector 
        status={status} 
        onChange={(newStatus) => handleStatusChange(orderId, newStatus)}
      />
      {status === "pending" && (
        <Button
          variant="outline"
          size={isMobile ? "default" : "sm"} 
          onClick={() => handleStatusChange(orderId, "in-progress")}
          className={isMobile ? "min-h-[44px] py-3" : ""}
        >
          Start Order
        </Button>
      )}
      {status === "in-progress" && (
        <Button
          variant="outline"
          size={isMobile ? "default" : "sm"}
          onClick={() => handleStatusChange(orderId, "ready")}
          className={isMobile ? "min-h-[44px] py-3" : ""}
        >
          Mark Ready
        </Button>
      )}
    </div>
  );
};

export default OrderStatusActions;


import React from "react";
import { Button } from "@/components/ui/button";
import { OrderStatus } from "@/components/orders/types";
import OrderStatusSelector from "./OrderStatusSelector";

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
  setShowGameDayOrderDialog,
}: OrderStatusActionsProps) => {
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

  // For attendants, show "Add Gameday" button and status selector
  if (role === "attendant") {
    return (
      <div className="flex flex-col space-y-2">
        <OrderStatusSelector 
          status={status} 
          onChange={(newStatus) => handleStatusChange(orderId, newStatus)}
        />
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowGameDayOrderDialog && setShowGameDayOrderDialog(true)}
        >
          Add Gameday
        </Button>
      </div>
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
          size="sm"
          onClick={() => handleStatusChange(orderId, "in-progress")}
        >
          Start Order
        </Button>
      )}
      {status === "in-progress" && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleStatusChange(orderId, "ready")}
        >
          Mark Ready
        </Button>
      )}
    </div>
  );
};

export default OrderStatusActions;

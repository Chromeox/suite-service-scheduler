
import React from "react";
import { Button } from "@/components/ui/button";
import { OrderStatus } from "@/components/orders/types";

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
    return null;
  }

  // For attendants, show "Add Gameday" instead of "Mark as Completed"
  if (role === "attendant") {
    // Don't show actions for completed orders
    if (status === "completed") {
      return null;
    }

    return (
      <Button
        variant="default"
        size="sm"
        onClick={() => setShowGameDayOrderDialog && setShowGameDayOrderDialog(true)}
      >
        Add Gameday
      </Button>
    );
  }

  // For runners and default case
  switch (status) {
    case "pending":
      return (
        <Button
          variant="default"
          size="sm"
          onClick={() => handleStatusChange(orderId, "in-progress")}
        >
          Start Order
        </Button>
      );
    case "in-progress":
      return (
        <Button
          variant="default"
          size="sm"
          onClick={() => handleStatusChange(orderId, "ready")}
        >
          Mark Ready
        </Button>
      );
    case "ready":
      return (
        <Button
          variant="default"
          size="sm"
          onClick={() => handleStatusChange(orderId, "completed")}
        >
          Complete
        </Button>
      );
    default:
      return null;
  }
};

export default OrderStatusActions;

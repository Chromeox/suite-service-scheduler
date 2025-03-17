
import React from "react";
import { Button } from "@/components/ui/button";

interface OrderStatusActionsProps {
  orderId: string;
  status: string;
  role?: string;
  handleStatusChange: (orderId: string, newStatus: string) => void;
}

const OrderStatusActions = ({ orderId, status, role, handleStatusChange }: OrderStatusActionsProps) => {
  if (status === "completed") return null;
  
  if (role === "runner") {
    return (
      <div className={status === "ready" ? "" : "space-y-2"}>
        {status === "pending" && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleStatusChange(orderId, "in-progress")}
            className="w-full"
          >
            Start
          </Button>
        )}
        {status === "in-progress" && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleStatusChange(orderId, "ready")}
            className="w-full"
          >
            {status === "ready" ? "Mark Ready" : "Ready"}
          </Button>
        )}
        {status === "ready" && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleStatusChange(orderId, "completed")}
            className="w-full"
          >
            Deliver
          </Button>
        )}
      </div>
    );
  } else if (role === "attendant" && status === "ready") {
    return (
      <Button
        size="sm"
        variant="outline"
        onClick={() => handleStatusChange(orderId, "completed")}
      >
        {status === "ready" ? "Mark Delivered" : "Delivered"}
      </Button>
    );
  }
  
  return null;
};

export default OrderStatusActions;

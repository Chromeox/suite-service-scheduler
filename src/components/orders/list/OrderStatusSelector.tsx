
import React from "react";
import { OrderStatus } from "@/components/orders/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface OrderStatusSelectorProps {
  status: OrderStatus;
  onChange: (newStatus: OrderStatus) => void;
  disabled?: boolean;
}

const OrderStatusSelector = ({ status, onChange, disabled = false }: OrderStatusSelectorProps) => {
  const statusOptions: OrderStatus[] = ["pending", "in-progress", "ready", "completed"];
  
  // Define status colors for visual distinction
  const getStatusColor = (status: OrderStatus): string => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in-progress": 
        return "bg-blue-100 text-blue-800";
      case "ready": 
        return "bg-green-100 text-green-800";
      case "completed": 
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  return (
    <Select 
      value={status} 
      onValueChange={(value) => onChange(value as OrderStatus)}
      disabled={disabled}
    >
      <SelectTrigger className={`w-32 h-8 px-2 py-0 text-xs font-medium rounded-full ${getStatusColor(status)}`}>
        <SelectValue placeholder="Select status" />
      </SelectTrigger>
      <SelectContent>
        {statusOptions.map((option) => (
          <SelectItem key={option} value={option} className="text-sm">
            {option.charAt(0).toUpperCase() + option.slice(1).replace("-", " ")}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default OrderStatusSelector;

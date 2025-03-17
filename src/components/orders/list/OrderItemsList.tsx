
import React from "react";
import { OrderItem } from "@/components/orders/types";

interface OrderItemsListProps {
  items: OrderItem[];
}

const OrderItemsList = ({ items }: OrderItemsListProps) => {
  return (
    <div className="space-y-1">
      {items.map((item, idx) => (
        <div key={idx} className="flex items-center justify-between text-sm">
          <span>{item.name} x{item.quantity}</span>
        </div>
      ))}
    </div>
  );
};

export default OrderItemsList;

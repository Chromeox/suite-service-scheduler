
import React from "react";
import { OrderItem } from "@/components/orders/types";

interface OrderItemsListProps {
  items: OrderItem[];
  showPrice?: boolean;
}

const OrderItemsList = ({ items, showPrice = false }: OrderItemsListProps) => {
  return (
    <div className="space-y-1">
      {items.map((item, idx) => (
        <div key={idx} className="flex items-center justify-between text-sm">
          <span>
            {item.name} x{item.quantity}
          </span>
          {showPrice && item.price && (
            <span className="text-muted-foreground">${item.price.toFixed(2)}</span>
          )}
        </div>
      ))}
    </div>
  );
};

export default OrderItemsList;

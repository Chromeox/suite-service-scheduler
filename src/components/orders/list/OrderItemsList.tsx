
import React from "react";
import { OrderItem } from "@/components/orders/types";

interface OrderItemsListProps {
  items: OrderItem[];
  showPrice?: boolean;
}

const OrderItemsList = ({ items, showPrice = false }: OrderItemsListProps) => {
  return (
    <div className="space-y-1 max-w-full">
      {items.map((item, idx) => (
        <div key={idx} className="flex items-center justify-between text-sm overflow-hidden">
          <span className="truncate mr-2">
            {item.name} x{item.quantity}
          </span>
          {showPrice && item.price && (
            <span className="text-muted-foreground whitespace-nowrap">${item.price.toFixed(2)}</span>
          )}
        </div>
      ))}
    </div>
  );
};

export default OrderItemsList;

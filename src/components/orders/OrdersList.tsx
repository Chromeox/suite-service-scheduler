
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { OrdersListProps } from "./types";
import { useIsMobile } from "@/hooks/use-mobile";
import MobileOrderCard from "./list/MobileOrderCard";
import DesktopOrderTable from "./list/DesktopOrderTable";
import OrderSortControls from "./list/OrderSortControls";

const OrdersList = ({ orders, role, handleStatusChange }: OrdersListProps) => {
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);
  const [expandedOrderIds, setExpandedOrderIds] = useState<string[]>([]);
  const isMobile = useIsMobile();

  // Function to format time to show only hour and minutes
  const formatDeliveryTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  // Sort orders based on suiteId
  const sortedOrders = [...orders].sort((a, b) => {
    if (sortDirection === null) return 0;
    if (sortDirection === 'asc') {
      return a.suiteId.localeCompare(b.suiteId, undefined, { numeric: true });
    } else {
      return b.suiteId.localeCompare(a.suiteId, undefined, { numeric: true });
    }
  });

  const toggleSort = (direction: 'asc' | 'desc') => {
    if (sortDirection === direction) {
      setSortDirection(null); // Reset sorting
    } else {
      setSortDirection(direction);
    }
  };

  const toggleOrderExpand = (orderId: string) => {
    if (expandedOrderIds.includes(orderId)) {
      setExpandedOrderIds(expandedOrderIds.filter(id => id !== orderId));
    } else {
      setExpandedOrderIds([...expandedOrderIds, orderId]);
    }
  };

  const isOrderExpanded = (orderId: string) => {
    return expandedOrderIds.includes(orderId);
  };

  // Mobile card view
  const renderMobileView = () => {
    return (
      <div className="space-y-3">
        <div className="flex justify-between items-center mb-3 px-2">
          <div className="text-sm font-medium">Sort by Suite No:</div>
          <OrderSortControls 
            sortDirection={sortDirection}
            toggleSort={toggleSort}
          />
        </div>
        
        {sortedOrders.length === 0 ? (
          <div className="text-center py-4 bg-muted/20 rounded-md">
            No orders found
          </div>
        ) : (
          sortedOrders.map((order) => (
            <MobileOrderCard
              key={order.id}
              order={order}
              role={role}
              handleStatusChange={handleStatusChange}
              isExpanded={isOrderExpanded(order.id)}
              toggleExpand={() => toggleOrderExpand(order.id)}
              formatDeliveryTime={formatDeliveryTime}
            />
          ))
        )}
      </div>
    );
  };

  return (
    <Card>
      <CardContent className="p-0">
        {isMobile ? (
          renderMobileView()
        ) : (
          <DesktopOrderTable
            orders={sortedOrders}
            role={role}
            handleStatusChange={handleStatusChange}
            sortDirection={sortDirection}
            toggleSort={toggleSort}
            formatDeliveryTime={formatDeliveryTime}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default OrdersList;

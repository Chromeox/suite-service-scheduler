
import React, { useCallback, useState } from "react";
import { Order, OrderStatus } from "@/components/orders/types";
import MobileOrderCard from "./MobileOrderCard";
import { useIsMobile } from "@/hooks/use-mobile";

interface VirtualizedOrdersListProps {
  orders: Order[];
  role?: string;
  handleStatusChange: (orderId: string, newStatus: OrderStatus) => void;
  setShowGameDayOrderDialog?: (show: boolean) => void;
}

const VirtualizedOrdersList: React.FC<VirtualizedOrdersListProps> = ({
  orders,
  role,
  handleStatusChange,
  setShowGameDayOrderDialog
}) => {
  const isMobile = useIsMobile();
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  
  // Preload the first few orders to improve perceived performance
  const initialVisibleCount = 5; 
  const [visibleCount, setVisibleCount] = useState(initialVisibleCount);
  
  // Callback for intersection observer to load more orders when scrolling
  const lastOrderRef = useCallback((node: HTMLDivElement | null) => {
    if (!node) return;
    
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && visibleCount < orders.length) {
        setVisibleCount(prevCount => Math.min(prevCount + 5, orders.length));
      }
    }, { rootMargin: '200px' });
    
    observer.observe(node);
    
    return () => observer.disconnect();
  }, [visibleCount, orders.length]);
  
  // Format delivery time for display
  const formatDeliveryTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Show only the number of orders up to visibleCount
  const visibleOrders = orders.slice(0, visibleCount);
  
  if (!isMobile) {
    return null; // This component is only for mobile view
  }
  
  if (orders.length === 0) {
    return <div className="text-center py-10">No orders found</div>;
  }
  
  return (
    <div className="space-y-3 pb-16">
      {visibleOrders.map((order, index) => {
        const isLast = index === visibleOrders.length - 1 && visibleOrders.length < orders.length;
        
        return (
          <div 
            key={order.id}
            ref={isLast ? lastOrderRef : null}
          >
            <MobileOrderCard
              order={order}
              role={role}
              handleStatusChange={handleStatusChange}
              isExpanded={expandedOrderId === order.id}
              toggleExpand={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
              formatDeliveryTime={formatDeliveryTime}
              setShowGameDayOrderDialog={setShowGameDayOrderDialog}
            />
          </div>
        );
      })}
      
      {visibleCount < orders.length && (
        <div className="flex justify-center py-4">
          <div className="animate-pulse text-muted-foreground">Loading more orders...</div>
        </div>
      )}
    </div>
  );
};

export default VirtualizedOrdersList;

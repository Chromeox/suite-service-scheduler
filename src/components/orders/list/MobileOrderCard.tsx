
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Order, OrderStatus } from "@/components/orders/types";
import OrderItemsList from "./OrderItemsList";
import OrderStatusActions from "./OrderStatusActions";
import { useSwipe } from "@/hooks/use-swipe";
import { useHapticFeedback } from "@/hooks/use-haptics";

interface MobileOrderCardProps {
  order: Order;
  role?: string;
  handleStatusChange: (orderId: string, newStatus: OrderStatus) => void;
  isExpanded: boolean;
  toggleExpand: () => void;
  formatDeliveryTime: (dateString: string) => string;
  setShowGameDayOrderDialog?: (show: boolean) => void;
}

const MobileOrderCard = ({
  order,
  role,
  handleStatusChange,
  isExpanded,
  toggleExpand,
  formatDeliveryTime,
  setShowGameDayOrderDialog,
}: MobileOrderCardProps) => {
  const { triggerHaptic, successFeedback, warningFeedback } = useHapticFeedback();
  
  // Define the next and previous status for swipe actions
  const getNextStatus = (currentStatus: OrderStatus): OrderStatus | null => {
    const statusFlow: OrderStatus[] = ["pending", "in-progress", "ready", "completed"];
    const currentIndex = statusFlow.indexOf(currentStatus);
    return currentIndex < statusFlow.length - 1 ? statusFlow[currentIndex + 1] : null;
  };
  
  const getPrevStatus = (currentStatus: OrderStatus): OrderStatus | null => {
    const statusFlow: OrderStatus[] = ["pending", "in-progress", "ready", "completed"];
    const currentIndex = statusFlow.indexOf(currentStatus);
    return currentIndex > 0 ? statusFlow[currentIndex - 1] : null;
  };
  
  // Prepare swipe handlers (only for non-supervisor roles)
  const canSwipe = role !== "supervisor";
  const swipeHandlers = useSwipe({
    onSwipeLeft: () => {
      if (!canSwipe) return;
      const nextStatus = getNextStatus(order.status as OrderStatus);
      if (nextStatus) {
        successFeedback(); // Add haptic feedback on successful status change
        handleStatusChange(order.id, nextStatus);
      } else {
        warningFeedback(); // Add haptic feedback when no next status
      }
    },
    onSwipeRight: () => {
      if (!canSwipe) return;
      const prevStatus = getPrevStatus(order.status as OrderStatus);
      if (prevStatus) {
        successFeedback(); // Add haptic feedback on successful status change
        handleStatusChange(order.id, prevStatus);
      } else {
        warningFeedback(); // Add haptic feedback when no previous status
      }
    }
  }, { threshold: 70 });
  
  const swipeProps = canSwipe ? swipeHandlers : {};
  
  const handleCardClick = () => {
    triggerHaptic(); // Add subtle haptic feedback on card expansion
    toggleExpand();
  };
  
  return (
    <Card key={order.id} className="overflow-hidden relative">
      <CardContent className="p-0" {...swipeProps}>
        {canSwipe && (
          <div className="absolute top-1 right-2 text-xs text-muted-foreground opacity-70">
            {order.status !== "completed" && "← Swipe to advance"}
            {order.status !== "pending" && order.status !== "completed" && " / "}
            {order.status !== "pending" && "Swipe to revert →"}
          </div>
        )}
        
        <div className="p-3 border-b flex justify-between items-center" onClick={handleCardClick}>
          <div>
            <div className="font-medium">Suite {order.suiteId}</div>
            <div className="text-sm text-muted-foreground">{order.suiteName}</div>
          </div>
          <div className="flex items-center">
            {isExpanded ? 
              <ChevronDown className="h-4 w-4 text-muted-foreground" /> : 
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            }
          </div>
        </div>
        
        {isExpanded && (
          <div className="p-3 space-y-3">
            <div>
              <div className="text-sm font-medium mb-1">Items:</div>
              <div className="space-y-1 ml-1">
                <OrderItemsList items={order.items} showPrice={true} />
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm font-medium">Delivery:</div>
                <div className="text-sm">{formatDeliveryTime(order.deliveryTime)}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {order.isPreOrder ? "Pre-Order" : "Game Day Order"}
                </div>
              </div>
              
              <div>
                <OrderStatusActions 
                  orderId={order.id} 
                  status={order.status as OrderStatus} 
                  role={role} 
                  handleStatusChange={(id, status) => {
                    successFeedback(); // Add haptic feedback on status change
                    handleStatusChange(id, status);
                  }} 
                  setShowGameDayOrderDialog={setShowGameDayOrderDialog}
                />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MobileOrderCard;

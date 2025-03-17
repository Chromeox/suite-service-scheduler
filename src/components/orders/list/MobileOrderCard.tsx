
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Order, OrderStatus } from "@/components/orders/types";
import OrderItemsList from "./OrderItemsList";
import OrderStatusActions from "./OrderStatusActions";

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
  return (
    <Card key={order.id} className="overflow-hidden">
      <CardContent className="p-0">
        <div className="p-3 border-b flex justify-between items-center" onClick={toggleExpand}>
          <div>
            <div className="font-medium">Suite {order.suiteId}</div>
            {/* Removed the location/level information */}
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
                  handleStatusChange={handleStatusChange} 
                  setShowGameDayOrderDialog={setShowGameDayOrderDialog}
                />
              </div>
            </div>
            
            {/* Removed total before tax information */}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MobileOrderCard;

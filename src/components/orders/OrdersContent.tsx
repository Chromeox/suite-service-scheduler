
import React, { useEffect } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import OrdersList from "@/components/orders/OrdersList";
import { toast } from "@/hooks/use-toast";
import { OrderState } from "@/hooks/useOrders";

interface OrdersContentProps {
  orderState: OrderState;
  role?: string;
}

const OrdersContent = ({ orderState, role }: OrdersContentProps) => {
  const { 
    activeTab, 
    isLoading, 
    error, 
    filteredOrders, 
    handleStatusChange 
  } = orderState;

  // Show error toast if order fetching fails
  useEffect(() => {
    if (error) {
      toast({
        title: "Error Loading Orders",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    }
  }, [error]);

  return (
    <Tabs value={activeTab} defaultValue={activeTab}>
      <TabsContent value={activeTab} className="mt-6">
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 border rounded-lg bg-muted/20">
            <p className="text-muted-foreground text-center mb-4">
              No orders found matching your criteria.
            </p>
          </div>
        ) : (
          <OrdersList 
            orders={filteredOrders} 
            role={role} 
            handleStatusChange={handleStatusChange} 
          />
        )}
      </TabsContent>
    </Tabs>
  );
};

export default OrdersContent;

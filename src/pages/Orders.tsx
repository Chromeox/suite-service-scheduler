
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { TabsContent } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import OrderFilters from "@/components/orders/OrderFilters";
import OrdersList from "@/components/orders/OrdersList";
import OrderForm from "@/components/orders/OrderForm";
import { Order } from "@/components/orders/types";
import { fetchOrders, updateOrderStatus, addOrder } from "@/services/ordersService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const Orders = () => {
  const { role } = useParams<{ role: string }>();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showGameDayOrderDialog, setShowGameDayOrderDialog] = useState(false);
  const [selectedFloor, setSelectedFloor] = useState<string>("all");
  const [gameDayOrder, setGameDayOrder] = useState({
    suiteId: "",
    items: [{ name: "", quantity: 1 }]
  });

  const queryClient = useQueryClient();

  // Fetch orders with React Query
  const { data: orders = [], isLoading, error } = useQuery({
    queryKey: ['orders', role],
    queryFn: () => fetchOrders(role),
  });

  // Create mutation for updating order status
  const updateOrderMutation = useMutation({
    mutationFn: ({ orderId, newStatus }: { orderId: string, newStatus: string }) => 
      updateOrderStatus(orderId, newStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  // Create mutation for adding a new order
  const addOrderMutation = useMutation({
    mutationFn: (orderData: { 
      suiteId: string, 
      items: { name: string, quantity: number }[],
      isPreOrder: boolean,
      deliveryTime?: string
    }) => addOrder(
      orderData.suiteId, 
      orderData.items, 
      orderData.isPreOrder,
      orderData.deliveryTime
    ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      // Reset form and close dialog
      setGameDayOrder({
        suiteId: "",
        items: [{ name: "", quantity: 1 }]
      });
      setShowGameDayOrderDialog(false);
      
      // Show toast notification
      toast({
        title: "Order Created",
        description: `Game day order created successfully`,
      });
    },
    onError: (error) => {
      toast({
        title: "Order Creation Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    }
  });

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

  // Filter orders based on tab, search, and floor
  const filteredOrders = orders.filter(order => {
    const matchesTab = 
      activeTab === "all" || 
      (activeTab === "pre-orders" && order.isPreOrder) ||
      (activeTab === "game-day" && !order.isPreOrder) ||
      (activeTab === "pending" && order.status === "pending") ||
      (activeTab === "in-progress" && order.status === "in-progress") ||
      (activeTab === "ready" && order.status === "ready") ||
      (activeTab === "completed" && order.status === "completed");
    
    const matchesSearch = 
      order.suiteId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.suiteName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    
    const matchesFloor = 
      selectedFloor === "all" || 
      (selectedFloor === "200" && order.suiteId.startsWith("200")) ||
      (selectedFloor === "500" && order.suiteId.startsWith("500"));
    
    return matchesTab && matchesSearch && matchesFloor;
  });

  const handleStatusChange = (orderId: string, newStatus: string) => {
    updateOrderMutation.mutate({ orderId, newStatus });
    
    // Show toast notification
    toast({
      title: "Order Updated",
      description: `Order ${orderId} status changed to ${newStatus}`,
    });
  };

  const handleAddGameDayOrder = () => {
    // Validate input
    if (!gameDayOrder.suiteId || gameDayOrder.items.some(item => !item.name)) {
      toast({
        title: "Invalid Input",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // Add the order using the mutation
    addOrderMutation.mutate({
      suiteId: gameDayOrder.suiteId,
      items: gameDayOrder.items,
      isPreOrder: false
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <OrderFilters
          role={role}
          selectedFloor={selectedFloor}
          setSelectedFloor={setSelectedFloor}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setShowGameDayOrderDialog={setShowGameDayOrderDialog}
        />

        <TabsContent value={activeTab} className="mt-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-40">
              <p className="text-muted-foreground">Loading orders...</p>
            </div>
          ) : (
            <OrdersList 
              orders={filteredOrders} 
              role={role} 
              handleStatusChange={handleStatusChange} 
            />
          )}
        </TabsContent>
        
        <OrderForm
          showGameDayOrderDialog={showGameDayOrderDialog}
          setShowGameDayOrderDialog={setShowGameDayOrderDialog}
          handleAddGameDayOrder={handleAddGameDayOrder}
          gameDayOrder={gameDayOrder}
          setGameDayOrder={setGameDayOrder}
        />
      </div>
    </DashboardLayout>
  );
};

export default Orders;

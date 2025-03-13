import React, { useState } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { TabsContent } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import OrderFilters from "@/components/orders/OrderFilters";
import OrdersList from "@/components/orders/OrdersList";
import OrderForm from "@/components/orders/OrderForm";
import { Order } from "@/components/orders/types";

// Mock data for orders
const MOCK_ORDERS = [
  {
    id: "ORD-001",
    suiteId: "200-A",
    suiteName: "200 Level Suite A",
    location: "200 Pantry",
    items: [
      { name: "Nachos", quantity: 2, status: "ready" },
      { name: "Hot Dogs", quantity: 4, status: "in-progress" }
    ],
    status: "in-progress",
    createdAt: "2023-08-01T15:30:00",
    deliveryTime: "2023-08-01T16:00:00",
    isPreOrder: true
  },
  {
    id: "ORD-002",
    suiteId: "200-B",
    suiteName: "200 Level Suite B",
    location: "200 Pantry",
    items: [
      { name: "Pizza", quantity: 1, status: "pending" },
      { name: "Soft Drinks", quantity: 6, status: "pending" }
    ],
    status: "pending",
    createdAt: "2023-08-01T16:00:00",
    deliveryTime: "2023-08-01T16:45:00",
    isPreOrder: true
  },
  {
    id: "ORD-003",
    suiteId: "500-A",
    suiteName: "500 Level Suite A",
    location: "500 Pantry",
    items: [
      { name: "Chicken Tenders", quantity: 3, status: "ready" },
      { name: "Fries", quantity: 2, status: "ready" }
    ],
    status: "ready",
    createdAt: "2023-08-01T14:45:00",
    deliveryTime: "2023-08-01T15:30:00",
    isPreOrder: false
  },
  {
    id: "ORD-004",
    suiteId: "200-K",
    suiteName: "200 Kitchen Suite",
    location: "200 Kitchen Pantry",
    items: [
      { name: "Burgers", quantity: 5, status: "delivered" },
      { name: "Beer", quantity: 10, status: "delivered" }
    ],
    status: "completed",
    createdAt: "2023-08-01T13:00:00",
    deliveryTime: "2023-08-01T14:00:00",
    isPreOrder: true
  }
];

// Filter orders based on role
const getRoleOrders = (role: string, orders: Order[]) => {
  if (role === "attendant") {
    return orders.filter(order => 
      order.suiteId === "200-A" || 
      order.suiteId === "200-B" || 
      order.suiteId === "500-A"
    );
  } else if (role === "runner") {
    return orders;
  } else {
    return orders;
  }
};

const Orders = () => {
  const { role } = useParams<{ role: string }>();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [orders, setOrders] = useState(getRoleOrders(role || "", MOCK_ORDERS));
  const [showGameDayOrderDialog, setShowGameDayOrderDialog] = useState(false);
  const [selectedFloor, setSelectedFloor] = useState<string>("all");
  const [gameDayOrder, setGameDayOrder] = useState({
    suiteId: "",
    items: [{ name: "", quantity: 1 }]
  });

  // Filter orders based on tab and search
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
    // Update order status
    const updatedOrders = orders.map(order => {
      if (order.id === orderId) {
        return { ...order, status: newStatus };
      }
      return order;
    });
    
    setOrders(updatedOrders);
    
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

    // Create new order
    const newOrder = {
      id: `ORD-${Math.floor(Math.random() * 1000)}`,
      suiteId: gameDayOrder.suiteId,
      suiteName: `Suite ${gameDayOrder.suiteId}`,
      location: gameDayOrder.suiteId.includes("200") ? "200 Pantry" : 
                gameDayOrder.suiteId.includes("500") ? "500 Pantry" : "200 Kitchen Pantry",
      items: gameDayOrder.items.map(item => ({
        ...item,
        status: "pending"
      })),
      status: "pending",
      createdAt: new Date().toISOString(),
      deliveryTime: new Date(Date.now() + 45 * 60000).toISOString(), // 45 minutes from now
      isPreOrder: false
    };

    // Add new order
    setOrders([newOrder, ...orders]);
    
    // Reset form and close dialog
    setGameDayOrder({
      suiteId: "",
      items: [{ name: "", quantity: 1 }]
    });
    setShowGameDayOrderDialog(false);
    
    // Show toast notification
    toast({
      title: "Order Created",
      description: `Game day order created for ${newOrder.suiteName}`,
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
          <OrdersList 
            orders={filteredOrders} 
            role={role} 
            handleStatusChange={handleStatusChange} 
          />
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

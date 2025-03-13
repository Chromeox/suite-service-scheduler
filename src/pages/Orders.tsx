
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  Package, 
  Plus, 
  Search
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

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
const getRoleOrders = (role: string, orders: typeof MOCK_ORDERS) => {
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
    
    return matchesTab && matchesSearch;
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
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
          <div className="flex space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search orders..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {role === "attendant" && (
              <Dialog open={showGameDayOrderDialog} onOpenChange={setShowGameDayOrderDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Game Day Order
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Game Day Order</DialogTitle>
                    <DialogDescription>
                      Add items for immediate service to a suite.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <label htmlFor="suite" className="text-sm font-medium">Suite</label>
                      <Input
                        id="suite"
                        placeholder="Suite ID (e.g., 200-A)"
                        value={gameDayOrder.suiteId}
                        onChange={(e) => setGameDayOrder({...gameDayOrder, suiteId: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Items</label>
                      {gameDayOrder.items.map((item, index) => (
                        <div key={index} className="flex space-x-2">
                          <Input
                            placeholder="Item name"
                            value={item.name}
                            onChange={(e) => {
                              const newItems = [...gameDayOrder.items];
                              newItems[index] = {...newItems[index], name: e.target.value};
                              setGameDayOrder({...gameDayOrder, items: newItems});
                            }}
                            className="flex-1"
                          />
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => {
                              const newItems = [...gameDayOrder.items];
                              newItems[index] = {...newItems[index], quantity: parseInt(e.target.value) || 1};
                              setGameDayOrder({...gameDayOrder, items: newItems});
                            }}
                            className="w-20"
                          />
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => setGameDayOrder({
                          ...gameDayOrder, 
                          items: [...gameDayOrder.items, { name: "", quantity: 1 }]
                        })}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Item
                      </Button>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleAddGameDayOrder}>Create Order</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All Orders</TabsTrigger>
            <TabsTrigger value="pre-orders">Pre-Orders</TabsTrigger>
            <TabsTrigger value="game-day">Game Day</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            <TabsTrigger value="ready">Ready</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          <TabsContent value={activeTab} className="mt-6">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Suite No.</TableHead>
                      <TableHead>Suite</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Delivery Time</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4">
                          No orders found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.suiteId}</TableCell>
                          <TableCell>
                            {order.suiteName}
                            <div className="text-xs text-muted-foreground">{order.location}</div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              {order.items.map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between text-sm">
                                  <span>{item.name} x{item.quantity}</span>
                                  <Badge variant="outline" className="ml-2">
                                    {item.status}
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                order.status === "completed" ? "default" :
                                order.status === "ready" ? "outline" :
                                order.status === "in-progress" ? "secondary" :
                                "destructive"
                              }
                            >
                              {order.status}
                            </Badge>
                            <div className="text-xs text-muted-foreground mt-1">
                              {order.isPreOrder ? "Pre-Order" : "Game Day Order"}
                            </div>
                          </TableCell>
                          <TableCell>
                            {new Date(order.deliveryTime).toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </TableCell>
                          <TableCell>
                            {role === "runner" && order.status !== "completed" && (
                              <div className="flex space-x-2">
                                {order.status === "pending" && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleStatusChange(order.id, "in-progress")}
                                  >
                                    Start
                                  </Button>
                                )}
                                {order.status === "in-progress" && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleStatusChange(order.id, "ready")}
                                  >
                                    Mark Ready
                                  </Button>
                                )}
                                {order.status === "ready" && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleStatusChange(order.id, "completed")}
                                  >
                                    Deliver
                                  </Button>
                                )}
                              </div>
                            )}
                            {role === "attendant" && order.status === "ready" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleStatusChange(order.id, "completed")}
                              >
                                Mark Delivered
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Orders;


import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Order } from "@/components/orders/types";
import { fetchOrders, updateOrderStatus, addOrder } from "@/services/orders";
import { 
  fetchMockOrders, 
  updateMockOrderStatus, 
  addMockOrder 
} from "@/services/mockOrdersService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Flag to use mock data during development
const USE_MOCK_DATA = true;

export interface OrderState {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  showGameDayOrderDialog: boolean;
  setShowGameDayOrderDialog: (show: boolean) => void;
  selectedFloor: string;
  setSelectedFloor: (floor: string) => void;
  gameDayOrder: {
    suiteId: string;
    items: { name: string; quantity: number }[];
  };
  setGameDayOrder: React.Dispatch<
    React.SetStateAction<{
      suiteId: string;
      items: { name: string; quantity: number }[];
    }>
  >;
  orders: Order[];
  isLoading: boolean;
  error: Error | null;
  handleStatusChange: (orderId: string, newStatus: string) => void;
  handleAddGameDayOrder: () => void;
  filteredOrders: Order[];
}

export function useOrders(role?: string): OrderState {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showGameDayOrderDialog, setShowGameDayOrderDialog] = useState(false);
  const [selectedFloor, setSelectedFloor] = useState<string>("all");
  const [gameDayOrder, setGameDayOrder] = useState({
    suiteId: "",
    items: [{ name: "", quantity: 1 }]
  });

  const queryClient = useQueryClient();

  // Determine which service functions to use based on the flag
  const orderService = {
    fetch: USE_MOCK_DATA ? fetchMockOrders : fetchOrders,
    update: USE_MOCK_DATA ? updateMockOrderStatus : updateOrderStatus,
    add: USE_MOCK_DATA ? addMockOrder : addOrder
  };

  // Fetch orders with React Query
  const { data: orders = [], isLoading, error } = useQuery({
    queryKey: ['orders', role],
    queryFn: () => orderService.fetch(role),
  });

  // Create mutation for updating order status
  const updateOrderMutation = useMutation({
    mutationFn: ({ orderId, newStatus }: { orderId: string, newStatus: string }) => 
      orderService.update(orderId, newStatus),
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
    }) => orderService.add(
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

  return {
    activeTab, 
    setActiveTab,
    searchQuery, 
    setSearchQuery,
    showGameDayOrderDialog, 
    setShowGameDayOrderDialog,
    selectedFloor, 
    setSelectedFloor,
    gameDayOrder, 
    setGameDayOrder,
    orders,
    isLoading,
    error: error as Error | null,
    handleStatusChange,
    handleAddGameDayOrder,
    filteredOrders
  };
}

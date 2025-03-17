
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { getOrderService } from "./orderService";
import { notifyRunnerOfNewOrder } from "@/services/orders/notifications";

export const useOrderMutations = (
  resetOrderForm: () => void,
  closeDialog: () => void
) => {
  const queryClient = useQueryClient();
  const orderService = getOrderService();

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
    onSuccess: (newOrder) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      
      // Reset form and close dialog
      resetOrderForm();
      closeDialog();
      
      // Show toast notification for creator
      toast({
        title: "Order Created",
        description: `Game day order created successfully for Suite ${newOrder.suiteId}`,
      });
      
      // Send notification to runner
      notifyRunnerOfNewOrder(newOrder);
    },
    onError: (error) => {
      toast({
        title: "Order Creation Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    }
  });

  return {
    updateOrderMutation,
    addOrderMutation
  };
};

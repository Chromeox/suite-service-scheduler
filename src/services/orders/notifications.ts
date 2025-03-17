
import { Order } from "@/components/orders/types";
import { toast } from "@/hooks/use-toast";

/**
 * Notifies a runner of a new order
 * @param order The newly placed order
 */
export const notifyRunnerOfNewOrder = (order: Order) => {
  // In a real app, we would use a server-side notification system
  // For this implementation, we'll use the toast system to demonstrate the concept
  
  // Format order items for display
  const itemsList = order.items.map(item => 
    `${item.name} x${item.quantity}`
  ).join(', ');
  
  // Create toast notification with acceptance action
  toast({
    title: `New Order for Suite ${order.suiteId}`,
    description: `Items: ${itemsList}`,
    variant: "default",
    duration: 10000, // 10 seconds
    action: (
      <button 
        onClick={() => acknowledgeOrder(order.id)}
        className="bg-primary text-primary-foreground hover:bg-primary/90 h-8 rounded-md px-3 text-xs"
      >
        Acknowledge
      </button>
    ),
  });
  
  // Log for debugging
  console.log(`Notification sent for new order ${order.id} in suite ${order.suiteId}`);
};

/**
 * Handles the acknowledgment of an order by a runner
 * @param orderId The ID of the order being acknowledged
 */
const acknowledgeOrder = (orderId: string) => {
  // In a real app, this would update a database record
  console.log(`Order ${orderId} acknowledged by runner`);
  
  toast({
    title: "Order Acknowledged",
    description: `You have acknowledged order ${orderId}`,
    variant: "default",
  });
};

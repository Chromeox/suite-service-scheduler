
import { Order } from "@/components/orders/types";
import { generateMockOrders } from "./orderGeneratorService";

// Helper function to round a date to nearest 15 minutes
const roundToNearest15Min = (date: Date): Date => {
  const minutes = date.getMinutes();
  const remainder = minutes % 15;
  const roundedMinutes = Math.round(minutes / 15) * 15;
  
  const newDate = new Date(date);
  newDate.setMinutes(roundedMinutes);
  newDate.setSeconds(0);
  newDate.setMilliseconds(0);
  
  return newDate;
};

// Mock implementation of fetchOrders
export const fetchMockOrders = async (roleFilter?: string): Promise<Order[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Generate more orders to ensure there are always some visible
  const orders = generateMockOrders(25);
  
  // Apply role-based filtering if needed
  if (roleFilter === "attendant") {
    return orders;
  }
  
  return orders;
};

// Mock implementation of updateOrderStatus
export const updateMockOrderStatus = async (
  orderId: string, 
  newStatus: string
): Promise<void> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  console.log(`Updated order ${orderId} status to ${newStatus}`);
  
  // In a real implementation, we'd update the order in the database
  return;
};

// Mock implementation of addOrder
export const addMockOrder = async (
  suiteId: string,
  items: { name: string; quantity: number }[],
  isPreOrder: boolean = false,
  deliveryTime?: string
): Promise<Order> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  // Generate a random id for the new order
  const orderId = Math.floor(Math.random() * 1000) + 100;
  
  // Format items for the response
  const formattedItems = items.map(item => ({
    name: item.name,
    quantity: item.quantity,
    status: 'pending'
  }));
  
  // Round delivery time to nearest 15 minutes if provided, or set default
  let orderDeliveryTime;
  if (deliveryTime) {
    const parsedTime = new Date(deliveryTime);
    const roundedTime = roundToNearest15Min(parsedTime);
    orderDeliveryTime = roundedTime.toISOString();
  } else {
    // 45 mins from now, rounded to nearest 15 minutes
    const defaultTime = new Date(Date.now() + 45 * 60000);
    const roundedTime = roundToNearest15Min(defaultTime);
    orderDeliveryTime = roundedTime.toISOString();
  }
  
  // Create the new order
  const newOrder: Order = {
    id: `ORD-${orderId}`,
    suiteId,
    suiteName: `${suiteId} - VIP Area`,
    location: suiteId.startsWith("2") ? "Level 200" : "Level 500",
    items: formattedItems,
    status: 'pending',
    createdAt: new Date().toISOString(),
    deliveryTime: orderDeliveryTime,
    isPreOrder
  };
  
  console.log("Created new order:", newOrder);
  
  return newOrder;
};

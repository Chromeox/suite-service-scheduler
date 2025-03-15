
import { Order, OrderItem } from "@/components/orders/types";

// Generate a mock order with random data
const generateMockOrder = (id: number): Order => {
  // Determine level (200 or 500)
  const suiteLevel = Math.random() > 0.5 ? "200" : "500";
  
  // Generate suite number within the correct range
  let suiteNumber;
  if (suiteLevel === "200") {
    // For 200 level, generate numbers between 01-60
    suiteNumber = Math.floor(Math.random() * 60) + 1;
  } else {
    // For 500 level, generate numbers between 01-40
    suiteNumber = Math.floor(Math.random() * 40) + 1;
  }
  
  const suiteId = `${suiteLevel}${suiteNumber.toString().padStart(2, '0')}`;
  
  const statuses = ["pending", "in-progress", "ready", "completed"];
  const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
  
  const isPreOrder = Math.random() > 0.7;
  
  // Generate a random time today
  const now = new Date();
  const deliveryTime = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    Math.floor(Math.random() * 8) + 12, // Random hour between 12-20
    Math.floor(Math.random() * 59) // Random minute
  );
  
  // Generate random items
  const menuItems = [
    "Hot Dog",
    "Nachos",
    "Pretzel",
    "Chicken Tenders",
    "Pizza Slice",
    "Popcorn",
    "Soda",
    "Beer",
    "Ice Cream",
    "Cotton Candy"
  ];
  
  const itemCount = Math.floor(Math.random() * 3) + 1;
  const items: OrderItem[] = [];
  
  for (let i = 0; i < itemCount; i++) {
    const randomItemIndex = Math.floor(Math.random() * menuItems.length);
    const quantity = Math.floor(Math.random() * 3) + 1;
    
    items.push({
      name: menuItems[randomItemIndex],
      quantity,
      status: randomStatus
    });
  }
  
  return {
    id: `ORD-${id}`,
    suiteId,
    suiteName: `Suite ${suiteId}`,
    location: `Level ${suiteLevel}`,
    items,
    status: randomStatus,
    createdAt: new Date(Date.now() - Math.random() * 36000000).toISOString(), // Random time in the last 10 hours
    deliveryTime: deliveryTime.toISOString(),
    isPreOrder
  };
};

// Generate a list of mock orders
export const generateMockOrders = (count: number = 10): Order[] => {
  const orders: Order[] = [];
  
  for (let i = 1; i <= count; i++) {
    orders.push(generateMockOrder(i));
  }
  
  return orders;
};

// Mock implementation of fetchOrders
export const fetchMockOrders = async (roleFilter?: string): Promise<Order[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const orders = generateMockOrders(15);
  
  // Apply role-based filtering if needed
  if (roleFilter === "attendant") {
    return orders.filter(order => 
      order.suiteId.startsWith("200") || 
      order.suiteId.startsWith("500")
    );
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
  const formattedItems: OrderItem[] = items.map(item => ({
    name: item.name,
    quantity: item.quantity,
    status: 'pending'
  }));
  
  // Create a delivery time if not provided
  const orderDeliveryTime = deliveryTime || 
    new Date(Date.now() + 45 * 60000).toISOString(); // 45 mins from now
  
  // Create the new order
  const newOrder: Order = {
    id: `ORD-${orderId}`,
    suiteId,
    suiteName: `Suite ${suiteId}`,
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

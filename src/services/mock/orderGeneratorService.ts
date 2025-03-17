
import { Order, OrderItem } from "@/components/orders/types";
import { getRandomMenuItem } from "./menuService";

// Generate a mock order with random data
export const generateMockOrder = (id: number): Order => {
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
  
  // Create a 3-digit suite ID (e.g., 201, 545)
  const suiteId = `${suiteLevel[0]}${suiteNumber.toString().padStart(2, '0')}`;
  
  const statuses = ["pending", "in-progress", "ready", "completed"];
  const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
  
  const isPreOrder = Math.random() > 0.7;
  
  // Generate a random time today in 15-minute intervals
  const now = new Date();
  const deliveryTime = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    Math.floor(Math.random() * 8) + 12, // Random hour between 12-20
    Math.floor(Math.random() * 4) * 15 // Random minute: 0, 15, 30, or 45
  );
  
  // Generate random items using the menu catalog
  const itemCount = Math.floor(Math.random() * 3) + 1;
  const items: OrderItem[] = [];
  
  for (let i = 0; i < itemCount; i++) {
    const randomItem = getRandomMenuItem();
    const quantity = Math.floor(Math.random() * 3) + 1;
    
    items.push({
      name: randomItem.name,
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

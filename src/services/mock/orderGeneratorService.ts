
import { Order } from "@/components/orders/types";
import { v4 as uuidv4 } from 'uuid';

// Helper function to generate a random date within the past 24 hours
const getRandomRecentDate = () => {
  const now = new Date();
  const hoursPast = Math.floor(Math.random() * 24);
  const minutesPast = Math.floor(Math.random() * 60);
  now.setHours(now.getHours() - hoursPast);
  now.setMinutes(now.getMinutes() - minutesPast);
  return now.toISOString();
};

// Helper function to generate a random delivery time in the next few hours
const getRandomDeliveryTime = () => {
  const now = new Date();
  const hoursAhead = Math.floor(Math.random() * 5) + 1;
  const minutesAhead = Math.floor(Math.random() * 4) * 15;
  now.setHours(now.getHours() + hoursAhead);
  now.setMinutes(minutesAhead);
  return now.toISOString();
};

// Sample food items for random generation
const foodItems = [
  "Nachos", "Hot Dog", "Pretzel", "Pizza", "Burger", 
  "Chicken Tenders", "Fries", "Popcorn", "Ice Cream", "Wings"
];

// Sample drink items for random generation
const drinkItems = [
  "Beer", "Wine", "Cocktail", "Soda", "Water", 
  "Coffee", "Tea", "Lemonade", "Energy Drink", "Juice"
];

// Generate a random order with both food and drink items
const generateRandomOrder = (index: number): Order => {
  // Create 50/50 chance of level 2 or level 5
  const isLevel2 = Math.random() > 0.5;
  const level = isLevel2 ? "2" : "5";
  
  // Generate suite number based on level
  const suiteNumber = level + Math.floor(Math.random() * 99).toString().padStart(2, '0');
  
  // Generate random items (1-4 items per order)
  const numberOfItems = Math.floor(Math.random() * 4) + 1;
  const items = [];
  
  // Always include both food and drink in each order
  // Add at least one food item
  const foodItem = {
    name: foodItems[Math.floor(Math.random() * foodItems.length)],
    quantity: Math.floor(Math.random() * 5) + 1,
    status: ["pending", "in-progress", "ready", "completed"][Math.floor(Math.random() * 4)]
  };
  items.push(foodItem);
  
  // Add at least one drink item
  const drinkItem = {
    name: drinkItems[Math.floor(Math.random() * drinkItems.length)],
    quantity: Math.floor(Math.random() * 3) + 1,
    status: ["pending", "in-progress", "ready", "completed"][Math.floor(Math.random() * 4)]
  };
  items.push(drinkItem);
  
  // Add additional random items if needed
  for (let i = 2; i < numberOfItems; i++) {
    // 50/50 chance of food or drink for additional items
    const itemList = Math.random() > 0.5 ? foodItems : drinkItems;
    items.push({
      name: itemList[Math.floor(Math.random() * itemList.length)],
      quantity: Math.floor(Math.random() * 5) + 1,
      status: ["pending", "in-progress", "ready", "completed"][Math.floor(Math.random() * 4)]
    });
  }
  
  // Generate random status
  const status = ["pending", "in-progress", "ready", "completed"][Math.floor(Math.random() * 4)];
  
  // 30% chance of being a pre-order
  const isPreOrder = Math.random() < 0.3;
  
  return {
    id: `ORD-${100 + index}`,
    suiteId: suiteNumber,
    suiteName: `Suite ${suiteNumber}`,
    location: `Level ${level}00`,
    items,
    status,
    createdAt: getRandomRecentDate(),
    deliveryTime: getRandomDeliveryTime(),
    isPreOrder
  };
};

// Generate a specified number of mock orders
export const generateMockOrders = (count: number = 10): Order[] => {
  return Array.from({ length: count }, (_, i) => generateRandomOrder(i));
};

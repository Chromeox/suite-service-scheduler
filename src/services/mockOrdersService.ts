import { Order, OrderItem } from "@/components/orders/types";

// Define the MenuItem type with prices and dietary information
export interface MenuItem {
  id: string;
  name: string;
  price: number;
  description?: string;
  category: string;
  dietaryInfo?: {
    vegetarian?: boolean;
    vegan?: boolean;
    glutenFree?: boolean;
    oceanwise?: boolean;
  };
  servingSize?: string;
  addons?: Array<{name: string, price: number}>;
}

// Comprehensive menu catalog based on the provided menu images
export const menuCatalog: MenuItem[] = [
  // SNACKS category
  {
    id: "snack-1",
    name: "Bottomless Popcorn",
    price: 55,
    category: "Snacks",
    dietaryInfo: {
      vegan: true,
      glutenFree: true
    },
    servingSize: "Serves 8"
  },
  {
    id: "snack-2",
    name: "Kettle Chips",
    price: 55,
    description: "french onion dip",
    category: "Snacks",
    dietaryInfo: {
      vegetarian: true,
      glutenFree: true
    },
    servingSize: "Serves 8"
  },
  {
    id: "snack-3",
    name: "Corn Chips, Guacamole & Salsa",
    price: 65,
    category: "Snacks",
    dietaryInfo: {
      vegan: true,
      glutenFree: true
    },
    servingSize: "Serves 8"
  },
  {
    id: "snack-4",
    name: "Candy Basket",
    price: 80,
    description: "selection may vary",
    category: "Snacks",
    dietaryInfo: {
      vegetarian: true,
      glutenFree: true
    },
    servingSize: "Serves 8"
  },
  {
    id: "snack-5",
    name: "Munchie Selection",
    price: 110,
    description: "popcorn, kettle chips & dip, chips & salsa, & peanut M&M's",
    category: "Snacks",
    dietaryInfo: {
      vegetarian: true,
      glutenFree: true
    },
    servingSize: "Serves 8"
  },

  // APPETIZERS category
  {
    id: "app-1",
    name: "Garlic Knots",
    price: 40,
    description: "pomodoro sauce",
    category: "Appetizers",
    dietaryInfo: {
      vegetarian: true
    },
    servingSize: "Serves 8"
  },
  {
    id: "app-2",
    name: "Tater Tot Poutine",
    price: 70,
    description: "cheese curds, gravy",
    category: "Appetizers",
    servingSize: "Serves 8"
  },
  {
    id: "app-3",
    name: "Mushroom or Pork Dumplings",
    price: 80,
    description: "sesame soy sauce",
    category: "Appetizers",
    dietaryInfo: {
      vegan: true
    },
    servingSize: "Serves 8"
  },
  {
    id: "app-4",
    name: "Crispy Shrimp Wontons",
    price: 80,
    description: "thai chili sauce",
    category: "Appetizers",
    servingSize: "Serves 8"
  },
  {
    id: "app-5",
    name: "Vegetarian Spring Rolls",
    price: 95,
    description: "plum sauce",
    category: "Appetizers",
    dietaryInfo: {
      vegetarian: true
    },
    servingSize: "Serves 8"
  },
  {
    id: "app-6",
    name: "Salt & Pepper Dry Riblets",
    price: 95,
    category: "Appetizers",
    servingSize: "Serves 8"
  },
  {
    id: "app-7",
    name: "Crispy Chicken Tenders",
    price: 130,
    description: "plum sauce",
    category: "Appetizers",
    servingSize: "Serves 8"
  },
  {
    id: "app-8",
    name: "Glazed Baby Back Ribs",
    price: 130,
    description: "house bbq sauce",
    category: "Appetizers",
    servingSize: "Serves 8"
  },
  {
    id: "app-9",
    name: "Crunchy Tiger Prawns",
    price: 130,
    description: "thai chili sauce",
    category: "Appetizers",
    servingSize: "Serves 8"
  },
  {
    id: "app-10",
    name: "Classic Wings",
    price: 130,
    description: "hot, thai sweet chili, honey garlic, salt & pepper, BBQ",
    category: "Appetizers",
    servingSize: "Serves 8"
  },

  // SALADS category
  {
    id: "salad-1",
    name: "Classic Caesar",
    price: 65,
    description: "parmesan, lemon, focaccia croutons",
    category: "Salads",
    dietaryInfo: {
      vegetarian: true
    },
    servingSize: "Serves 8"
  },

  // SUSHI PLATTERS category
  {
    id: "sushi-1",
    name: "Assorted Sushi Platter",
    price: 185,
    description: "aburi salmon oshi, aburi ebi (shrimp) oshi, sable aburi, salmon nigiri, hamachi (yellowtail tuna) nigiri, ebi nigiri, tuna nigiri, california roll, avocado roll",
    category: "Sushi Platters",
    dietaryInfo: {
      oceanwise: true
    },
    servingSize: "36 Pieces"
  },
  {
    id: "sushi-2",
    name: "Deluxe Sushi Platter",
    price: 195,
    description: "aburi salmon oshi, aburi ebi (shrimp) oshi, sable aburi, california roll, crimson tide roll, avocado roll",
    category: "Sushi Platters",
    dietaryInfo: {
      oceanwise: true
    },
    servingSize: "36 Pieces"
  },
  {
    id: "sushi-3",
    name: "Premium Sushi Platter",
    price: 205,
    description: "aburi salmon oshi, aburi ebi (shrimp) oshi, sable aburi, aburi hotate (scallop) oshi, premium bincho (tuna nigiri), premium salmon nigiri, california roll, spicy tuna roll, avocado roll",
    category: "Sushi Platters",
    dietaryInfo: {
      oceanwise: true
    },
    servingSize: "36 Pieces"
  },
  {
    id: "sushi-4",
    name: "Aburi Salmon Oshi",
    price: 205,
    description: "rice pressed into traditional boxed sushi, torched atlantic salmon, japanese mayo",
    category: "Sushi Platters",
    dietaryInfo: {
      oceanwise: true
    },
    servingSize: "36 Pieces"
  },

  // SLIDERS category
  {
    id: "slider-1",
    name: "Classic Cheeseburger Sliders",
    price: 130,
    category: "Sliders",
    servingSize: "12 Pieces",
    addons: [
      { name: "bacon", price: 12 }
    ]
  },
  
  // COLD PLATTERS category (new)
  {
    id: "cold-1",
    name: "Fresh Crudité",
    price: 90,
    description: "baby carrots, celery, grape tomatoes, cauliflower, sugar snap peas, cucumber, radish, yellow & red peppers, ranch dip",
    category: "Cold Platters",
    dietaryInfo: {
      vegetarian: true,
      glutenFree: true
    },
    servingSize: "Serves 8"
  },
  {
    id: "cold-2",
    name: "Seasonal Fruit",
    price: 95,
    category: "Cold Platters",
    dietaryInfo: {
      vegan: true,
      glutenFree: true
    },
    servingSize: "Serves 8"
  },
  {
    id: "cold-3",
    name: "Premium Cheese Selection",
    price: 140,
    description: "artisan selection of local & international cheese, grapes, dried fruits",
    category: "Cold Platters",
    dietaryInfo: {
      vegetarian: true
    },
    servingSize: "Serves 8"
  },
  
  // PIZZA category (new)
  {
    id: "pizza-1",
    name: "Cheese Pizza",
    price: 40,
    description: "mozzarella",
    category: "Pizza",
    dietaryInfo: {
      vegetarian: true
    },
    servingSize: "14″ – 8 Slices"
  },
  {
    id: "pizza-2",
    name: "Veggie Mediterranean",
    price: 45,
    description: "sun dried tomato, spinach, red & yellow bell pepper, kalamata olives, red onion, feta, mozzarella",
    category: "Pizza",
    dietaryInfo: {
      vegetarian: true
    },
    servingSize: "14″ – 8 Slices"
  },
  {
    id: "pizza-3",
    name: "Pepperoni",
    price: 45,
    description: "double pepperoni, mozzarella",
    category: "Pizza",
    servingSize: "14″ – 8 Slices"
  },
  {
    id: "pizza-4",
    name: "Hawaiian",
    price: 45,
    description: "ham, pineapple, mozzarella",
    category: "Pizza",
    servingSize: "14″ – 8 Slices"
  },
  {
    id: "pizza-5",
    name: "BBQ Bacon Chicken",
    price: 45,
    description: "bacon, chicken, mozzarella",
    category: "Pizza",
    servingSize: "14″ – 8 Slices"
  },
  {
    id: "pizza-6",
    name: "Meat Lover's",
    price: 45,
    description: "pepperoni, genoa salami, bacon, ham, spicy Italian sausage, mozzarella",
    category: "Pizza",
    servingSize: "14″ – 8 Slices"
  },
  
  // HOT DOGS AND FRIES category (new)
  {
    id: "hotdog-1",
    name: "Tater Tots",
    price: 40,
    description: "sriracha maple mayo",
    category: "Hot Dogs and Fries",
    dietaryInfo: {
      vegetarian: true
    },
    servingSize: "Serves 8"
  },
  {
    id: "hotdog-2",
    name: "Fries",
    price: 40,
    category: "Hot Dogs and Fries",
    dietaryInfo: {
      vegetarian: true
    },
    servingSize: "Serves 8"
  },
  {
    id: "hotdog-3",
    name: "Onion Rings",
    price: 40,
    category: "Hot Dogs and Fries",
    dietaryInfo: {
      vegetarian: true
    },
    servingSize: "Serves 8"
  },
  {
    id: "hotdog-4",
    name: "Nathan's Hot Dogs",
    price: 80,
    description: "classic condiments",
    category: "Hot Dogs and Fries",
    servingSize: "Serves 6"
  },
  
  // ENTRÉES category (new)
  {
    id: "entree-1",
    name: "Handmade Ricotta Ravioli",
    price: 310,
    description: "homemade tomato sauce",
    category: "Entrées",
    dietaryInfo: {
      vegetarian: true
    },
    servingSize: "Serves 8"
  },
  {
    id: "entree-2",
    name: "BC Sablefish",
    price: 440,
    description: "shiitake mushrooms, bok choy, quinoa, carrots",
    category: "Entrées",
    dietaryInfo: {
      oceanwise: true
    },
    servingSize: "Serves 8"
  },
  {
    id: "entree-3",
    name: "Canucks Mixed Grill",
    price: 515,
    description: "marinated steak, grilled lamb chops, smoked sausage",
    category: "Entrées",
    servingSize: "Serves 8"
  },
  {
    id: "entree-4",
    name: "Beef Tenderloin",
    price: 540,
    description: "grilled vegetables, truffle roasted potatoes, shishito peppers",
    category: "Entrées",
    servingSize: "Serves 8"
  },
  
  // DESSERT category (new)
  {
    id: "dessert-1",
    name: "Chocolate Chip Cookies",
    price: 65,
    category: "Dessert",
    dietaryInfo: {
      vegetarian: true
    },
    servingSize: "Serves 8"
  },
  {
    id: "dessert-2",
    name: "Oatmeal, Raisin & Walnut Cookies",
    price: 65,
    category: "Dessert",
    dietaryInfo: {
      vegetarian: true
    },
    servingSize: "Serves 8"
  },
  {
    id: "dessert-3",
    name: "Nanaimo Bars",
    price: 70,
    category: "Dessert",
    dietaryInfo: {
      vegetarian: true
    },
    servingSize: "Serves 8"
  },
  {
    id: "dessert-4",
    name: "Dessert Platter",
    price: 100,
    description: "raspberry chocolate cake, carrot cake, blueberry cheesecake, banana cream tart, peanut butter bar, lemon brownie",
    category: "Dessert",
    dietaryInfo: {
      vegetarian: true
    },
    servingSize: "Serves 8"
  },
  {
    id: "dessert-5",
    name: "Selection of Haagen-Dazs Ice Cream Bars",
    price: 8,
    category: "Dessert",
    dietaryInfo: {
      vegetarian: true
    },
    servingSize: "Each"
  },
  {
    id: "dessert-6",
    name: "Gelato Cups",
    price: 8.25,
    description: "seasonal flavors",
    category: "Dessert",
    dietaryInfo: {
      vegetarian: true
    },
    servingSize: "Each"
  }
];

// Get the menu items for a specific category or all
export const getMenuItems = (category?: string): MenuItem[] => {
  if (category) {
    return menuCatalog.filter(item => item.category.toLowerCase() === category.toLowerCase());
  }
  return menuCatalog;
};

// Get a random menu item for order generation
const getRandomMenuItem = (category?: string): MenuItem => {
  const availableItems = category ? 
    menuCatalog.filter(item => item.category.toLowerCase() === category.toLowerCase()) : 
    menuCatalog;
  
  return availableItems[Math.floor(Math.random() * availableItems.length)];
};

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
  
  // Create a 3-digit suite ID (e.g., 201, 545)
  const suiteId = `${suiteLevel[0]}${suiteNumber.toString().padStart(2, '0')}`;
  
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

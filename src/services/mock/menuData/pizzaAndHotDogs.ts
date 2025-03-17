
import { MenuItem } from "../../types/menuTypes";

// PIZZA category
export const pizzas: MenuItem[] = [
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
  }
];

// HOT DOGS AND FRIES category
export const hotDogsAndFries: MenuItem[] = [
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
  }
];

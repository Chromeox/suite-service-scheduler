
import { MenuItem } from "../../types/menuTypes";

// SNACKS category
export const snacks: MenuItem[] = [
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
  }
];

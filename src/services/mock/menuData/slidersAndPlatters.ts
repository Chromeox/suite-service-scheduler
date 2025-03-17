
import { MenuItem } from "../../types/menuTypes";

// SLIDERS category
export const sliders: MenuItem[] = [
  {
    id: "slider-1",
    name: "Classic Cheeseburger Sliders",
    price: 130,
    category: "Sliders",
    servingSize: "12 Pieces",
    addons: [
      { name: "bacon", price: 12 }
    ]
  }
];

// COLD PLATTERS category
export const coldPlatters: MenuItem[] = [
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
  }
];


import { MenuItem } from "../../types/menuTypes";

// ENTRÉES category
export const entrees: MenuItem[] = [
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
  }
];

// DESSERT category
export const desserts: MenuItem[] = [
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

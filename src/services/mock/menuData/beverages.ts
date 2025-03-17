
import { MenuItem } from "../../types/menuTypes";

// WATER category
export const water: MenuItem[] = [
  {
    id: "water-1",
    name: "Canucks Bottled Water (6-Pack)",
    price: 32,
    category: "Water",
    servingSize: "6 Bottles"
  },
  {
    id: "water-2",
    name: "Bubly (6-Pack)",
    price: 30,
    description: "Strawberry, Cherry, Lime",
    category: "Water",
    servingSize: "6 Cans"
  },
  {
    id: "water-3",
    name: "Coconut Water (4-Pack)",
    price: 26,
    category: "Water",
    servingSize: "4 Bottles"
  },
  {
    id: "water-4",
    name: "Montellier",
    price: 12,
    category: "Water",
    servingSize: "1 L"
  }
];

// ASSORTED JUICES category
export const assortedJuices: MenuItem[] = [
  {
    id: "juice-1",
    name: "Assorted Juices (4-Pack)",
    price: 24,
    description: "Mott's Clamato Juice, Dole Ruby Red Grapefruit Juice, Tropicana Orange Juice, Ocean Spray Cranberry Juice",
    category: "Assorted Juices",
    servingSize: "4 Bottles"
  }
];

// SPORT & ENERGY DRINKS category
export const sportAndEnergyDrinks: MenuItem[] = [
  {
    id: "sport-1",
    name: "Gatorade (4-Pack)",
    price: 30,
    category: "Sport & Energy Drinks",
    servingSize: "4 Bottles"
  },
  {
    id: "sport-2",
    name: "Rockstar Energy Drink (4-Pack)",
    price: 52,
    category: "Sport & Energy Drinks",
    servingSize: "4 Cans"
  }
];

// SOFT DRINKS category
export const softDrinks: MenuItem[] = [
  {
    id: "soft-1",
    name: "Soft Drinks (6-Pack)",
    price: 30,
    description: "Pepsi, Diet Pepsi, 7-UP, Diet 7-UP, Ginger Ale, Tonic Water, Club Soda",
    category: "Soft Drinks",
    servingSize: "6 Cans"
  }
];

// HOT BEVERAGES category
export const hotBeverages: MenuItem[] = [
  {
    id: "hot-1",
    name: "Hot Beverages",
    price: 40,
    description: "Freshly Brewed Coffee, Decaffeinated Coffee, Tea",
    category: "Hot Beverages",
    servingSize: "Serves 6"
  }
];

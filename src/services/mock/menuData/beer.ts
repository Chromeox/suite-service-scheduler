
import { MenuItem } from "../../types/menuTypes";

// DOMESTIC BEER category
export const domesticBeer: MenuItem[] = [
  {
    id: "dom-beer-1",
    name: "Molson Canadian (6-Pack)",
    price: 58,
    category: "Domestic Beer",
    servingSize: "6 Bottles"
  },
  {
    id: "dom-beer-2",
    name: "Coors Light (6-Pack)",
    price: 58,
    category: "Domestic Beer",
    servingSize: "6 Bottles"
  },
  {
    id: "dom-beer-3",
    name: "Coors Original (6-Pack)",
    price: 58,
    category: "Domestic Beer",
    servingSize: "6 Bottles"
  }
];

// IMPORT BEER category
export const importBeer: MenuItem[] = [
  {
    id: "imp-beer-1",
    name: "Heineken (6-Pack)",
    price: 60,
    category: "Import Beer",
    servingSize: "6 Bottles"
  },
  {
    id: "imp-beer-2",
    name: "Dos Equis (6-Pack)",
    price: 60,
    category: "Import Beer",
    servingSize: "6 Bottles"
  },
  {
    id: "imp-beer-3",
    name: "Madri (6-Pack)",
    price: 60,
    category: "Import Beer",
    servingSize: "6 Bottles"
  }
];

// CRAFT BEER category
export const craftBeer: MenuItem[] = [
  {
    id: "craft-beer-1",
    name: "Blue Moon Belgian-Style Wheat Ale (6-Pack)",
    price: 66,
    category: "Craft Beer",
    servingSize: "6 Bottles"
  },
  {
    id: "craft-beer-2",
    name: "Hop Valley Bubble Stash IPA (6-Pack)",
    price: 66,
    category: "Craft Beer",
    servingSize: "6 Bottles"
  },
  {
    id: "craft-beer-3",
    name: "Granville Island Pale Ale (6-Pack)",
    price: 66,
    category: "Craft Beer",
    servingSize: "6 Bottles"
  },
  {
    id: "craft-beer-4",
    name: "Superflux 'Colour and Shape' IPA (4-Pack)",
    price: 66,
    category: "Craft Beer",
    servingSize: "4 Cans"
  }
];

// SPECIALTY BEER category
export const specialtyBeer: MenuItem[] = [
  {
    id: "spec-beer-1",
    name: "Heineken 0.0 (6-Pack)",
    price: 44,
    description: "Non-Alcoholic",
    category: "Specialty Beer",
    servingSize: "6 Bottles"
  },
  {
    id: "spec-beer-2",
    name: "Whistler 'Forager' (6-Pack)",
    price: 62,
    description: "Gluten-Free",
    category: "Specialty Beer",
    dietaryInfo: {
      glutenFree: true
    },
    servingSize: "6 Bottles"
  }
];

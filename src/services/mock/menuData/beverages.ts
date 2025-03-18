
import { MenuItem } from "../../types/menuTypes";

// BEER - DOMESTIC category
export const domesticBeer: MenuItem[] = [
  {
    id: "beer-dom-1",
    name: "Budweiser",
    price: 11,
    category: "Beer - Domestic",
    servingSize: "355ml"
  },
  {
    id: "beer-dom-2",
    name: "Bud Light",
    price: 11,
    category: "Beer - Domestic",
    servingSize: "355ml"
  },
  {
    id: "beer-dom-3",
    name: "Coors Light",
    price: 11,
    category: "Beer - Domestic",
    servingSize: "355ml"
  },
  {
    id: "beer-dom-4",
    name: "Molson Canadian",
    price: 11,
    category: "Beer - Domestic",
    servingSize: "355ml"
  }
];

// BEER - IMPORT category
export const importBeer: MenuItem[] = [
  {
    id: "beer-imp-1",
    name: "Corona",
    price: 12,
    category: "Beer - Import",
    servingSize: "355ml"
  },
  {
    id: "beer-imp-2",
    name: "Heineken",
    price: 12,
    category: "Beer - Import",
    servingSize: "355ml"
  },
  {
    id: "beer-imp-3",
    name: "Stella Artois",
    price: 12,
    category: "Beer - Import",
    servingSize: "355ml"
  }
];

// BEER - CRAFT category
export const craftBeer: MenuItem[] = [
  {
    id: "beer-craft-1",
    name: "Local IPA",
    price: 13,
    category: "Beer - Craft",
    servingSize: "355ml"
  },
  {
    id: "beer-craft-2",
    name: "Seasonal Lager",
    price: 13,
    category: "Beer - Craft",
    servingSize: "355ml"
  },
  {
    id: "beer-craft-3",
    name: "Craft Pale Ale",
    price: 13,
    category: "Beer - Craft",
    servingSize: "355ml"
  }
];

// CIDERS & COOLERS category
export const cidersAndCoolers: MenuItem[] = [
  {
    id: "cider-1",
    name: "Dry Apple Cider",
    price: 12,
    category: "Ciders & Coolers",
    servingSize: "355ml"
  },
  {
    id: "cider-2",
    name: "Pear Cider",
    price: 12,
    category: "Ciders & Coolers",
    servingSize: "355ml"
  },
  {
    id: "cooler-1",
    name: "Hard Seltzer",
    price: 12,
    category: "Ciders & Coolers",
    servingSize: "355ml"
  }
];

// WINE category
export const wines: MenuItem[] = [
  {
    id: "wine-red-1",
    name: "Cabernet Sauvignon",
    price: 14,
    category: "Wine",
    servingSize: "6oz Glass"
  },
  {
    id: "wine-red-2",
    name: "Merlot",
    price: 14,
    category: "Wine",
    servingSize: "6oz Glass"
  },
  {
    id: "wine-white-1",
    name: "Chardonnay",
    price: 14,
    category: "Wine",
    servingSize: "6oz Glass"
  },
  {
    id: "wine-white-2",
    name: "Sauvignon Blanc",
    price: 14,
    category: "Wine",
    servingSize: "6oz Glass"
  },
  {
    id: "wine-sparkling-1",
    name: "Prosecco",
    price: 16,
    category: "Wine",
    servingSize: "6oz Glass"
  }
];

// SPIRITS - VODKA category
export const vodka: MenuItem[] = [
  {
    id: "spirits-vodka-1",
    name: "Premium Vodka",
    price: 13,
    category: "Spirits - Vodka",
    servingSize: "1oz"
  },
  {
    id: "spirits-vodka-2",
    name: "Ultra Premium Vodka",
    price: 15,
    category: "Spirits - Vodka",
    servingSize: "1oz"
  }
];

// SPIRITS - WHISKEY category
export const whiskey: MenuItem[] = [
  {
    id: "spirits-whiskey-1",
    name: "Canadian Whisky",
    price: 13,
    category: "Spirits - Whiskey",
    servingSize: "1oz"
  },
  {
    id: "spirits-whiskey-2",
    name: "Bourbon",
    price: 14,
    category: "Spirits - Whiskey",
    servingSize: "1oz"
  },
  {
    id: "spirits-whiskey-3",
    name: "Single Malt Scotch",
    price: 16,
    category: "Spirits - Whiskey",
    servingSize: "1oz"
  }
];

// NON-ALCOHOLIC BEVERAGES category
export const nonAlcoholicBeverages: MenuItem[] = [
  {
    id: "non-alc-1",
    name: "Bottled Water",
    price: 5,
    category: "Non-Alcoholic Beverages",
    dietaryInfo: {
      vegan: true,
      glutenFree: true
    },
    servingSize: "500ml"
  },
  {
    id: "non-alc-2",
    name: "Sparkling Water",
    price: 5,
    category: "Non-Alcoholic Beverages",
    dietaryInfo: {
      vegan: true,
      glutenFree: true
    },
    servingSize: "355ml"
  },
  {
    id: "non-alc-3",
    name: "Coca Cola",
    price: 5,
    category: "Non-Alcoholic Beverages",
    servingSize: "355ml"
  },
  {
    id: "non-alc-4",
    name: "Diet Coke",
    price: 5,
    category: "Non-Alcoholic Beverages",
    servingSize: "355ml"
  },
  {
    id: "non-alc-5",
    name: "Sprite",
    price: 5,
    category: "Non-Alcoholic Beverages",
    servingSize: "355ml"
  },
  {
    id: "non-alc-6",
    name: "Orange Juice",
    price: 6,
    category: "Non-Alcoholic Beverages",
    dietaryInfo: {
      vegan: true,
      glutenFree: true
    },
    servingSize: "355ml"
  },
  {
    id: "non-alc-7",
    name: "Apple Juice",
    price: 6,
    category: "Non-Alcoholic Beverages",
    dietaryInfo: {
      vegan: true,
      glutenFree: true
    },
    servingSize: "355ml"
  },
  {
    id: "non-alc-8",
    name: "Coffee",
    price: 5,
    category: "Non-Alcoholic Beverages",
    dietaryInfo: {
      vegan: true,
      glutenFree: true
    },
    servingSize: "12oz"
  },
  {
    id: "non-alc-9",
    name: "Tea",
    price: 5,
    category: "Non-Alcoholic Beverages",
    dietaryInfo: {
      vegan: true,
      glutenFree: true
    },
    servingSize: "12oz"
  }
];

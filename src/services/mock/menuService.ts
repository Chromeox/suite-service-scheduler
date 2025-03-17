
import { MenuItem } from "../types/menuTypes";
import { menuCatalog } from "./menuData";

// Group categories to help with the menu display
export const menuCategoryGroups = {
  food: [
    "Snacks", 
    "Appetizers", 
    "Salads", 
    "Sushi Platters", 
    "Sliders", 
    "Cold Platters", 
    "Pizza", 
    "Hot Dogs and Fries", 
    "Entrées", 
    "Dessert"
  ],
  beer: [
    "Domestic Beer", 
    "Import Beer", 
    "Craft Beer", 
    "Specialty Beer"
  ],
  wine: [
    "White Wine", 
    "Red Wine", 
    "Sparkling Wine"
  ],
  spirits: [
    "Caesar Bar",
    "Vodka", 
    "Gin", 
    "Rum", 
    "Tequila", 
    "Canadian Whisky", 
    "American Whiskey", 
    "Irish Whiskey", 
    "Blended Scotch", 
    "Single Malt Scotch", 
    "Cognac & Brandy"
  ],
  other: [
    "Cider", 
    "Coolers"
  ],
  nonAlcoholic: [
    "Water", 
    "Assorted Juices", 
    "Sport & Energy Drinks", 
    "Soft Drinks", 
    "Hot Beverages"
  ]
};

// Get unique categories from the catalog
export const getMenuCategories = (): string[] => {
  return Array.from(new Set(menuCatalog.map(item => item.category)));
};

// Get the menu items for a specific category or all
export const getMenuItems = (category?: string): MenuItem[] => {
  if (category) {
    return menuCatalog.filter(item => item.category.toLowerCase() === category.toLowerCase());
  }
  return menuCatalog;
};

// Get the menu items for a specific category group
export const getMenuItemsByGroup = (group: keyof typeof menuCategoryGroups): MenuItem[] => {
  const categories = menuCategoryGroups[group];
  return menuCatalog.filter(item => categories.includes(item.category));
};

// Get a random menu item for order generation
export const getRandomMenuItem = (category?: string): MenuItem => {
  const availableItems = category ? 
    menuCatalog.filter(item => item.category.toLowerCase() === category.toLowerCase()) : 
    menuCatalog;
  
  return availableItems[Math.floor(Math.random() * availableItems.length)];
};

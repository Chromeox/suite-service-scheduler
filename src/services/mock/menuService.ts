
import { MenuItem } from "../types/menuTypes";
import { menuCatalog } from "./menuData";

// Get the menu items for a specific category or all
export const getMenuItems = (category?: string): MenuItem[] => {
  if (category) {
    return menuCatalog.filter(item => item.category.toLowerCase() === category.toLowerCase());
  }
  return menuCatalog;
};

// Get a random menu item for order generation
export const getRandomMenuItem = (category?: string): MenuItem => {
  const availableItems = category ? 
    menuCatalog.filter(item => item.category.toLowerCase() === category.toLowerCase()) : 
    menuCatalog;
  
  return availableItems[Math.floor(Math.random() * availableItems.length)];
};

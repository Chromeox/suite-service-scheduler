
import { MenuItem } from "../../types/menuTypes";
import { snacks } from "./snacks";
import { appetizers } from "./appetizers";
import { salads, sushiPlatters } from "./saladsAndSushi";
import { sliders, coldPlatters } from "./slidersAndPlatters";
import { pizzas, hotDogsAndFries } from "./pizzaAndHotDogs";
import { entrees, desserts } from "./entreesAndDesserts";

// Combine all menu categories into one catalog
export const menuCatalog: MenuItem[] = [
  ...snacks,
  ...appetizers,
  ...salads,
  ...sushiPlatters,
  ...sliders,
  ...coldPlatters,
  ...pizzas,
  ...hotDogsAndFries,
  ...entrees,
  ...desserts
];

// Export individual categories for direct access
export {
  snacks,
  appetizers,
  salads,
  sushiPlatters,
  sliders,
  coldPlatters,
  pizzas,
  hotDogsAndFries,
  entrees,
  desserts
};

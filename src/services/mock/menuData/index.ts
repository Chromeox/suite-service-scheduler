
import { MenuItem } from "../../types/menuTypes";
import { snacks } from "./snacks";
import { appetizers } from "./appetizers";
import { salads, sushiPlatters } from "./saladsAndSushi";
import { sliders, coldPlatters } from "./slidersAndPlatters";
import { pizzas, hotDogsAndFries } from "./pizzaAndHotDogs";
import { entrees, desserts } from "./entreesAndDesserts";
import { 
  domesticBeer, 
  importBeer, 
  craftBeer, 
  specialtyBeer 
} from "./beer";
import { cider, coolers } from "./cidersAndCoolers";
import { 
  caesarBar, 
  vodka, 
  gin, 
  rum 
} from "./spirits";
import { 
  tequila, 
  canadianWhisky, 
  americanWhiskey, 
  irishWhiskey, 
  blendedScotch, 
  singleMaltScotch, 
  cognacAndBrandy 
} from "./tequilaAndWhiskey";
import { 
  water, 
  assortedJuices, 
  sportAndEnergyDrinks, 
  softDrinks, 
  hotBeverages 
} from "./beverages";

// Combine all menu categories into one catalog
export const menuCatalog: MenuItem[] = [
  // Food items
  ...snacks,
  ...appetizers,
  ...salads,
  ...sushiPlatters,
  ...sliders,
  ...coldPlatters,
  ...pizzas,
  ...hotDogsAndFries,
  ...entrees,
  ...desserts,
  
  // Alcoholic beverages
  ...domesticBeer,
  ...importBeer,
  ...craftBeer,
  ...specialtyBeer,
  ...cider,
  ...coolers,
  ...caesarBar,
  ...vodka,
  ...gin,
  ...rum,
  ...tequila,
  ...canadianWhisky,
  ...americanWhiskey,
  ...irishWhiskey,
  ...blendedScotch,
  ...singleMaltScotch,
  ...cognacAndBrandy,
  
  // Non-alcoholic beverages
  ...water,
  ...assortedJuices,
  ...sportAndEnergyDrinks,
  ...softDrinks,
  ...hotBeverages
];

// Export individual categories for direct access
export {
  // Food categories
  snacks,
  appetizers,
  salads,
  sushiPlatters,
  sliders,
  coldPlatters,
  pizzas,
  hotDogsAndFries,
  entrees,
  desserts,
  
  // Beer categories
  domesticBeer,
  importBeer,
  craftBeer,
  specialtyBeer,
  
  // Cider and coolers
  cider,
  coolers,
  
  // Spirits
  caesarBar,
  vodka,
  gin,
  rum,
  
  // Whiskey and tequila
  tequila,
  canadianWhisky,
  americanWhiskey,
  irishWhiskey,
  blendedScotch,
  singleMaltScotch,
  cognacAndBrandy,
  
  // Non-alcoholic beverages
  water,
  assortedJuices,
  sportAndEnergyDrinks,
  softDrinks,
  hotBeverages
};

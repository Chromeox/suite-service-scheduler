
// Define types for menu items and related structures
export interface MenuItem {
  id: string;
  name: string;
  price: number;
  description?: string;
  category: string;
  dietaryInfo?: {
    vegetarian?: boolean;
    vegan?: boolean;
    glutenFree?: boolean;
    oceanwise?: boolean;
  };
  servingSize?: string;
  addons?: Array<{name: string, price: number}>;
}

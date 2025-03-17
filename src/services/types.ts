
// Type definitions for the services layer
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

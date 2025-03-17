
// Re-export all order service functions from the new structure
export { fetchOrders, updateOrderStatus, addOrder } from './orders';

// Re-export menu-related functions from the new mock structure
export { getMenuItems } from './mock/menuService';
export type { MenuItem } from './types/menuTypes';

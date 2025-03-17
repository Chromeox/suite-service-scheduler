
// Re-export all order service functions from the new structure
export { fetchOrders, updateOrderStatus, addOrder } from './orders';

// Re-export menu-related functions from the new mock structure
export { getMenuItems, menuCatalog } from './mock/menuService';
export { MenuItem } from './types/menuTypes';

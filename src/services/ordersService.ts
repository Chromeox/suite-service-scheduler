
// Re-export all order service functions from the new structure
export { fetchOrders, updateOrderStatus, addOrder } from './orders';

// Re-export menu-related functions from the mock service
export { getMenuItems, menuCatalog } from './mockOrdersService';

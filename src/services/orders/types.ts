
import { Order, OrderItem } from "@/components/orders/types";

// Helper function to format order items from database response
export const formatOrderItems = (itemsData: any[] | null): OrderItem[] => {
  if (!itemsData) return [];
  
  return itemsData.map(item => ({
    name: item.item_name,
    quantity: item.quantity,
    // Handle case where status field might not exist yet
    status: item.status || 'pending'
  }));
};

// Helper function to safely get suite info
export const getSuiteInfo = (orderData: any) => {
  // Handle potential errors or missing data
  if (!orderData || !orderData.suites) {
    return {
      suiteId: '',
      suiteName: '',
      location: ''
    };
  }
  
  return {
    suiteId: orderData.suites.suite_id || '',
    suiteName: orderData.suites.name || '',
    location: orderData.suites.location || ''
  };
};

// Helper function to format a single order
export const formatOrder = (orderData: any, items: OrderItem[]): Order => {
  if (!orderData) {
    // Return a default order if data is missing
    return {
      id: 'unknown',
      suiteId: '',
      suiteName: '',
      location: '',
      items: [],
      status: 'unknown',
      createdAt: new Date().toISOString(),
      deliveryTime: new Date().toISOString(),
      isPreOrder: false
    };
  }
  
  const suiteInfo = getSuiteInfo(orderData);
  
  return {
    id: `ORD-${orderData.id}`,
    ...suiteInfo,
    items,
    status: orderData.status || 'pending',
    createdAt: orderData.created_at || new Date().toISOString(),
    // Handle cases where these columns might not exist yet
    deliveryTime: orderData.delivery_time || new Date().toISOString(),
    isPreOrder: orderData.is_pre_order || false
  };
};

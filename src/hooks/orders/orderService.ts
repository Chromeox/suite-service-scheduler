
import { fetchOrders, updateOrderStatus, addOrder } from "@/services/orders";
import { 
  fetchMockOrders, 
  updateMockOrderStatus, 
  addMockOrder 
} from "@/services/mock/mockOrdersApi";

// Flag to use mock data during development
const USE_MOCK_DATA = true;

// Determine which service functions to use based on the flag
export const getOrderService = () => ({
  fetch: USE_MOCK_DATA ? fetchMockOrders : fetchOrders,
  update: USE_MOCK_DATA ? updateMockOrderStatus : updateOrderStatus,
  add: USE_MOCK_DATA ? addMockOrder : addOrder
});

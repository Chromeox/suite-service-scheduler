
import { supabase } from "@/integrations/supabase/client";
import { Order, OrderItem } from "@/components/orders/types";
import { formatOrderItems, formatOrder } from "./types";

// Function to fetch order items for a specific order
export const fetchOrderItems = async (orderId: number): Promise<OrderItem[]> => {
  try {
    const { data: itemsData, error: itemsError } = await supabase
      .from("order_items")
      .select("*")
      .eq("order_id", orderId);
      
    if (itemsError) {
      console.error(`Error fetching items for order ${orderId}:`, itemsError);
      return [];
    }
    
    return formatOrderItems(itemsData);
  } catch (error) {
    console.error(`Error in fetchOrderItems for order ${orderId}:`, error);
    return [];
  }
};

// Function to fetch orders with related suite info
export const fetchOrders = async (roleFilter?: string): Promise<Order[]> => {
  try {
    // Fetch orders from Supabase
    const { data: ordersData, error: ordersError } = await supabase
      .from("orders")
      .select(`
        id,
        status,
        notes,
        created_at,
        updated_at,
        suite_id,
        user_id,
        suites:suite_id (
          suite_id,
          name,
          location
        )
      `)
      .order("created_at", { ascending: false });

    if (ordersError) {
      console.error("Error fetching orders:", ordersError);
      throw new Error(ordersError.message);
    }
    
    if (!ordersData) {
      return [];
    }
    
    // Fetch order items for each order
    const ordersWithItems = await Promise.all(
      ordersData.map(async (order) => {
        if (!order || typeof order.id !== 'number') {
          console.error("Invalid order data:", order);
          // Return a default order if the order data is invalid
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
        
        const items = await fetchOrderItems(order.id);
        return formatOrder(order, items);
      })
    );
    
    // Apply role-based filtering if needed
    if (roleFilter === "attendant") {
      // For attendants, we might want to filter for their assigned suites
      return ordersWithItems.filter(order => 
        order.suiteId.startsWith("200") || 
        order.suiteId.startsWith("500")
      );
    }
    
    return ordersWithItems;
  } catch (error) {
    console.error("Error in fetchOrders:", error);
    return [];
  }
};

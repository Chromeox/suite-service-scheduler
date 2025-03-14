
import { supabase } from "@/integrations/supabase/client";
import { Order, OrderItem } from "@/components/orders/types";

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
        is_pre_order,
        delivery_time,
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
        const { data: itemsData, error: itemsError } = await supabase
          .from("order_items")
          .select("*")
          .eq("order_id", order.id);
          
        if (itemsError) {
          console.error(`Error fetching items for order ${order.id}:`, itemsError);
          return {
            ...order,
            items: []
          };
        }
        
        // Format order items with proper type checking
        const items: OrderItem[] = itemsData ? itemsData.map(item => ({
          name: item.item_name,
          quantity: item.quantity,
          // If status field doesn't exist yet (migration not applied), default to 'pending'
          status: (item as any).status || 'pending'
        })) : [];
        
        // Format to match our app's Order type with proper null checking
        return {
          id: `ORD-${order.id}`,
          suiteId: order.suites?.suite_id || '',
          suiteName: order.suites?.name || '',
          location: order.suites?.location || '',
          items,
          status: order.status || 'pending',
          createdAt: order.created_at,
          // Handle case where column doesn't exist yet
          deliveryTime: (order as any).delivery_time || new Date().toISOString(),
          isPreOrder: (order as any).is_pre_order || false
        };
      })
    );
    
    // Apply role-based filtering if needed
    if (roleFilter === "attendant") {
      // For attendants, we might want to filter for their assigned suites
      // This is a placeholder - in a real implementation, we'd check 
      // the suite assignments table for the current user
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

// Function to update order status
export const updateOrderStatus = async (
  orderId: string, 
  newStatus: string
): Promise<void> => {
  try {
    // Extract the numeric id from the formatted ID (e.g., "ORD-123" -> 123)
    const numericId = parseInt(orderId.replace("ORD-", ""));
    
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", numericId);
      
    if (error) {
      console.error("Error updating order status:", error);
      throw new Error(error.message);
    }
  } catch (error) {
    console.error("Error in updateOrderStatus:", error);
    throw error;
  }
};

// Function to add a new order
export const addOrder = async (
  suiteId: string,
  items: { name: string; quantity: number }[],
  isPreOrder: boolean = false,
  deliveryTime?: string
): Promise<Order> => {
  try {
    // First, find the suite in the database by suite_id
    const { data: suiteData, error: suiteError } = await supabase
      .from("suites")
      .select("id, name, location")
      .eq("suite_id", suiteId)
      .single();
      
    if (suiteError) {
      console.error("Error finding suite:", suiteError);
      throw new Error(`Suite with ID ${suiteId} not found`);
    }
    
    if (!suiteData) {
      throw new Error(`Suite with ID ${suiteId} not found`);
    }
    
    // Create the order data with proper handling for new columns
    const orderData = {
      suite_id: suiteData.id,
      status: 'pending',
      user_id: (await supabase.auth.getUser()).data.user?.id
    } as any; // Use 'any' temporarily to add optional fields
    
    // Add new fields if they're expected to exist in the database
    if (isPreOrder !== undefined) {
      orderData.is_pre_order = isPreOrder;
    }
    
    if (deliveryTime) {
      orderData.delivery_time = deliveryTime;
    } else {
      orderData.delivery_time = new Date(Date.now() + 45 * 60000).toISOString(); // 45 minutes from now
    }
    
    // Insert the order
    const { data: newOrderData, error: orderError } = await supabase
      .from("orders")
      .insert(orderData)
      .select()
      .single();
      
    if (orderError) {
      console.error("Error creating order:", orderError);
      throw new Error(orderError.message);
    }
    
    if (!newOrderData) {
      throw new Error("Failed to create order");
    }
    
    // Insert the order items
    const orderItems = items.map(item => ({
      order_id: newOrderData.id,
      item_name: item.name,
      quantity: item.quantity,
      status: 'pending'
    }));
    
    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);
      
    if (itemsError) {
      console.error("Error creating order items:", itemsError);
      throw new Error(itemsError.message);
    }
    
    // Return the newly created order in our app's format
    return {
      id: `ORD-${newOrderData.id}`,
      suiteId: suiteId,
      suiteName: suiteData.name,
      location: suiteData.location,
      items: items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        status: 'pending'
      })),
      status: 'pending',
      createdAt: newOrderData.created_at,
      // Handle the case where the column might not exist yet
      deliveryTime: (newOrderData as any).delivery_time || new Date().toISOString(),
      isPreOrder: (newOrderData as any).is_pre_order || false
    };
  } catch (error) {
    console.error("Error in addOrder:", error);
    throw error;
  }
};

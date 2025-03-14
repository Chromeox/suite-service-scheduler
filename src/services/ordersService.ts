
import { supabase } from "@/integrations/supabase/client";
import { Order, OrderItem } from "@/components/orders/types";

// Helper function to format order items from database response
const formatOrderItems = (itemsData: any[] | null): OrderItem[] => {
  if (!itemsData) return [];
  
  return itemsData.map(item => ({
    name: item.item_name,
    quantity: item.quantity,
    // Handle case where status field might not exist yet
    status: item.status || 'pending'
  }));
};

// Helper function to safely get suite info
const getSuiteInfo = (orderData: any) => {
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
const formatOrder = (orderData: any, items: OrderItem[]): Order => {
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

// Function to fetch order items for a specific order
const fetchOrderItems = async (orderId: number): Promise<OrderItem[]> => {
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

// Function to find a suite by ID
const findSuiteById = async (suiteId: string) => {
  const { data, error } = await supabase
    .from("suites")
    .select("id, name, location")
    .eq("suite_id", suiteId)
    .single();
    
  if (error) {
    console.error("Error finding suite:", error);
    throw new Error(`Suite with ID ${suiteId} not found`);
  }
  
  if (!data) {
    throw new Error(`Suite with ID ${suiteId} not found`);
  }
  
  return data;
};

// Function to create order items
const createOrderItems = async (
  orderId: number, 
  items: { name: string; quantity: number }[]
) => {
  const orderItems = items.map(item => ({
    order_id: orderId,
    item_name: item.name,
    quantity: item.quantity,
    status: 'pending'
  }));
  
  const { error } = await supabase
    .from("order_items")
    .insert(orderItems);
    
  if (error) {
    console.error("Error creating order items:", error);
    throw new Error(error.message);
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
    // Find the suite by ID
    const suiteData = await findSuiteById(suiteId);
    
    // Ensure suite_id is properly included
    if (!suiteData || !suiteData.id) {
      throw new Error(`Invalid suite data: ${JSON.stringify(suiteData)}`);
    }
    
    // Prepare order data with required suite_id property
    const orderData = {
      suite_id: suiteData.id,
      status: 'pending',
      user_id: (await supabase.auth.getUser()).data.user?.id
    } as any;
    
    // Add optional fields
    if (isPreOrder !== undefined) {
      orderData.is_pre_order = isPreOrder;
    }
    
    if (deliveryTime) {
      orderData.delivery_time = deliveryTime;
    } else {
      orderData.delivery_time = new Date(Date.now() + 45 * 60000).toISOString(); // 45 mins from now
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
    
    // Create order items
    await createOrderItems(newOrderData.id, items);
    
    // Format order items for response
    const formattedItems: OrderItem[] = items.map(item => ({
      name: item.name,
      quantity: item.quantity,
      status: 'pending'
    }));
    
    // Return the newly created order
    return {
      id: `ORD-${newOrderData.id}`,
      suiteId,
      suiteName: suiteData.name,
      location: suiteData.location,
      items: formattedItems,
      status: 'pending',
      createdAt: newOrderData.created_at,
      // Handle potential missing columns
      deliveryTime: orderData.delivery_time,
      isPreOrder: !!orderData.is_pre_order
    };
  } catch (error) {
    console.error("Error in addOrder:", error);
    throw error;
  }
};

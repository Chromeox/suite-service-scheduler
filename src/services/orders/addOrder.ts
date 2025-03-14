
import { supabase } from "@/integrations/supabase/client";
import { Order, OrderItem } from "@/components/orders/types";

// Function to find a suite by ID
export const findSuiteById = async (suiteId: string) => {
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
export const createOrderItems = async (
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

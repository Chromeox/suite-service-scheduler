
import { supabase } from "@/integrations/supabase/client";

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

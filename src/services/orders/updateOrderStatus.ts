
import { supabase } from "@/integrations/supabase/client";

// Function to update order status
export const updateOrderStatus = async (
  orderId: string, 
  newStatus: string
): Promise<void> => {
  try {
    // Extract the numeric id from the formatted ID (e.g., "ORD-123" -> 123)
    const numericId = parseInt(orderId.replace("ORD-", ""));
    
    // Log the status change request for audit purposes
    console.log(`Updating order ${orderId} to status: ${newStatus}`);
    
    const { error } = await supabase
      .from("orders")
      .update({ 
        status: newStatus,
        updated_at: new Date().toISOString() 
      })
      .eq("id", numericId);
      
    if (error) {
      console.error("Error updating order status:", error);
      throw new Error(error.message);
    }
    
    console.log(`Successfully updated order ${orderId} to status: ${newStatus}`);
  } catch (error) {
    console.error("Error in updateOrderStatus:", error);
    throw error;
  }
};


import { useQuery } from "@tanstack/react-query";
import { getOrderService } from "./orderService";

// Function to set up query for fetching orders
export const useOrdersQuery = (role?: string) => {
  const orderService = getOrderService();
  
  return useQuery({
    queryKey: ['orders', role],
    queryFn: () => orderService.fetch(role),
  });
};

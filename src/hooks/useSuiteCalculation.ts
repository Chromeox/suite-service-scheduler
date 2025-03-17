
import { useQuery } from "@tanstack/react-query";
import { getMenuItems } from "@/services/mock";

export const useSuiteCalculation = (suiteId: string | undefined) => {
  // Fetch menu items for price calculation
  const { data: menuItems = [] } = useQuery({
    queryKey: ["menuItems"],
    queryFn: () => getMenuItems(),
  });

  // Calculate total before tax based on actual menu items
  const calculateTotal = () => {
    if (!menuItems.length || !suiteId) return 0;
    
    // Use suite id to determine how many menu items to include in calculation
    const itemCount = Math.min(parseInt(suiteId), 5); // Limit to max 5 items
    
    // Get first N menu items based on suite id and sum their prices
    return menuItems
      .slice(0, itemCount)
      .reduce((total, item) => total + item.price, 0);
  };

  return { totalBeforeTax: calculateTotal() };
};

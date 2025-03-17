
import { useState, useEffect } from "react";
import { Order } from "@/components/orders/types";
import { getOrderedSuiteRange } from "../utils/suiteUtils";

export const useOrdersListState = (orders: Order[], isMobile: boolean) => {
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>('asc'); // Default to ascending
  const [expandedOrderIds, setExpandedOrderIds] = useState<string[]>([]);
  const [startSuite, setStartSuite] = useState<string>("");
  const [endSuite, setEndSuite] = useState<string>("");

  // Load saved filter values from localStorage on component mount
  useEffect(() => {
    const savedStartSuite = localStorage.getItem('orderFilterStartSuite');
    const savedEndSuite = localStorage.getItem('orderFilterEndSuite');
    
    if (savedStartSuite || savedEndSuite) {
      // Apply ordering to ensure lowest to highest when loading from storage
      const { min, max } = getOrderedSuiteRange(savedStartSuite || "", savedEndSuite || "");
      setStartSuite(min);
      setEndSuite(max);
    }
  }, []);

  // Save filter values to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('orderFilterStartSuite', startSuite);
    localStorage.setItem('orderFilterEndSuite', endSuite);
  }, [startSuite, endSuite]);

  // Filtering orders based on suite range
  const filteredOrders = (startSuite || endSuite) 
    ? orders.filter(order => {
        const { min, max } = getOrderedSuiteRange(startSuite, endSuite);
        const suiteNum = order.suiteId;
        const inRangeStart = !min || suiteNum >= min;
        const inRangeEnd = !max || suiteNum <= max;
        return inRangeStart && inRangeEnd;
      })
    : orders;

  // Sort orders by level and then by suite number in ascending order
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    // First, separate 200s and 500s (200s should come first)
    const aIsLevel2 = a.suiteId.startsWith('2');
    const bIsLevel2 = b.suiteId.startsWith('2');
    
    if (aIsLevel2 && !bIsLevel2) return -1; // 200s come before 500s
    if (!aIsLevel2 && bIsLevel2) return 1;  // 500s come after 200s
    
    // Within the same level, sort in ascending order (lowest to highest)
    return a.suiteId.localeCompare(b.suiteId, undefined, { numeric: true });
  });

  const toggleSort = (direction: 'asc' | 'desc') => {
    if (sortDirection === direction) {
      setSortDirection(null); // Reset sorting
    } else {
      setSortDirection(direction);
    }
  };

  const toggleOrderExpand = (orderId: string) => {
    if (expandedOrderIds.includes(orderId)) {
      setExpandedOrderIds(expandedOrderIds.filter(id => id !== orderId));
    } else {
      setExpandedOrderIds([...expandedOrderIds, orderId]);
    }
  };

  const isOrderExpanded = (orderId: string) => {
    return expandedOrderIds.includes(orderId);
  };

  const applyRangeFilter = () => {
    // The filtering happens automatically via the filteredOrders logic
    // We just need to ensure the values in the inputs are in the correct order
    const { min, max } = getOrderedSuiteRange(startSuite, endSuite);
    setStartSuite(min);
    setEndSuite(max);
  };

  // Handle input changes
  const handleStartSuiteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartSuite(e.target.value);
  };

  const handleEndSuiteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndSuite(e.target.value);
  };

  return {
    sortDirection,
    toggleSort,
    expandedOrderIds,
    toggleOrderExpand,
    isOrderExpanded,
    startSuite,
    endSuite,
    handleStartSuiteChange,
    handleEndSuiteChange,
    applyRangeFilter,
    sortedOrders
  };
};


import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { OrdersListProps } from "./types";
import { useIsMobile } from "@/hooks/use-mobile";
import MobileOrderCard from "./list/MobileOrderCard";
import DesktopOrderTable from "./list/DesktopOrderTable";
import OrderSortControls from "./list/OrderSortControls";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const OrdersList = ({ orders, role, handleStatusChange }: OrdersListProps) => {
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);
  const [expandedOrderIds, setExpandedOrderIds] = useState<string[]>([]);
  const [startSuite, setStartSuite] = useState<string>("");
  const [endSuite, setEndSuite] = useState<string>("");
  const isMobile = useIsMobile();

  // Load saved filter values from localStorage on component mount
  useEffect(() => {
    const savedStartSuite = localStorage.getItem('orderFilterStartSuite');
    const savedEndSuite = localStorage.getItem('orderFilterEndSuite');
    
    if (savedStartSuite) setStartSuite(savedStartSuite);
    if (savedEndSuite) setEndSuite(savedEndSuite);
  }, []);

  // Save filter values to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('orderFilterStartSuite', startSuite);
    localStorage.setItem('orderFilterEndSuite', endSuite);
  }, [startSuite, endSuite]);

  // Function to format time to show only hour and minutes
  const formatDeliveryTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  // Helper function to ensure start suite is always lower than end suite
  const getOrderedSuiteRange = () => {
    if (!startSuite && !endSuite) return { min: "", max: "" };
    
    if (!startSuite) return { min: "", max: endSuite };
    if (!endSuite) return { min: startSuite, max: "" };
    
    // Compare suite numbers numerically if possible
    const startNum = parseInt(startSuite);
    const endNum = parseInt(endSuite);
    
    if (!isNaN(startNum) && !isNaN(endNum)) {
      return { 
        min: Math.min(startNum, endNum).toString(), 
        max: Math.max(startNum, endNum).toString() 
      };
    }
    
    // Fallback to string comparison
    return startSuite.localeCompare(endSuite) <= 0 
      ? { min: startSuite, max: endSuite }
      : { min: endSuite, max: startSuite };
  };

  // Filtering orders based on suite range for mobile
  const filteredOrders = isMobile && (startSuite || endSuite) 
    ? orders.filter(order => {
        const { min, max } = getOrderedSuiteRange();
        const suiteNum = order.suiteId;
        const inRangeStart = !min || suiteNum >= min;
        const inRangeEnd = !max || suiteNum <= max;
        return inRangeStart && inRangeEnd;
      })
    : orders;

  // Sort orders based on suiteId for desktop
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortDirection === null) return 0;
    if (sortDirection === 'asc') {
      return a.suiteId.localeCompare(b.suiteId, undefined, { numeric: true });
    } else {
      return b.suiteId.localeCompare(a.suiteId, undefined, { numeric: true });
    }
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
    const { min, max } = getOrderedSuiteRange();
    setStartSuite(min);
    setEndSuite(max);
  };

  // Mobile card view
  const renderMobileView = () => {
    return (
      <div className="space-y-3">
        <div className="flex flex-col space-y-2 mb-3 px-2">
          <div className="text-sm font-medium">Suite No. Range:</div>
          <div className="flex space-x-2">
            <div className="flex-1">
              <Input
                placeholder="From"
                value={startSuite}
                onChange={(e) => setStartSuite(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex-1">
              <Input
                placeholder="To"
                value={endSuite}
                onChange={(e) => setEndSuite(e.target.value)}
                className="w-full"
              />
            </div>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={applyRangeFilter}
              className="shrink-0"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {sortedOrders.length === 0 ? (
          <div className="text-center py-4 bg-muted/20 rounded-md">
            No orders found
          </div>
        ) : (
          sortedOrders.map((order) => (
            <MobileOrderCard
              key={order.id}
              order={order}
              role={role}
              handleStatusChange={handleStatusChange}
              isExpanded={isOrderExpanded(order.id)}
              toggleExpand={() => toggleOrderExpand(order.id)}
              formatDeliveryTime={formatDeliveryTime}
            />
          ))
        )}
      </div>
    );
  };

  return (
    <Card>
      <CardContent className="p-0">
        {isMobile ? (
          renderMobileView()
        ) : (
          <DesktopOrderTable
            orders={sortedOrders}
            role={role}
            handleStatusChange={handleStatusChange}
            sortDirection={sortDirection}
            toggleSort={toggleSort}
            formatDeliveryTime={formatDeliveryTime}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default OrdersList;

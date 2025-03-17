
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { OrdersListProps } from "./types";
import { useIsMobile } from "@/hooks/use-mobile";
import { useOrdersListState } from "./hooks/useOrdersListState";
import { formatDeliveryTime } from "./utils/suiteUtils";

// Components
import MobileOrderCard from "./list/MobileOrderCard";
import DesktopOrderTable from "./list/DesktopOrderTable";
import MobileSuiteRangeFilter from "./list/MobileSuiteRangeFilter";
import DesktopSuiteRangeFilter from "./list/DesktopSuiteRangeFilter";
import EmptyOrders from "./list/EmptyOrders";

const OrdersList = ({ orders, role, handleStatusChange }: OrdersListProps) => {
  const isMobile = useIsMobile();
  const {
    sortDirection,
    toggleSort,
    isOrderExpanded,
    toggleOrderExpand,
    startSuite,
    endSuite,
    handleStartSuiteChange,
    handleEndSuiteChange,
    applyRangeFilter,
    sortedOrders
  } = useOrdersListState(orders, isMobile);

  // Mobile card view
  const renderMobileView = () => {
    return (
      <div className="space-y-3">
        <MobileSuiteRangeFilter
          startSuite={startSuite}
          endSuite={endSuite}
          handleStartSuiteChange={handleStartSuiteChange}
          handleEndSuiteChange={handleEndSuiteChange}
          applyRangeFilter={applyRangeFilter}
        />
        
        {sortedOrders.length === 0 ? (
          <EmptyOrders />
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
          <>
            <DesktopSuiteRangeFilter
              startSuite={startSuite}
              endSuite={endSuite}
              handleStartSuiteChange={handleStartSuiteChange}
              handleEndSuiteChange={handleEndSuiteChange}
              applyRangeFilter={applyRangeFilter}
            />
            <DesktopOrderTable
              orders={sortedOrders}
              role={role}
              handleStatusChange={handleStatusChange}
              sortDirection={sortDirection}
              toggleSort={toggleSort}
              formatDeliveryTime={formatDeliveryTime}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default OrdersList;

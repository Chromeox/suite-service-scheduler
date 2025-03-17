
import React from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import OrderFilters from "@/components/orders/OrderFilters";
import OrderForm from "@/components/orders/OrderForm";
import OrdersContent from "@/components/orders/OrdersContent";
import { useOrders } from "@/hooks/useOrders";
import { Toaster } from "@/components/ui/toaster";

const Orders = () => {
  const { role } = useParams<{ role: string }>();
  const orderState = useOrders(role);
  
  const { 
    activeTab, setActiveTab,
    searchQuery, setSearchQuery,
    showGameDayOrderDialog, setShowGameDayOrderDialog,
    selectedFloor, setSelectedFloor,
    gameDayOrder, setGameDayOrder,
    handleAddGameDayOrder
  } = orderState;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <OrderFilters
          role={role}
          selectedFloor={selectedFloor}
          setSelectedFloor={setSelectedFloor}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setShowGameDayOrderDialog={setShowGameDayOrderDialog}
        />

        <OrdersContent orderState={orderState} role={role} />
        
        <OrderForm
          showGameDayOrderDialog={showGameDayOrderDialog}
          setShowGameDayOrderDialog={setShowGameDayOrderDialog}
          handleAddGameDayOrder={handleAddGameDayOrder}
          gameDayOrder={gameDayOrder}
          setGameDayOrder={setGameDayOrder}
        />
      </div>
      <Toaster />
    </DashboardLayout>
  );
};

export default Orders;

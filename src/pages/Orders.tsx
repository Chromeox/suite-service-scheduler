
import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import OrderFilters from "@/components/orders/OrderFilters";
import OrderForm from "@/components/orders/OrderForm";
import OrdersContent from "@/components/orders/OrdersContent";
import { useOrders } from "@/hooks/useOrders";
import { useKeyboardVisibility } from "@/hooks/use-keyboard";
import MobileBottomNav from "@/components/layout/MobileBottomNav";

const Orders = () => {
  const { role } = useParams<{ role: string }>();
  const orderState = useOrders(role);
  const contentRef = useRef<HTMLDivElement>(null);
  const { isKeyboardVisible, scrollToInput } = useKeyboardVisibility();
  
  const { 
    activeTab, setActiveTab,
    searchQuery, setSearchQuery,
    showGameDayOrderDialog, setShowGameDayOrderDialog,
    selectedFloor, setSelectedFloor,
    gameDayOrder, setGameDayOrder,
    handleAddGameDayOrder
  } = orderState;

  // Effect to handle input focus and scrolling when the keyboard is visible
  useEffect(() => {
    const handleInputFocus = (e: Event) => {
      if ((e.target instanceof HTMLInputElement || 
           e.target instanceof HTMLTextAreaElement ||
           e.target instanceof HTMLSelectElement) && 
          contentRef.current && isKeyboardVisible) {
        scrollToInput(e.target as HTMLElement);
      }
    };
    
    document.addEventListener('focus', handleInputFocus, true);
    
    return () => {
      document.removeEventListener('focus', handleInputFocus, true);
    };
  }, [isKeyboardVisible, scrollToInput]);

  return (
    <DashboardLayout>
      <div className="space-y-6" ref={contentRef}>
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
      
      {/* Add bottom padding to account for the nav bar */}
      <div className="h-16 md:h-0"></div>
      
      <MobileBottomNav />
    </DashboardLayout>
  );
};

export default Orders;

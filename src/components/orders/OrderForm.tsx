
import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OrderFormProps } from "./types";
import { MenuItem } from "@/services/types";
import MenuSection from "./form/MenuSection";
import OrderItemsList from "./form/OrderItemsList";

const OrderForm = ({ 
  showGameDayOrderDialog,
  setShowGameDayOrderDialog,
  handleAddGameDayOrder,
  gameDayOrder,
  setGameDayOrder 
}: OrderFormProps) => {
  
  // Handle item selection from the menu
  const handleSelectMenuItem = (item: MenuItem) => {
    // Check if item is already in the order
    const existingItemIndex = gameDayOrder.items.findIndex(
      orderItem => orderItem.name === item.name
    );
    
    if (existingItemIndex >= 0) {
      // Increment quantity if item already exists
      const newItems = [...gameDayOrder.items];
      newItems[existingItemIndex] = {
        ...newItems[existingItemIndex],
        quantity: newItems[existingItemIndex].quantity + 1
      };
      setGameDayOrder({...gameDayOrder, items: newItems});
    } else {
      // Add new item with quantity 1
      setGameDayOrder({
        ...gameDayOrder, 
        items: [...gameDayOrder.items, { name: item.name, quantity: 1 }]
      });
    }
  };
  
  // Update item quantity in the order
  const handleUpdateQuantity = (index: number, quantity: number) => {
    const newItems = [...gameDayOrder.items];
    newItems[index] = {...newItems[index], quantity};
    setGameDayOrder({...gameDayOrder, items: newItems});
  };
  
  // Remove an item from the order
  const handleRemoveItem = (index: number) => {
    const newItems = [...gameDayOrder.items];
    newItems.splice(index, 1);
    setGameDayOrder({...gameDayOrder, items: newItems});
  };
  
  return (
    <Dialog open={showGameDayOrderDialog} onOpenChange={setShowGameDayOrderDialog}>
      <DialogContent className="max-w-4xl h-[80vh]">
        <DialogHeader>
          <DialogTitle>Create Game Day Order</DialogTitle>
          <DialogDescription>
            Add items from the menu for immediate service to a suite.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4 h-full overflow-auto">
          {/* Left side: Menu selection */}
          <MenuSection onSelectMenuItem={handleSelectMenuItem} />
          
          {/* Right side: Current order */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="suite" className="text-sm font-medium">Suite</label>
              <Input
                id="suite"
                placeholder="Suite ID (e.g., 201)"
                value={gameDayOrder.suiteId}
                onChange={(e) => setGameDayOrder({...gameDayOrder, suiteId: e.target.value})}
              />
            </div>
            
            <OrderItemsList 
              items={gameDayOrder.items}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => setShowGameDayOrderDialog(false)}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleAddGameDayOrder} 
            disabled={gameDayOrder.items.length === 0 || !gameDayOrder.suiteId}
          >
            Create Order
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OrderForm;

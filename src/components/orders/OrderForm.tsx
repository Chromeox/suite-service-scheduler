
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { OrderFormProps } from "./types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import MenuSection from "./form/MenuSection";
import OrderItemsList from "./form/OrderItemsList";
import { useHapticFeedback } from "@/hooks/use-haptics";
import { toast } from "@/hooks/use-toast";

const OrderForm = ({
  showGameDayOrderDialog,
  setShowGameDayOrderDialog,
  handleAddGameDayOrder,
  gameDayOrder,
  setGameDayOrder,
  disabled = false
}: OrderFormProps & { disabled?: boolean }) => {
  const { successFeedback, errorFeedback } = useHapticFeedback();

  const handleSubmit = () => {
    if (disabled) {
      errorFeedback();
      toast({
        title: "Offline",
        description: "Cannot add orders while offline. Please connect to the internet.",
        variant: "destructive"
      });
      return;
    }
    
    if (!gameDayOrder.suiteId.trim()) {
      errorFeedback();
      toast({
        title: "Suite ID Required",
        description: "Please enter a suite ID",
        variant: "destructive"
      });
      return;
    }
    
    if (gameDayOrder.items.length === 0) {
      errorFeedback();
      toast({
        title: "Items Required",
        description: "Please add at least one item to the order",
        variant: "destructive"
      });
      return;
    }
    
    successFeedback();
    handleAddGameDayOrder();
  };

  return (
    <Dialog open={showGameDayOrderDialog} onOpenChange={setShowGameDayOrderDialog}>
      <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Game Day Order</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {disabled && (
            <div className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 p-3 rounded-md text-sm">
              You are currently offline. Orders created while offline will be synchronized when you reconnect.
            </div>
          )}
          
          <div className="space-y-2">
            <label htmlFor="suiteId" className="text-sm font-medium">
              Suite ID
            </label>
            <Input
              id="suiteId"
              value={gameDayOrder.suiteId}
              onChange={(e) =>
                setGameDayOrder({ ...gameDayOrder, suiteId: e.target.value })
              }
              placeholder="Enter suite ID"
            />
          </div>
          
          {gameDayOrder.items.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Order Items</h3>
              <OrderItemsList
                items={gameDayOrder.items}
                onRemove={(index) => {
                  const updatedItems = [...gameDayOrder.items];
                  updatedItems.splice(index, 1);
                  setGameDayOrder({ ...gameDayOrder, items: updatedItems });
                }}
              />
            </div>
          )}
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Add Menu Items</h3>
            <MenuSection
              onAddItem={(item) => {
                const existingItemIndex = gameDayOrder.items.findIndex(
                  (i) => i.name === item.name
                );
                
                if (existingItemIndex !== -1) {
                  const updatedItems = [...gameDayOrder.items];
                  updatedItems[existingItemIndex].quantity += 1;
                  setGameDayOrder({ ...gameDayOrder, items: updatedItems });
                } else {
                  setGameDayOrder({
                    ...gameDayOrder,
                    items: [...gameDayOrder.items, { name: item.name, quantity: 1 }],
                  });
                }
              }}
            />
          </div>
          
          <Button 
            className="w-full" 
            onClick={handleSubmit} 
            disabled={disabled && !navigator.onLine}
          >
            Add Order
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderForm;

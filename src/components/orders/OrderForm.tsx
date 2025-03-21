
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { OrderFormProps } from "./types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import MenuSection from "./form/MenuSection";
import OrderItemsList from "./form/OrderItemsList";
import { useHapticFeedback } from "@/hooks/use-haptics";
import { toast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const OrderForm = ({
  showGameDayOrderDialog,
  setShowGameDayOrderDialog,
  handleAddGameDayOrder,
  gameDayOrder,
  setGameDayOrder,
  disabled = false
}: OrderFormProps & { disabled?: boolean }) => {
  const { successFeedback, errorFeedback } = useHapticFeedback();
  
  // Generate time options from 2:00 PM to 9:30 PM in 15-minute intervals
  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 14; hour <= 21; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        // Stop at 9:30 PM
        if (hour === 21 && minute > 30) break;
        
        const hourDisplay = hour > 12 ? hour - 12 : hour;
        const amPm = hour >= 12 ? 'PM' : 'AM';
        const minuteDisplay = minute.toString().padStart(2, '0');
        const timeValue = `${hour.toString().padStart(2, '0')}:${minuteDisplay}`;
        const timeDisplay = `${hourDisplay}:${minuteDisplay} ${amPm}`;
        
        options.push({ value: timeValue, display: timeDisplay });
      }
    }
    return options;
  };
  
  const timeOptions = generateTimeOptions();
  const [selectedTime, setSelectedTime] = useState(timeOptions[0]?.value || '14:00');

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
    
    // Create a delivery time from the selected time
    const today = new Date();
    const [hours, minutes] = selectedTime.split(':').map(Number);
    today.setHours(hours, minutes, 0, 0);
    
    // Set the delivery time in the game day order
    setGameDayOrder({
      ...gameDayOrder,
      deliveryTime: today.toISOString()
    });
    
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
          
          <div className="space-y-2">
            <Label htmlFor="deliveryTime" className="text-sm font-medium">
              Delivery Time (2:00 PM - 9:30 PM only)
            </Label>
            <Select
              value={selectedTime}
              onValueChange={setSelectedTime}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select delivery time" />
              </SelectTrigger>
              <SelectContent>
                {timeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.display}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {gameDayOrder.items.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Order Items</h3>
              <OrderItemsList
                items={gameDayOrder.items}
                onRemoveItem={(index) => {
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

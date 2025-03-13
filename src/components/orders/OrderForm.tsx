
import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { OrderFormProps } from "./types";

const OrderForm = ({ 
  showGameDayOrderDialog,
  setShowGameDayOrderDialog,
  handleAddGameDayOrder,
  gameDayOrder,
  setGameDayOrder 
}: OrderFormProps) => {
  return (
    <Dialog open={showGameDayOrderDialog} onOpenChange={setShowGameDayOrderDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Game Day Order</DialogTitle>
          <DialogDescription>
            Add items for immediate service to a suite.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="suite" className="text-sm font-medium">Suite</label>
            <Input
              id="suite"
              placeholder="Suite ID (e.g., 200-A)"
              value={gameDayOrder.suiteId}
              onChange={(e) => setGameDayOrder({...gameDayOrder, suiteId: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Items</label>
            {gameDayOrder.items.map((item, index) => (
              <div key={index} className="flex space-x-2">
                <Input
                  placeholder="Item name"
                  value={item.name}
                  onChange={(e) => {
                    const newItems = [...gameDayOrder.items];
                    newItems[index] = {...newItems[index], name: e.target.value};
                    setGameDayOrder({...gameDayOrder, items: newItems});
                  }}
                  className="flex-1"
                />
                <Input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => {
                    const newItems = [...gameDayOrder.items];
                    newItems[index] = {...newItems[index], quantity: parseInt(e.target.value) || 1};
                    setGameDayOrder({...gameDayOrder, items: newItems});
                  }}
                  className="w-20"
                />
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => setGameDayOrder({
                ...gameDayOrder, 
                items: [...gameDayOrder.items, { name: "", quantity: 1 }]
              })}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleAddGameDayOrder}>Create Order</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OrderForm;

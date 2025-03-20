
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface OrderItem {
  name: string;
  quantity: number;
}

interface OrderItemsListProps {
  items: OrderItem[];
  onUpdateQuantity?: (index: number, quantity: number) => void;
  onRemoveItem?: (index: number) => void;
}

const OrderItemsList = ({ 
  items, 
  onUpdateQuantity, 
  onRemoveItem 
}: OrderItemsListProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Order Items</label>
      <ScrollArea className="h-[calc(80vh-350px)] border rounded-md p-2">
        {items.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            Click on menu items to add them to your order
          </div>
        ) : (
          <div className="space-y-2">
            {items.map((item, index) => (
              <div key={index} className="flex justify-between items-center p-2 border rounded-md">
                <div className="flex-1">
                  <div className="font-medium">{item.name}</div>
                </div>
                <div className="flex items-center space-x-2">
                  {onUpdateQuantity && (
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => {
                        onUpdateQuantity(index, parseInt(e.target.value) || 1);
                      }}
                      className="w-16"
                    />
                  )}
                  {onRemoveItem && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onRemoveItem(index)}
                    >
                      X
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
      <div className="space-y-2 pt-4">
        <div className="text-right font-medium">
          Total Items: {items.reduce((sum, item) => sum + item.quantity, 0)}
        </div>
        <div className="text-sm text-muted-foreground">
          18% Service Charge: A 4.5% administration fee and a 13.5% gratuity are automatically added to your bill.
        </div>
      </div>
    </div>
  );
};

export default OrderItemsList;

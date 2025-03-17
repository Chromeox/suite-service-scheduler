
import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OrderFormProps } from "./types";
import { MenuItem } from "@/services/types";
import MenuSection from "./form/MenuSection";
import OrderItemsList from "./form/OrderItemsList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageUpload } from "@/components/ui/image-upload";
import { toast } from "@/hooks/use-toast";

const OrderForm = ({ 
  showGameDayOrderDialog,
  setShowGameDayOrderDialog,
  handleAddGameDayOrder,
  gameDayOrder,
  setGameDayOrder 
}: OrderFormProps) => {
  
  const [activeTab, setActiveTab] = useState("menu");
  const [orderImage, setOrderImage] = useState<{file?: File, url?: string} | null>(null);
  
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

  // Handle image capture for order
  const handleImageCaptured = (imageFile: File, imageUrl: string) => {
    setOrderImage({ file: imageFile, url: imageUrl });
    toast({
      title: "Order image captured",
      description: "The order form image has been captured. You can now extract items from the form."
    });
  };

  // Clear the order image
  const handleClearImage = () => {
    setOrderImage(null);
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
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden flex flex-col">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="menu">Menu Selection</TabsTrigger>
            <TabsTrigger value="image">Upload Order Form</TabsTrigger>
          </TabsList>
          
          <div className="flex-1 overflow-auto">
            <TabsContent value="menu" className="h-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4 h-full">
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
            </TabsContent>
            
            <TabsContent value="image" className="h-full">
              <div className="flex flex-col h-full">
                <div className="grid grid-cols-1 gap-6 py-4">
                  <div className="space-y-2">
                    <label htmlFor="suite-image" className="text-sm font-medium">Suite ID</label>
                    <Input
                      id="suite-image"
                      placeholder="Suite ID (e.g., 201)"
                      value={gameDayOrder.suiteId}
                      onChange={(e) => setGameDayOrder({...gameDayOrder, suiteId: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Order Form Image</div>
                    <ImageUpload 
                      onImageCaptured={handleImageCaptured}
                      previewImage={orderImage?.url}
                      onClear={handleClearImage}
                    />
                  </div>
                  
                  {orderImage && (
                    <div className="space-y-2 border-t pt-4">
                      <div className="text-sm font-medium">Manual Item Entry</div>
                      <p className="text-sm text-muted-foreground">
                        After uploading an order form, manually enter the items from the image:
                      </p>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          placeholder="Item name"
                          className="col-span-1"
                          onChange={(e) => {}}
                        />
                        <Input
                          type="number"
                          placeholder="Quantity"
                          min="1"
                          className="col-span-1"
                          onChange={(e) => {}}
                        />
                      </div>
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          toast({
                            title: "Not implemented",
                            description: "This is a demonstration of the image upload feature. Manual entry from image would be implemented in a production version.",
                          });
                        }}
                      >
                        Add Item
                      </Button>
                      
                      <OrderItemsList 
                        items={gameDayOrder.items}
                        onUpdateQuantity={handleUpdateQuantity}
                        onRemoveItem={handleRemoveItem}
                      />
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
        
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

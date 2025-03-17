
import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { OrderFormProps } from "./types";
import { getMenuItems, MenuItem } from "@/services/mockOrdersService";

const OrderForm = ({ 
  showGameDayOrderDialog,
  setShowGameDayOrderDialog,
  handleAddGameDayOrder,
  gameDayOrder,
  setGameDayOrder 
}: OrderFormProps) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Get all categories from menu items
  const categories = Array.from(new Set(getMenuItems().map(item => item.category)));
  
  useEffect(() => {
    // Load all menu items initially
    setMenuItems(getMenuItems());
  }, []);
  
  // Filter menu items based on selected category
  const filteredItems = selectedCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);
  
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
  
  // Format price to display dollar amount
  const formatPrice = (price: number) => {
    return `$${price}`;
  };
  
  // Display dietary information as badges
  const renderDietaryBadges = (item: MenuItem) => {
    const badges = [];
    
    if (item.dietaryInfo?.vegetarian) {
      badges.push(<Badge key="veg" variant="outline" className="bg-green-50 text-green-700 mr-1">VG</Badge>);
    }
    
    if (item.dietaryInfo?.vegan) {
      badges.push(<Badge key="vegan" variant="outline" className="bg-green-50 text-green-700 mr-1">V</Badge>);
    }
    
    if (item.dietaryInfo?.glutenFree) {
      badges.push(<Badge key="gf" variant="outline" className="bg-yellow-50 text-yellow-700 mr-1">GF</Badge>);
    }
    
    if (item.dietaryInfo?.oceanwise) {
      badges.push(<Badge key="ow" variant="outline" className="bg-blue-50 text-blue-700 mr-1">OW</Badge>);
    }
    
    return badges;
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4 h-full">
          {/* Left side: Menu selection */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <label htmlFor="category" className="text-sm font-medium">Category:</label>
              <Select 
                value={selectedCategory} 
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-1 mb-2">
              <div className="text-sm font-medium mb-1">Menu Items</div>
              <div className="flex flex-wrap gap-1 mb-2">
                <Badge variant="outline" className="bg-green-50 text-green-700">VG - Vegetarian</Badge>
                <Badge variant="outline" className="bg-green-50 text-green-700">V - Vegan</Badge>
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700">GF - Gluten Free</Badge>
                <Badge variant="outline" className="bg-blue-50 text-blue-700">OW - Oceanwise</Badge>
              </div>
              <ScrollArea className="h-[calc(80vh-250px)] border rounded-md p-2">
                <div className="space-y-3">
                  {filteredItems.map(item => (
                    <div 
                      key={item.id} 
                      className="p-3 border rounded-md cursor-pointer hover:bg-muted transition-colors"
                      onClick={() => handleSelectMenuItem(item)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="font-medium">{item.name}</div>
                        <div className="font-bold">{formatPrice(item.price)}</div>
                      </div>
                      
                      {item.description && (
                        <div className="text-sm text-muted-foreground">
                          {item.description}
                        </div>
                      )}
                      
                      <div className="mt-1 flex items-center justify-between">
                        <div className="flex flex-wrap">
                          {renderDietaryBadges(item)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {item.servingSize}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
          
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
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Order Items</label>
              <ScrollArea className="h-[calc(80vh-350px)] border rounded-md p-2">
                {gameDayOrder.items.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    Click on menu items to add them to your order
                  </div>
                ) : (
                  <div className="space-y-2">
                    {gameDayOrder.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-2 border rounded-md">
                        <div className="flex-1">
                          <div className="font-medium">{item.name}</div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => {
                              const newItems = [...gameDayOrder.items];
                              newItems[index] = {...newItems[index], quantity: parseInt(e.target.value) || 1};
                              setGameDayOrder({...gameDayOrder, items: newItems});
                            }}
                            className="w-16"
                          />
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleRemoveItem(index)}
                          >
                            X
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>
            
            <div className="space-y-2 pt-4">
              <div className="text-right font-medium">
                Total Items: {gameDayOrder.items.reduce((sum, item) => sum + item.quantity, 0)}
              </div>
              <div className="text-sm text-muted-foreground">
                18% Service Charge: A 4.5% administration fee and a 13.5% gratuity are automatically added to your bill.
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => setShowGameDayOrderDialog(false)}
          >
            Cancel
          </Button>
          <Button onClick={handleAddGameDayOrder} disabled={gameDayOrder.items.length === 0 || !gameDayOrder.suiteId}>
            Create Order
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OrderForm;

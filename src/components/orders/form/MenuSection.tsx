
import React, { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getMenuItems, MenuItem } from "@/services/mockOrdersService";
import MenuItemCard from "./MenuItemCard";

interface MenuSectionProps {
  onSelectMenuItem: (item: MenuItem) => void;
}

const MenuSection = ({ onSelectMenuItem }: MenuSectionProps) => {
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
  
  return (
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
              <MenuItemCard 
                key={item.id} 
                item={item} 
                onSelect={onSelectMenuItem} 
              />
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default MenuSection;

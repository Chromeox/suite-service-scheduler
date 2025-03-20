
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { getMenuItems } from "@/services/ordersService";
import MenuItemCard from "./MenuItemCard";
import { MenuItem } from "@/services/types";

interface MenuSectionProps {
  onSelectMenuItem: (item: MenuItem) => void;
}

const MenuSection = ({ onSelectMenuItem }: MenuSectionProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("food");
  
  const { data: menuItems = [], isLoading } = useQuery({
    queryKey: ['menuItems'],
    queryFn: () => getMenuItems(),
  });
  
  // Filter menu items based on category and search query
  const filteredItems = menuItems.filter(item => {
    const matchesCategory = 
      activeTab === "all" || 
      (activeTab === "food" && item.category !== "beverages") ||
      (activeTab === "drinks" && item.category === "beverages");
    
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });
  
  return (
    <div className="space-y-4">
      <Input
        placeholder="Search menu items..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-4"
      />
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="food">Food</TabsTrigger>
          <TabsTrigger value="drinks">Drinks</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="h-[50vh] overflow-auto border rounded-md p-2">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <p>Loading menu items...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p>No items found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {filteredItems.map((item) => (
                <MenuItemCard
                  key={item.id}
                  item={item}
                  onSelect={() => onSelectMenuItem(item)}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MenuSection;

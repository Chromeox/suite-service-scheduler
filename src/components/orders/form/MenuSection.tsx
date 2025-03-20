
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useQuery } from "@tanstack/react-query";
import { getMenuItems } from "@/services/ordersService";
import MenuItemCard from "./MenuItemCard";
import { MenuItem } from "@/services/types";

interface MenuSectionProps {
  onSelectMenuItem: (item: MenuItem) => void;
}

interface DietaryFilters {
  vegetarian: boolean;
  vegan: boolean;
  glutenFree: boolean;
  oceanwise: boolean;
}

const MenuSection = ({ onSelectMenuItem }: MenuSectionProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("food");
  const [dietaryFilters, setDietaryFilters] = useState<DietaryFilters>({
    vegetarian: false,
    vegan: false,
    glutenFree: false,
    oceanwise: false,
  });
  
  const { data: menuItems = [], isLoading } = useQuery({
    queryKey: ['menuItems'],
    queryFn: () => getMenuItems(),
  });
  
  // Check if any dietary filter is active
  const hasDietaryFilters = Object.values(dietaryFilters).some(value => value);
  
  // Filter menu items based on category, search query, and dietary preferences
  const filteredItems = menuItems.filter(item => {
    // Category filter
    const matchesCategory = 
      activeTab === "all" || 
      (activeTab === "food" && item.category !== "beverages") ||
      (activeTab === "drinks" && item.category === "beverages");
    
    // Search query filter
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description?.toLowerCase().includes(searchQuery.toLowerCase()) || false);
    
    // Dietary preferences filter
    const matchesDietary = !hasDietaryFilters || (
      (!dietaryFilters.vegetarian || item.dietaryInfo?.vegetarian) &&
      (!dietaryFilters.vegan || item.dietaryInfo?.vegan) &&
      (!dietaryFilters.glutenFree || item.dietaryInfo?.glutenFree) &&
      (!dietaryFilters.oceanwise || item.dietaryInfo?.oceanwise)
    );
    
    return matchesCategory && matchesSearch && matchesDietary;
  });

  const handleDietaryFilterChange = (filterName: keyof DietaryFilters) => {
    setDietaryFilters(prev => ({
      ...prev,
      [filterName]: !prev[filterName]
    }));
  };
  
  return (
    <div className="space-y-4">
      <Input
        placeholder="Search menu items..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-4"
      />
      
      <div className="flex flex-wrap gap-4 mb-4">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="vegetarian" 
            checked={dietaryFilters.vegetarian}
            onCheckedChange={() => handleDietaryFilterChange('vegetarian')}
          />
          <label 
            htmlFor="vegetarian" 
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Vegetarian
          </label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="vegan" 
            checked={dietaryFilters.vegan}
            onCheckedChange={() => handleDietaryFilterChange('vegan')}
          />
          <label 
            htmlFor="vegan" 
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Vegan
          </label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="gluten-free" 
            checked={dietaryFilters.glutenFree}
            onCheckedChange={() => handleDietaryFilterChange('glutenFree')}
          />
          <label 
            htmlFor="gluten-free" 
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Gluten Free
          </label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="oceanwise" 
            checked={dietaryFilters.oceanwise}
            onCheckedChange={() => handleDietaryFilterChange('oceanwise')}
          />
          <label 
            htmlFor="oceanwise" 
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Ocean Wise
          </label>
        </div>
      </div>
      
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

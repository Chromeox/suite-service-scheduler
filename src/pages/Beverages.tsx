
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getMenuItems } from "@/services/mock/menuService";
import BeverageCard from "@/components/menu/BeverageCard";
import BeverageCategoryCard from "@/components/menu/BeverageCategoryCard";
import FoodCategoryCard from "@/components/menu/FoodCategoryCard";
import FoodItemCard from "@/components/menu/FoodItemCard";

const Beverages = () => {
  const { role } = useParams<{ role: string }>();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeFoodCategory, setActiveFoodCategory] = useState<string | null>(null);
  
  // Get menu items for each beverage category
  const beerCategories = ["Beer - Domestic", "Beer - Import", "Beer - Craft"];
  const beerItems = beerCategories.flatMap(category => getMenuItems(category));
  
  const wineItems = getMenuItems("Wine");
  const spiritsCategories = ["Spirits - Vodka", "Spirits - Whiskey"];
  const spiritsItems = spiritsCategories.flatMap(category => getMenuItems(category));
  const nonAlcoholicItems = getMenuItems("Non-Alcoholic Beverages");
  const cidersAndCoolersItems = getMenuItems("Ciders & Coolers");

  // Get food menu items
  const snackItems = getMenuItems("Snacks");
  const appetizerItems = getMenuItems("Appetizers");
  const pizzaItems = getMenuItems("Pizza");
  const dessertItems = getMenuItems("Dessert");

  // Calculate total items in each category
  const getTotalItems = (items: any[]) => items.length;

  const beverageCategories = [
    { id: "beer", title: "Beer Selection", items: beerItems, icon: "beer" as const, description: `${getTotalItems(beerItems)} varieties available` },
    { id: "wine", title: "Wine Selection", items: wineItems, icon: "wine" as const, description: `${getTotalItems(wineItems)} varieties available` },
    { id: "spirits", title: "Spirits", items: spiritsItems, icon: "spirits" as const, description: `${getTotalItems(spiritsItems)} varieties available` },
    { id: "ciders", title: "Ciders & Coolers", items: cidersAndCoolersItems, icon: "cider" as const, description: `${getTotalItems(cidersAndCoolersItems)} varieties available` },
    { id: "non-alcoholic", title: "Non-Alcoholic", items: nonAlcoholicItems, icon: "non-alcoholic" as const, description: `${getTotalItems(nonAlcoholicItems)} varieties available` }
  ];

  const foodCategories = [
    { id: "snacks", title: "Snacks", items: snackItems, icon: "snack" as const, description: `${getTotalItems(snackItems)} varieties available` },
    { id: "appetizers", title: "Appetizers", items: appetizerItems, icon: "appetizer" as const, description: `${getTotalItems(appetizerItems)} varieties available` },
    { id: "pizza", title: "Pizza", items: pizzaItems, icon: "pizza" as const, description: `${getTotalItems(pizzaItems)} varieties available` },
    { id: "desserts", title: "Desserts", items: dessertItems, icon: "dessert" as const, description: `${getTotalItems(dessertItems)} varieties available` }
  ];

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId);
  };

  const handleFoodCategoryClick = (categoryId: string) => {
    setActiveFoodCategory(categoryId);
  };

  const handleBackClick = () => {
    setActiveCategory(null);
  };

  const handleFoodBackClick = () => {
    setActiveFoodCategory(null);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Menu Gallery</h1>
          <p className="text-muted-foreground">Browse all available food and beverages for suites with photos</p>
        </div>

        <Tabs defaultValue="beverages" className="mt-6">
          <TabsList className="mb-4">
            <TabsTrigger value="beverages">Beverages</TabsTrigger>
            <TabsTrigger value="food">Food</TabsTrigger>
          </TabsList>
          
          <TabsContent value="beverages">
            {activeCategory ? (
              <div className="space-y-4">
                <button 
                  onClick={handleBackClick}
                  className="text-primary hover:underline flex items-center gap-1"
                >
                  ← Back to all categories
                </button>
                
                {beverageCategories.find(cat => cat.id === activeCategory) && (
                  <BeverageCard 
                    title={beverageCategories.find(cat => cat.id === activeCategory)!.title}
                    description={beverageCategories.find(cat => cat.id === activeCategory)!.description}
                    items={beverageCategories.find(cat => cat.id === activeCategory)!.items}
                    icon={beverageCategories.find(cat => cat.id === activeCategory)!.icon}
                  />
                )}
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {beverageCategories.map(category => (
                  <BeverageCategoryCard
                    key={category.id}
                    title={category.title}
                    icon={category.icon}
                    count={category.items.length}
                    onClick={() => handleCategoryClick(category.id)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="food">
            {activeFoodCategory ? (
              <div className="space-y-4">
                <button 
                  onClick={handleFoodBackClick}
                  className="text-primary hover:underline flex items-center gap-1"
                >
                  ← Back to all categories
                </button>
                
                {foodCategories.find(cat => cat.id === activeFoodCategory) && (
                  <FoodItemCard 
                    title={foodCategories.find(cat => cat.id === activeFoodCategory)!.title}
                    description={foodCategories.find(cat => cat.id === activeFoodCategory)!.description}
                    items={foodCategories.find(cat => cat.id === activeFoodCategory)!.items}
                    icon={foodCategories.find(cat => cat.id === activeFoodCategory)!.icon}
                  />
                )}
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {foodCategories.map(category => (
                  <FoodCategoryCard
                    key={category.id}
                    title={category.title}
                    icon={category.icon}
                    count={category.items.length}
                    onClick={() => handleFoodCategoryClick(category.id)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {activeCategory === null && activeFoodCategory === null && (
          <Tabs defaultValue="allCategories" className="mt-6">
            <TabsList>
              <TabsTrigger value="allCategories">All Categories</TabsTrigger>
              <TabsTrigger value="detailedList">Detailed List</TabsTrigger>
            </TabsList>
            <TabsContent value="allCategories">
              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground">
                    Click on any category above to view detailed items with photos.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="detailedList">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {beverageCategories.map(category => (
                  <BeverageCard
                    key={category.id}
                    title={category.title}
                    description={category.description}
                    items={category.items}
                    icon={category.icon}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Beverages;


import React, { useState } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getMenuItems } from "@/services/mock/menuService";
import BeverageCard from "@/components/menu/BeverageCard";
import BeverageCategoryCard from "@/components/menu/BeverageCategoryCard";

const Beverages = () => {
  const { role } = useParams<{ role: string }>();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  // Get menu items for each beverage category
  const beerCategories = ["Beer - Domestic", "Beer - Import", "Beer - Craft"];
  const beerItems = beerCategories.flatMap(category => getMenuItems(category));
  
  const wineItems = getMenuItems("Wine");
  const spiritsCategories = ["Spirits - Vodka", "Spirits - Whiskey"];
  const spiritsItems = spiritsCategories.flatMap(category => getMenuItems(category));
  const nonAlcoholicItems = getMenuItems("Non-Alcoholic Beverages");
  const cidersAndCoolersItems = getMenuItems("Ciders & Coolers");

  // Calculate total items in each category
  const getTotalItems = (items: any[]) => items.length;

  const categories = [
    { id: "beer", title: "Beer Selection", items: beerItems, icon: "beer" as const, description: `${getTotalItems(beerItems)} varieties available` },
    { id: "wine", title: "Wine Selection", items: wineItems, icon: "wine" as const, description: `${getTotalItems(wineItems)} varieties available` },
    { id: "spirits", title: "Spirits", items: spiritsItems, icon: "spirits" as const, description: `${getTotalItems(spiritsItems)} varieties available` },
    { id: "ciders", title: "Ciders & Coolers", items: cidersAndCoolersItems, icon: "cider" as const, description: `${getTotalItems(cidersAndCoolersItems)} varieties available` },
    { id: "non-alcoholic", title: "Non-Alcoholic", items: nonAlcoholicItems, icon: "non-alcoholic" as const, description: `${getTotalItems(nonAlcoholicItems)} varieties available` }
  ];

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId);
  };

  const handleBackClick = () => {
    setActiveCategory(null);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Beverage Menu</h1>
          <p className="text-muted-foreground">Browse all available beverages for suites</p>
        </div>

        {activeCategory ? (
          <div className="space-y-4">
            <button 
              onClick={handleBackClick}
              className="text-primary hover:underline flex items-center gap-1"
            >
              ← Back to all categories
            </button>
            
            {categories.find(cat => cat.id === activeCategory) && (
              <BeverageCard 
                title={categories.find(cat => cat.id === activeCategory)!.title}
                description={categories.find(cat => cat.id === activeCategory)!.description}
                items={categories.find(cat => cat.id === activeCategory)!.items}
                icon={categories.find(cat => cat.id === activeCategory)!.icon}
              />
            )}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {categories.map(category => (
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

        <Tabs defaultValue="allCategories" className="mt-6">
          <TabsList>
            <TabsTrigger value="allCategories">All Categories</TabsTrigger>
            <TabsTrigger value="detailedList">Detailed List</TabsTrigger>
          </TabsList>
          <TabsContent value="allCategories">
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">
                  Click on any beverage category above to view detailed items.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="detailedList">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {categories.map(category => (
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
      </div>
    </DashboardLayout>
  );
};

export default Beverages;

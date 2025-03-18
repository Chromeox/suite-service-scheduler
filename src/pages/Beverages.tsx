
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getMenuItems } from "@/services/mock/menuService";
import BeverageCard from "@/components/menu/BeverageCard";
import BeverageCategoryCard from "@/components/menu/BeverageCategoryCard";
import { ImageUpload } from "@/components/ui/image-upload";

const Beverages = () => {
  const { role } = useParams<{ role: string }>();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  
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
    { id: "snacks", title: "Snacks", items: snackItems, description: `${getTotalItems(snackItems)} varieties available` },
    { id: "appetizers", title: "Appetizers", items: appetizerItems, description: `${getTotalItems(appetizerItems)} varieties available` },
    { id: "pizza", title: "Pizza", items: pizzaItems, description: `${getTotalItems(pizzaItems)} varieties available` },
    { id: "desserts", title: "Desserts", items: dessertItems, description: `${getTotalItems(dessertItems)} varieties available` }
  ];

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId);
  };

  const handleBackClick = () => {
    setActiveCategory(null);
  };

  const handleImageUpload = (file: File, imageUrl: string) => {
    setUploadedImage(imageUrl);
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
            <TabsTrigger value="upload">Upload Menu Photo</TabsTrigger>
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
            <div className="grid gap-6 md:grid-cols-2">
              {foodCategories.map(category => (
                <Card key={category.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="grid gap-4 p-6">
                      <h3 className="text-xl font-bold">{category.title}</h3>
                      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
                        {category.items.slice(0, 4).map(item => (
                          <div key={item.id} className="overflow-hidden rounded-md border">
                            <div className="h-32 overflow-hidden bg-muted">
                              <img 
                                src="https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?q=80&w=300&auto=format&fit=crop" 
                                alt={item.name}
                                className="h-full w-full object-cover transition-transform hover:scale-105"
                              />
                            </div>
                            <div className="flex justify-between p-3">
                              <div>
                                <p className="font-medium">{item.name}</p>
                                {item.servingSize && (
                                  <span className="text-xs text-muted-foreground">
                                    {item.servingSize}
                                  </span>
                                )}
                              </div>
                              <span className="font-medium">${item.price}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="upload">
            <Card>
              <CardContent className="pt-6 flex flex-col items-center">
                <div className="max-w-md w-full">
                  <p className="text-center mb-4">Upload a photo of the menu to share with guests</p>
                  <ImageUpload 
                    onImageCaptured={handleImageUpload}
                    previewImage={uploadedImage || undefined}
                    onClear={() => setUploadedImage(null)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {activeCategory === null && (
          <Tabs defaultValue="allCategories" className="mt-6">
            <TabsList>
              <TabsTrigger value="allCategories">All Categories</TabsTrigger>
              <TabsTrigger value="detailedList">Detailed List</TabsTrigger>
            </TabsList>
            <TabsContent value="allCategories">
              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground">
                    Click on any beverage category above to view detailed items with photos.
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

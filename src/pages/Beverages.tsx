
import React from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Beer, Wine, Coffee, GlassWater, Martini } from "lucide-react";
import { getMenuItems } from "@/services/mock/menuService";

const Beverages = () => {
  const { role } = useParams<{ role: string }>();
  
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Beverage Menu</h1>
          <p className="text-muted-foreground">Browse all available beverages for suites</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Beer className="h-5 w-5 text-primary" />
                <CardTitle>Beer Selection</CardTitle>
              </div>
              <CardDescription>{getTotalItems(beerItems)} varieties available</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {beerItems.slice(0, 5).map(item => (
                  <li key={item.id} className="flex justify-between">
                    <span>{item.name}</span>
                    <span className="font-medium">${item.price}</span>
                  </li>
                ))}
                {beerItems.length > 5 && (
                  <li className="text-sm text-muted-foreground text-center mt-2">
                    + {beerItems.length - 5} more options
                  </li>
                )}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Wine className="h-5 w-5 text-primary" />
                <CardTitle>Wine Selection</CardTitle>
              </div>
              <CardDescription>{getTotalItems(wineItems)} varieties available</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {wineItems.slice(0, 5).map(item => (
                  <li key={item.id} className="flex justify-between">
                    <span>{item.name}</span>
                    <span className="font-medium">${item.price}</span>
                  </li>
                ))}
                {wineItems.length > 5 && (
                  <li className="text-sm text-muted-foreground text-center mt-2">
                    + {wineItems.length - 5} more options
                  </li>
                )}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Martini className="h-5 w-5 text-primary" />
                <CardTitle>Spirits</CardTitle>
              </div>
              <CardDescription>{getTotalItems(spiritsItems)} varieties available</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {spiritsItems.slice(0, 5).map(item => (
                  <li key={item.id} className="flex justify-between">
                    <span>{item.name}</span>
                    <span className="font-medium">${item.price}</span>
                  </li>
                ))}
                {spiritsItems.length > 5 && (
                  <li className="text-sm text-muted-foreground text-center mt-2">
                    + {spiritsItems.length - 5} more options
                  </li>
                )}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <GlassWater className="h-5 w-5 text-primary" />
                <CardTitle>Ciders & Coolers</CardTitle>
              </div>
              <CardDescription>{getTotalItems(cidersAndCoolersItems)} varieties available</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {cidersAndCoolersItems.slice(0, 5).map(item => (
                  <li key={item.id} className="flex justify-between">
                    <span>{item.name}</span>
                    <span className="font-medium">${item.price}</span>
                  </li>
                ))}
                {cidersAndCoolersItems.length > 5 && (
                  <li className="text-sm text-muted-foreground text-center mt-2">
                    + {cidersAndCoolersItems.length - 5} more options
                  </li>
                )}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Coffee className="h-5 w-5 text-primary" />
                <CardTitle>Non-Alcoholic</CardTitle>
              </div>
              <CardDescription>{getTotalItems(nonAlcoholicItems)} varieties available</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {nonAlcoholicItems.slice(0, 5).map(item => (
                  <li key={item.id} className="flex justify-between">
                    <span>{item.name}</span>
                    <span className="font-medium">${item.price}</span>
                  </li>
                ))}
                {nonAlcoholicItems.length > 5 && (
                  <li className="text-sm text-muted-foreground text-center mt-2">
                    + {nonAlcoholicItems.length - 5} more options
                  </li>
                )}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Beverages;

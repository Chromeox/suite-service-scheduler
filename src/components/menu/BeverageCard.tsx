
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MenuItem } from "@/services/types/menuTypes";
import { Beer, Wine, Coffee, GlassWater, Martini, Grape } from "lucide-react";

interface BeverageCardProps {
  title: string;
  description: string;
  items: MenuItem[];
  icon?: "beer" | "wine" | "spirits" | "cider" | "non-alcoholic";
}

const BeverageCard: React.FC<BeverageCardProps> = ({ 
  title, 
  description, 
  items, 
  icon = "beer"
}) => {
  const getIcon = () => {
    switch (icon) {
      case "beer":
        return <Beer className="h-5 w-5 text-primary" />;
      case "wine":
        return <Wine className="h-5 w-5 text-primary" />;
      case "spirits":
        return <Martini className="h-5 w-5 text-primary" />;
      case "cider":
        return <Grape className="h-5 w-5 text-primary" />;
      case "non-alcoholic":
        return <Coffee className="h-5 w-5 text-primary" />;
      default:
        return <GlassWater className="h-5 w-5 text-primary" />;
    }
  };

  // Group by subcategory if present
  const groupedItems = items.reduce((acc, item) => {
    const category = item.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  // Function to get image URL for a specific beverage type
  const getItemImageUrl = (item: MenuItem) => {
    const category = item.category.toLowerCase();
    if (category.includes("beer")) {
      return "https://images.unsplash.com/photo-1600788886242-5c96aabe3757?q=80&w=300&auto=format&fit=crop";
    } else if (category.includes("wine")) {
      return "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=300&auto=format&fit=crop";
    } else if (category.includes("spirits")) {
      return "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=300&auto=format&fit=crop";
    } else if (category.includes("cider")) {
      return "https://images.unsplash.com/photo-1630349270271-a2892ee14746?q=80&w=300&auto=format&fit=crop";
    } else if (category.includes("non-alcoholic")) {
      return "https://images.unsplash.com/photo-1544145945-f90425340c7e?q=80&w=300&auto=format&fit=crop";
    } else {
      return "https://images.unsplash.com/photo-1514361892635-6b07e31e75f9?q=80&w=300&auto=format&fit=crop";
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          {getIcon()}
          <CardTitle>{title}</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Object.entries(groupedItems).map(([category, categoryItems]) => (
            <div key={category} className="space-y-2">
              {Object.keys(groupedItems).length > 1 && (
                <h4 className="text-sm font-medium">{category}</h4>
              )}
              <ul className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
                {categoryItems.map(item => (
                  <li key={item.id} className="overflow-hidden rounded-md border">
                    <div className="h-32 overflow-hidden">
                      <img 
                        src={getItemImageUrl(item)} 
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
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default BeverageCard;


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
              <ul className="space-y-2">
                {categoryItems.map(item => (
                  <li key={item.id} className="flex justify-between p-2 rounded-md hover:bg-accent transition-colors">
                    <div>
                      <span className="font-medium">{item.name}</span>
                      {item.servingSize && (
                        <span className="text-xs text-muted-foreground ml-2">
                          {item.servingSize}
                        </span>
                      )}
                    </div>
                    <span className="font-medium">${item.price}</span>
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

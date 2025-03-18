
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MenuItem } from "@/services/types/menuTypes";
import { Pizza, Salad, Cookie, Utensils } from "lucide-react";

interface FoodItemCardProps {
  title: string;
  description: string;
  items: MenuItem[];
  icon?: "snack" | "appetizer" | "pizza" | "dessert";
}

const FoodItemCard: React.FC<FoodItemCardProps> = ({ 
  title, 
  description, 
  items, 
  icon = "snack"
}) => {
  const getIcon = () => {
    switch (icon) {
      case "snack":
        return <Utensils className="h-5 w-5 text-primary" />;
      case "appetizer":
        return <Salad className="h-5 w-5 text-primary" />;
      case "pizza":
        return <Pizza className="h-5 w-5 text-primary" />;
      case "dessert":
        return <Cookie className="h-5 w-5 text-primary" />;
      default:
        return <Utensils className="h-5 w-5 text-primary" />;
    }
  };

  // Function to get image URL for a specific food type
  const getItemImageUrl = (item: MenuItem) => {
    const category = item.category.toLowerCase();
    if (category.includes("snack")) {
      return "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?q=80&w=300&auto=format&fit=crop";
    } else if (category.includes("appetizer")) {
      return "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?q=80&w=300&auto=format&fit=crop";
    } else if (category.includes("pizza")) {
      return "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=300&auto=format&fit=crop";
    } else if (category.includes("dessert")) {
      return "https://images.unsplash.com/photo-1551024506-0bccd828d307?q=80&w=300&auto=format&fit=crop";
    } else {
      return "https://images.unsplash.com/photo-1615937722923-67f6deaf2cc9?q=80&w=300&auto=format&fit=crop";
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
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
          {items.map(item => (
            <div key={item.id} className="overflow-hidden rounded-md border">
              <div className="h-32 overflow-hidden bg-muted">
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
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default FoodItemCard;

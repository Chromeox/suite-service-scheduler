
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Pizza, Salad, Cookie, Utensils } from "lucide-react";

interface FoodCategoryCardProps {
  title: string;
  icon: "snack" | "appetizer" | "pizza" | "dessert";
  imageUrl?: string;
  count: number;
  onClick: () => void;
}

const FoodCategoryCard: React.FC<FoodCategoryCardProps> = ({
  title,
  icon,
  imageUrl,
  count,
  onClick
}) => {
  const getIcon = () => {
    switch (icon) {
      case "snack":
        return <Utensils className="h-8 w-8" />;
      case "appetizer":
        return <Salad className="h-8 w-8" />;
      case "pizza":
        return <Pizza className="h-8 w-8" />;
      case "dessert":
        return <Cookie className="h-8 w-8" />;
      default:
        return <Utensils className="h-8 w-8" />;
    }
  };

  // Default background images for food categories
  const getDefaultImage = () => {
    switch (icon) {
      case "snack":
        return "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?q=80&w=300&auto=format&fit=crop";
      case "appetizer":
        return "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?q=80&w=300&auto=format&fit=crop";
      case "pizza":
        return "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=300&auto=format&fit=crop";
      case "dessert":
        return "https://images.unsplash.com/photo-1551024506-0bccd828d307?q=80&w=300&auto=format&fit=crop";
      default:
        return "https://images.unsplash.com/photo-1615937722923-67f6deaf2cc9?q=80&w=300&auto=format&fit=crop";
    }
  };

  return (
    <Card 
      className="overflow-hidden cursor-pointer h-60 relative group transform transition-transform hover:scale-105" 
      onClick={onClick}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/10 z-10 group-hover:from-black/90 transition-all"></div>
      <div 
        className="absolute inset-0 bg-cover bg-center z-0 transition-transform group-hover:scale-110"
        style={{ backgroundImage: `url(${imageUrl || getDefaultImage()})` }}
      ></div>
      <CardContent className="relative z-20 h-full flex flex-col justify-end p-4">
        <div className="flex items-center gap-2 mb-2 text-white">
          {getIcon()}
          <h3 className="text-xl font-bold">{title}</h3>
        </div>
        <p className="text-white/80">{count} varieties available</p>
      </CardContent>
    </Card>
  );
};

export default FoodCategoryCard;

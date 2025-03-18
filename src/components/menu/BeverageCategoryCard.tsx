
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Beer, Wine, Coffee, Martini, Grape } from "lucide-react";

interface BeverageCategoryCardProps {
  title: string;
  icon: "beer" | "wine" | "spirits" | "cider" | "non-alcoholic";
  imageUrl?: string;
  count: number;
  onClick: () => void;
}

const BeverageCategoryCard: React.FC<BeverageCategoryCardProps> = ({
  title,
  icon,
  imageUrl,
  count,
  onClick
}) => {
  const getIcon = () => {
    switch (icon) {
      case "beer":
        return <Beer className="h-8 w-8" />;
      case "wine":
        return <Wine className="h-8 w-8" />;
      case "spirits":
        return <Martini className="h-8 w-8" />;
      case "cider":
        return <Grape className="h-8 w-8" />;
      case "non-alcoholic":
        return <Coffee className="h-8 w-8" />;
      default:
        return <Beer className="h-8 w-8" />;
    }
  };

  // Default background images for beverage categories
  const getDefaultImage = () => {
    switch (icon) {
      case "beer":
        return "https://images.unsplash.com/photo-1600788886242-5c96aabe3757?q=80&w=300&auto=format&fit=crop";
      case "wine":
        return "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=300&auto=format&fit=crop";
      case "spirits":
        return "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=300&auto=format&fit=crop";
      case "cider":
        return "https://images.unsplash.com/photo-1630349270271-a2892ee14746?q=80&w=300&auto=format&fit=crop";
      case "non-alcoholic":
        return "https://images.unsplash.com/photo-1544145945-f90425340c7e?q=80&w=300&auto=format&fit=crop";
      default:
        return "https://images.unsplash.com/photo-1514361892635-6b07e31e75f9?q=80&w=300&auto=format&fit=crop";
    }
  };

  return (
    <Card 
      className="overflow-hidden cursor-pointer h-60 relative group" 
      onClick={onClick}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/10 z-10"></div>
      <div 
        className="absolute inset-0 bg-cover bg-center z-0"
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

export default BeverageCategoryCard;

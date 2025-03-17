import React from "react";
import { Badge } from "@/components/ui/badge";
import { MenuItem } from "@/services/types/menuTypes";

interface MenuItemCardProps {
  item: MenuItem;
  onSelect: (item: MenuItem) => void;
}

const MenuItemCard = ({ item, onSelect }: MenuItemCardProps) => {
  // Format price to display dollar amount
  const formatPrice = (price: number) => {
    // Handle decimal and whole number prices differently
    return price % 1 === 0 ? `$${price}` : `$${price.toFixed(2)}`;
  };

  // Display dietary information as badges
  const renderDietaryBadges = (item: MenuItem) => {
    const badges = [];
    
    if (item.dietaryInfo?.vegetarian) {
      badges.push(<Badge key="veg" variant="outline" className="bg-green-50 text-green-700 mr-1">VG</Badge>);
    }
    
    if (item.dietaryInfo?.vegan) {
      badges.push(<Badge key="vegan" variant="outline" className="bg-green-50 text-green-700 mr-1">V</Badge>);
    }
    
    if (item.dietaryInfo?.glutenFree) {
      badges.push(<Badge key="gf" variant="outline" className="bg-yellow-50 text-yellow-700 mr-1">GF</Badge>);
    }
    
    if (item.dietaryInfo?.oceanwise) {
      badges.push(<Badge key="ow" variant="outline" className="bg-blue-50 text-blue-700 mr-1">OW</Badge>);
    }
    
    return badges;
  };

  return (
    <div 
      className="p-3 border rounded-md cursor-pointer hover:bg-muted transition-colors"
      onClick={() => onSelect(item)}
    >
      <div className="flex justify-between items-start">
        <div className="font-medium">{item.name}</div>
        <div className="font-bold">{formatPrice(item.price)}</div>
      </div>
      
      {item.description && (
        <div className="text-sm text-muted-foreground">
          {item.description}
        </div>
      )}
      
      <div className="mt-1 flex items-center justify-between">
        <div className="flex flex-wrap">
          {renderDietaryBadges(item)}
        </div>
        <div className="text-xs text-muted-foreground">
          {item.servingSize}
        </div>
      </div>
    </div>
  );
};

export default MenuItemCard;

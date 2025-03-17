
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown } from "lucide-react";

interface OrderSortControlsProps {
  sortDirection: 'asc' | 'desc' | null;
  toggleSort: (direction: 'asc' | 'desc') => void;
}

const OrderSortControls = ({ sortDirection, toggleSort }: OrderSortControlsProps) => {
  return (
    <div className="flex space-x-1">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => toggleSort('asc')} 
        className={sortDirection === 'asc' ? 'bg-muted' : ''}
      >
        <ArrowUp className="h-4 w-4" />
      </Button>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => toggleSort('desc')} 
        className={sortDirection === 'desc' ? 'bg-muted' : ''}
      >
        <ArrowDown className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default OrderSortControls;

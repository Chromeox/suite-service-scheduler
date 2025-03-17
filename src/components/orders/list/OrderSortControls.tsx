
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown } from "lucide-react";

interface OrderSortControlsProps {
  label?: string;
  sortDirection: 'asc' | 'desc' | null;
  toggleSort: () => void;
}

const OrderSortControls = ({ label, sortDirection, toggleSort }: OrderSortControlsProps) => {
  return (
    <div className="flex items-center space-x-1">
      {label && <span className="mr-2">{label}</span>}
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => toggleSort()} 
        className={sortDirection === 'asc' ? 'bg-muted' : ''}
      >
        <ArrowUp className="h-4 w-4" />
      </Button>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => toggleSort()} 
        className={sortDirection === 'desc' ? 'bg-muted' : ''}
      >
        <ArrowDown className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default OrderSortControls;

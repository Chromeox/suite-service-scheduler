
import React from "react";
import { Input } from "@/components/ui/input";

interface SuiteRangeFilterProps {
  minSuite: string;
  maxSuite: string;
  onMinChange: (value: string) => void;
  onMaxChange: (value: string) => void;
}

const SuiteRangeFilter = ({ 
  minSuite, 
  maxSuite, 
  onMinChange, 
  onMaxChange 
}: SuiteRangeFilterProps) => {
  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onMinChange(e.target.value);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onMaxChange(e.target.value);
  };

  return (
    <div className="flex flex-col gap-3 py-2 sm:flex-row">
      <div className="grid w-full items-center gap-2 sm:w-auto">
        <label htmlFor="minSuite" className="text-sm font-medium">
          From Suite
        </label>
        <Input
          id="minSuite"
          placeholder="200, 500..."
          value={minSuite}
          onChange={handleMinChange}
          className="h-9 w-full sm:w-[120px]"
        />
      </div>
      <div className="grid w-full items-center gap-2 sm:w-auto">
        <label htmlFor="maxSuite" className="text-sm font-medium">
          To Suite
        </label>
        <Input
          id="maxSuite"
          placeholder="260, 540..."
          value={maxSuite}
          onChange={handleMaxChange}
          className="h-9 w-full sm:w-[120px]"
        />
      </div>
      <div className="flex items-end">
        <p className="text-xs text-muted-foreground">
          Valid ranges: 200-260, 500-540
        </p>
      </div>
    </div>
  );
};

export default SuiteRangeFilter;

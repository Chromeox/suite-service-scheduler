
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
  // Validate suite number is within allowed ranges
  const validateSuiteNumber = (value: string): boolean => {
    const suiteNum = parseInt(value);
    if (isNaN(suiteNum)) return true; // Allow empty input
    
    // Only allow suites in ranges 200-260 and 500-545
    return (suiteNum >= 200 && suiteNum <= 260) || (suiteNum >= 500 && suiteNum <= 545);
  };

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only update if empty or within valid ranges
    if (value === "" || validateSuiteNumber(value)) {
      onMinChange(value);
    }
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only update if empty or within valid ranges
    if (value === "" || validateSuiteNumber(value)) {
      onMaxChange(value);
    }
  };

  return (
    <div className="flex flex-col gap-3 py-2 sm:flex-row sm:flex-wrap sm:items-end">
      <div className="grid w-full items-center gap-1 xs:w-1/2 sm:w-auto">
        <label htmlFor="minSuite" className="text-xs sm:text-sm font-medium">
          From Suite
        </label>
        <Input
          id="minSuite"
          placeholder="200-260, 500-545"
          value={minSuite}
          onChange={handleMinChange}
          className="h-8 sm:h-9 w-full xs:max-w-[150px] sm:w-[120px]"
        />
      </div>
      <div className="grid w-full items-center gap-1 xs:w-1/2 sm:w-auto">
        <label htmlFor="maxSuite" className="text-xs sm:text-sm font-medium">
          To Suite
        </label>
        <Input
          id="maxSuite"
          placeholder="200-260, 500-545"
          value={maxSuite}
          onChange={handleMaxChange}
          className="h-8 sm:h-9 w-full xs:max-w-[150px] sm:w-[120px]"
        />
      </div>
      <div className="flex items-end mt-1 sm:mt-0 sm:ml-2">
        <p className="text-xs text-muted-foreground">
          Valid ranges: 200-260, 500-545
        </p>
      </div>
    </div>
  );
};

export default SuiteRangeFilter;

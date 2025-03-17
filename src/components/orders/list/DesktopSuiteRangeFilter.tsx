
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface DesktopSuiteRangeFilterProps {
  startSuite: string;
  endSuite: string;
  handleStartSuiteChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleEndSuiteChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  applyRangeFilter: () => void;
}

const DesktopSuiteRangeFilter = ({
  startSuite,
  endSuite,
  handleStartSuiteChange,
  handleEndSuiteChange,
  applyRangeFilter,
}: DesktopSuiteRangeFilterProps) => {
  return (
    <div className="flex space-x-2 p-3 border-b">
      <div className="flex items-center mr-2">
        <span className="text-sm font-medium">Suite Range:</span>
      </div>
      <div className="flex-1">
        <Input
          placeholder="From"
          value={startSuite}
          onChange={handleStartSuiteChange}
          className="w-full"
        />
      </div>
      <div className="flex-1">
        <Input
          placeholder="To"
          value={endSuite}
          onChange={handleEndSuiteChange}
          className="w-full"
        />
      </div>
      <Button 
        variant="outline" 
        size="icon" 
        onClick={applyRangeFilter}
        className="shrink-0"
      >
        <Search className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default DesktopSuiteRangeFilter;


import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface MobileSuiteRangeFilterProps {
  startSuite: string;
  endSuite: string;
  handleStartSuiteChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleEndSuiteChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  applyRangeFilter: () => void;
}

const MobileSuiteRangeFilter = ({
  startSuite,
  endSuite,
  handleStartSuiteChange,
  handleEndSuiteChange,
  applyRangeFilter,
}: MobileSuiteRangeFilterProps) => {
  return (
    <div className="flex flex-col space-y-2 mb-3 px-2">
      <div className="text-sm font-medium">Suite No. Range:</div>
      <div className="flex space-x-2">
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
    </div>
  );
};

export default MobileSuiteRangeFilter;

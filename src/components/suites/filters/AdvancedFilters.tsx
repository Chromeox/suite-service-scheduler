
import React from "react";
import { Button } from "@/components/ui/button";
import StatusFilter from "./StatusFilter";
import LevelFilter from "./LevelFilter";
import SectionFilter from "./SectionFilter";
import SuiteRangeFilter from "./SuiteRangeFilter";

interface AdvancedFiltersProps {
  status: string;
  level: string;
  section: string;
  minSuite: string;
  maxSuite: string;
  onStatusChange: (value: string) => void;
  onLevelChange: (value: string) => void;
  onSectionChange: (value: string) => void;
  onMinSuiteChange: (value: string) => void;
  onMaxSuiteChange: (value: string) => void;
  onResetFilters: () => void;
}

const AdvancedFilters = ({
  status,
  level,
  section,
  minSuite,
  maxSuite,
  onStatusChange,
  onLevelChange,
  onSectionChange,
  onMinSuiteChange,
  onMaxSuiteChange,
  onResetFilters,
}: AdvancedFiltersProps) => {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-4">
        <StatusFilter value={status} onChange={onStatusChange} />
        <LevelFilter value={level} onChange={onLevelChange} />
        <SectionFilter value={section} onChange={onSectionChange} />
        <Button variant="outline" onClick={onResetFilters}>
          Reset Filters
        </Button>
      </div>
      
      <SuiteRangeFilter
        minSuite={minSuite}
        maxSuite={maxSuite}
        onMinChange={onMinSuiteChange}
        onMaxChange={onMaxSuiteChange}
      />
    </>
  );
};

export default AdvancedFilters;

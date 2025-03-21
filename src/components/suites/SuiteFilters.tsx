
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import SearchFilter from "./filters/SearchFilter";
import AdvancedFilters from "./filters/AdvancedFilters";
import { getOrderedSuiteRange } from "./filters/utils/suiteRangeUtils";

interface SuiteFiltersProps {
  onFilterChange: (filters: {
    search: string;
    status: string;
    level: string;
    section: string;
    minSuite: string;
    maxSuite: string;
  }) => void;
}

const SuiteFilters = ({ onFilterChange }: SuiteFiltersProps) => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [level, setLevel] = useState("");
  const [section, setSection] = useState("");
  const [minSuite, setMinSuite] = useState("");
  const [maxSuite, setMaxSuite] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  // Load saved filters from localStorage on component mount
  useEffect(() => {
    const savedFilters = localStorage.getItem("suiteFilters");
    if (savedFilters) {
      try {
        const parsedFilters = JSON.parse(savedFilters);
        setMinSuite(parsedFilters.minSuite || "");
        setMaxSuite(parsedFilters.maxSuite || "");
        
        // Apply the filters
        const { min, max } = getOrderedSuiteRange(
          parsedFilters.minSuite,
          parsedFilters.maxSuite
        );
        
        onFilterChange({
          search, 
          status, 
          level, 
          section,
          minSuite: min,
          maxSuite: max
        });
      } catch (e) {
        console.error("Error parsing saved filters:", e);
      }
    }
  }, []);

  // Save filters to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(
      "suiteFilters",
      JSON.stringify({
        minSuite,
        maxSuite
      })
    );
  }, [minSuite, maxSuite]);

  const applyFilters = (updates: Partial<{
    search: string;
    status: string;
    level: string;
    section: string;
    minSuite: string;
    maxSuite: string;
  }> = {}) => {
    const currentFilters = {
      search,
      status,
      level,
      section,
      minSuite,
      maxSuite,
      ...updates
    };
    
    // For suite range, ensure proper ordering
    if ('minSuite' in updates || 'maxSuite' in updates) {
      const { min, max } = getOrderedSuiteRange(
        currentFilters.minSuite,
        currentFilters.maxSuite
      );
      currentFilters.minSuite = min;
      currentFilters.maxSuite = max;
    }
    
    onFilterChange(currentFilters);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    applyFilters({ search: value });
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
    applyFilters({ status: value });
  };

  const handleLevelChange = (value: string) => {
    setLevel(value);
    applyFilters({ level: value });
  };

  const handleSectionChange = (value: string) => {
    setSection(value);
    applyFilters({ section: value });
  };

  const handleMinSuiteChange = (value: string) => {
    setMinSuite(value);
    applyFilters({ minSuite: value });
  };

  const handleMaxSuiteChange = (value: string) => {
    setMaxSuite(value);
    applyFilters({ maxSuite: value });
  };

  const resetFilters = () => {
    setSearch("");
    setStatus("");
    setLevel("");
    setSection("");
    setMinSuite("");
    setMaxSuite("");
    
    onFilterChange({ 
      search: "", 
      status: "", 
      level: "", 
      section: "",
      minSuite: "",
      maxSuite: ""
    });
    
    localStorage.removeItem("suiteFilters");
  };

  return (
    <div className="space-y-3 sm:space-y-4 w-full max-w-full overflow-hidden">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex-1 min-w-[200px]">
          <SearchFilter value={search} onChange={handleSearchChange} />
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-label="Toggle filters"
          className="flex-shrink-0"
        >
          <Filter className="h-4 w-4" />
          <span className="sr-only">Toggle filters</span>
        </Button>
      </div>

      {isExpanded && (
        <div className="bg-muted/30 p-3 sm:p-4 rounded-lg border border-border/50 animate-in fade-in-50 duration-200">
          <AdvancedFilters
            status={status}
            level={level}
            section={section}
            minSuite={minSuite}
            maxSuite={maxSuite}
            onStatusChange={handleStatusChange}
            onLevelChange={handleLevelChange}
            onSectionChange={handleSectionChange}
            onMinSuiteChange={handleMinSuiteChange}
            onMaxSuiteChange={handleMaxSuiteChange}
            onResetFilters={resetFilters}
          />
        </div>
      )}
    </div>
  );
};

export default SuiteFilters;

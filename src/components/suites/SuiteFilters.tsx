
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter } from "lucide-react";
import { getOrderedSuiteRange } from "@/components/orders/utils/suiteUtils";

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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    onFilterChange({ 
      search: e.target.value, 
      status, 
      level, 
      section,
      minSuite,
      maxSuite
    });
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
    onFilterChange({ 
      search, 
      status: value, 
      level, 
      section,
      minSuite,
      maxSuite
    });
  };

  const handleLevelChange = (value: string) => {
    setLevel(value);
    onFilterChange({ 
      search, 
      status, 
      level: value, 
      section,
      minSuite,
      maxSuite
    });
  };

  const handleSectionChange = (value: string) => {
    setSection(value);
    onFilterChange({ 
      search, 
      status, 
      level, 
      section: value,
      minSuite,
      maxSuite
    });
  };

  const handleMinSuiteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMinSuite(value);
    
    const { min, max } = getOrderedSuiteRange(value, maxSuite);
    
    onFilterChange({ 
      search, 
      status, 
      level, 
      section,
      minSuite: min,
      maxSuite: max
    });
  };

  const handleMaxSuiteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMaxSuite(value);
    
    const { min, max } = getOrderedSuiteRange(minSuite, value);
    
    onFilterChange({ 
      search, 
      status, 
      level, 
      section,
      minSuite: min,
      maxSuite: max
    });
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
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search suites..."
            className="pl-8"
            value={search}
            onChange={handleSearchChange}
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-label="Toggle filters"
        >
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {isExpanded && (
        <>
          <div className="grid gap-4 md:grid-cols-4">
            <Select value={status} onValueChange={handleStatusChange}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All statuses</SelectItem>
                <SelectItem value="unsold">Unsold</SelectItem>
                <SelectItem value="sold">Sold</SelectItem>
                <SelectItem value="cleaning">Cleaning</SelectItem>
              </SelectContent>
            </Select>

            <Select value={level} onValueChange={handleLevelChange}>
              <SelectTrigger>
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All levels</SelectItem>
                <SelectItem value="1">Level 1</SelectItem>
                <SelectItem value="2">Level 2</SelectItem>
                <SelectItem value="3">Level 3</SelectItem>
                <SelectItem value="4">Level 4</SelectItem>
              </SelectContent>
            </Select>

            <Select value={section} onValueChange={handleSectionChange}>
              <SelectTrigger>
                <SelectValue placeholder="Section" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All sections</SelectItem>
                <SelectItem value="A">Section A</SelectItem>
                <SelectItem value="B">Section B</SelectItem>
                <SelectItem value="C">Section C</SelectItem>
                <SelectItem value="D">Section D</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={resetFilters}>
              Reset Filters
            </Button>
          </div>
          
          <div className="flex flex-col gap-3 py-2 sm:flex-row">
            <div className="grid w-full items-center gap-2 sm:w-auto">
              <label htmlFor="minSuite" className="text-sm font-medium">
                From Suite
              </label>
              <Input
                id="minSuite"
                placeholder="200, 500..."
                value={minSuite}
                onChange={handleMinSuiteChange}
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
                onChange={handleMaxSuiteChange}
                className="h-9 w-full sm:w-[120px]"
              />
            </div>
            <div className="flex items-end">
              <p className="text-xs text-muted-foreground">
                Valid ranges: 200-260, 500-540
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SuiteFilters;

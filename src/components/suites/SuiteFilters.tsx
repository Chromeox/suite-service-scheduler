
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter } from "lucide-react";

interface SuiteFiltersProps {
  onFilterChange: (filters: {
    search: string;
    status: string;
    level: string;
    section: string;
  }) => void;
}

const SuiteFilters = ({ onFilterChange }: SuiteFiltersProps) => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [level, setLevel] = useState("");
  const [section, setSection] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    onFilterChange({ search: e.target.value, status, level, section });
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
    onFilterChange({ search, status: value, level, section });
  };

  const handleLevelChange = (value: string) => {
    setLevel(value);
    onFilterChange({ search, status, level: value, section });
  };

  const handleSectionChange = (value: string) => {
    setSection(value);
    onFilterChange({ search, status, level, section: value });
  };

  const resetFilters = () => {
    setSearch("");
    setStatus("");
    setLevel("");
    setSection("");
    onFilterChange({ search: "", status: "", level: "", section: "" });
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
        <div className="grid gap-4 md:grid-cols-4">
          <Select value={status} onValueChange={handleStatusChange}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All statuses</SelectItem>
              <SelectItem value="vacant">Vacant</SelectItem>
              <SelectItem value="occupied">Occupied</SelectItem>
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
      )}
    </div>
  );
};

export default SuiteFilters;

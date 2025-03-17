
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/DashboardLayout";
import SuiteCard from "@/components/suites/SuiteCard";
import SuiteFilters from "@/components/suites/SuiteFilters";
import { getSuites } from "@/services/suitesService";
import { Suite } from "@/types/suite";
import { Skeleton } from "@/components/ui/skeleton";

const Suites = () => {
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    level: "",
    section: "",
    minSuite: "",
    maxSuite: "",
  });

  const { data: suites, isLoading } = useQuery({
    queryKey: ["suites"],
    queryFn: getSuites,
  });

  // Get unique suites by ID first to eliminate duplicates, then sort them
  const uniqueSuites = suites ? 
    [...new Map(suites.map(suite => [suite.id, suite])).values()] : 
    [];
    
  // Sort suites by level first (200s before 500s), 
  // then by suite number in descending order within each level
  const sortedSuites = [...uniqueSuites].sort((a, b) => {
    // First sort by level (200s come before 500s)
    const aIsLevel2 = a.number.startsWith('2');
    const bIsLevel2 = b.number.startsWith('2');
    
    if (aIsLevel2 && !bIsLevel2) return -1; // 200s come before 500s
    if (!aIsLevel2 && bIsLevel2) return 1;  // 500s come after 200s
    
    // Within the same level, sort by suite number in descending order
    return b.number.localeCompare(a.number, undefined, { numeric: true });
  });

  // Validate if a suite number is within the allowed ranges (200-260 or 500-540)
  const isValidSuiteNumber = (suiteNumber: string) => {
    const num = parseInt(suiteNumber);
    return (num >= 200 && num <= 260) || (num >= 500 && num <= 540);
  };

  const filteredSuites = sortedSuites.filter((suite) => {
    // Basic filters
    const matchesSearch =
      suite.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      suite.number.includes(filters.search) ||
      (suite.notes?.toLowerCase().includes(filters.search.toLowerCase()) ?? false);

    const matchesStatus = !filters.status || suite.status === filters.status;
    const matchesLevel = !filters.level || suite.level === filters.level;
    const matchesSection = !filters.section || suite.section === filters.section;

    // Ensure suite number is valid (200-260 or 500-540)
    const isValid = isValidSuiteNumber(suite.number);

    // Suite number range filter
    let matchesSuiteRange = true;
    const suiteNum = parseInt(suite.number);

    if (filters.minSuite && filters.maxSuite) {
      const minNum = parseInt(filters.minSuite);
      const maxNum = parseInt(filters.maxSuite);
      
      if (!isNaN(minNum) && !isNaN(maxNum) && !isNaN(suiteNum)) {
        matchesSuiteRange = suiteNum >= minNum && suiteNum <= maxNum;
      }
    } else if (filters.minSuite) {
      const minNum = parseInt(filters.minSuite);
      if (!isNaN(minNum) && !isNaN(suiteNum)) {
        matchesSuiteRange = suiteNum >= minNum;
      }
    } else if (filters.maxSuite) {
      const maxNum = parseInt(filters.maxSuite);
      if (!isNaN(maxNum) && !isNaN(suiteNum)) {
        matchesSuiteRange = suiteNum <= maxNum;
      }
    }

    return matchesSearch && matchesStatus && matchesLevel && matchesSection && matchesSuiteRange && isValid;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Suites</h1>
          <p className="text-muted-foreground">
            View and manage available suites
          </p>
        </div>

        <SuiteFilters onFilterChange={setFilters} />

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-[200px] w-full rounded-lg" />
              </div>
            ))}
          </div>
        ) : filteredSuites && filteredSuites.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredSuites.map((suite) => (
              <SuiteCard key={suite.id} suite={suite} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">No suites match your filters</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Suites;

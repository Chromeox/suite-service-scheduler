
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/DashboardLayout";
import SuiteCard from "@/components/suites/SuiteCard";
import SuiteFilters from "@/components/suites/SuiteFilters";
import { getSuites } from "@/services/suitesService";
import { Suite } from "@/types/suite";
import { Skeleton } from "@/components/ui/skeleton";
import { getOrderedSuiteRange } from "@/components/orders/utils/suiteUtils";

const Suites = () => {
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    level: "",
    section: "",
  });
  const [startSuite, setStartSuite] = useState<string>("");
  const [endSuite, setEndSuite] = useState<string>("");

  // Load saved filter values from localStorage on component mount
  useEffect(() => {
    const savedStartSuite = localStorage.getItem('suiteFilterStartSuite');
    const savedEndSuite = localStorage.getItem('suiteFilterEndSuite');
    
    if (savedStartSuite || savedEndSuite) {
      // Apply ordering to ensure lowest to highest when loading from storage
      const { min, max } = getOrderedSuiteRange(savedStartSuite || "", savedEndSuite || "");
      setStartSuite(min);
      setEndSuite(max);
    }
  }, []);

  // Save filter values to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('suiteFilterStartSuite', startSuite);
    localStorage.setItem('suiteFilterEndSuite', endSuite);
  }, [startSuite, endSuite]);

  const { data: suites, isLoading } = useQuery({
    queryKey: ["suites"],
    queryFn: getSuites,
  });

  // Sort suites in descending order by suite number
  const sortedSuites = suites ? [...suites].sort((a, b) => {
    return b.number.localeCompare(a.number, undefined, { numeric: true });
  }) : [];

  // Apply suite range filter first if active
  const rangeFilteredSuites = (startSuite || endSuite) 
    ? sortedSuites.filter(suite => {
        const { min, max } = getOrderedSuiteRange(startSuite, endSuite);
        const suiteNum = suite.number;
        const inRangeStart = !min || suiteNum >= min;
        const inRangeEnd = !max || suiteNum <= max;
        return inRangeStart && inRangeEnd;
      })
    : sortedSuites;

  const filteredSuites = rangeFilteredSuites.filter((suite) => {
    const matchesSearch =
      suite.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      suite.number.includes(filters.search) ||
      (suite.notes?.toLowerCase().includes(filters.search.toLowerCase()) ?? false);

    const matchesStatus = !filters.status || suite.status === filters.status;
    const matchesLevel = !filters.level || suite.level === filters.level;
    const matchesSection = !filters.section || suite.section === filters.section;

    return matchesSearch && matchesStatus && matchesLevel && matchesSection;
  });

  const handleSuiteRangeChange = (start: string, end: string) => {
    setStartSuite(start);
    setEndSuite(end);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Assigned Suites</h1>
          <p className="text-muted-foreground">
            View and manage available suites
          </p>
        </div>

        <SuiteFilters 
          onFilterChange={setFilters} 
          startSuite={startSuite}
          endSuite={endSuite}
          onSuiteRangeChange={handleSuiteRangeChange}
        />

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


import React from "react";
import { Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrderFiltersProps } from "./types";

const OrderFilters = ({
  role,
  selectedFloor,
  setSelectedFloor,
  searchQuery,
  setSearchQuery,
  activeTab,
  setActiveTab,
  setShowGameDayOrderDialog
}: OrderFiltersProps) => {
  return (
    <>
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <h1 className="text-2xl font-bold tracking-tight">Food Orders</h1>
        <div className="flex flex-col space-y-2 md:flex-row md:space-x-2 md:space-y-0">
          {role === "runner" && (
            <Select
              value={selectedFloor}
              onValueChange={setSelectedFloor}
            >
              <SelectTrigger className="w-[180px] md:w-[150px]">
                <SelectValue placeholder="Select Floor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Floors</SelectItem>
                <SelectItem value="200">200 Level</SelectItem>
                <SelectItem value="500">500 Level</SelectItem>
              </SelectContent>
            </Select>
          )}
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search orders..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {role === "attendant" && (
            <Button onClick={() => setShowGameDayOrderDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Game Day Order
            </Button>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Orders</TabsTrigger>
          <TabsTrigger value="pre-orders">Pre-Orders</TabsTrigger>
          <TabsTrigger value="game-day">Game Day</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
      </Tabs>
    </>
  );
};

export default OrderFilters;

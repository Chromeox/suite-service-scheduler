
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface StatusFilterProps {
  value: string;
  onChange: (value: string) => void;
}

const StatusFilter = ({ value, onChange }: StatusFilterProps) => {
  return (
    <Select value={value} onValueChange={onChange}>
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
  );
};

export default StatusFilter;

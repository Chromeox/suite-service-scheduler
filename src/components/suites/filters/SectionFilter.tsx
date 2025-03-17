
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SectionFilterProps {
  value: string;
  onChange: (value: string) => void;
}

const SectionFilter = ({ value, onChange }: SectionFilterProps) => {
  return (
    <Select value={value} onValueChange={onChange}>
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
  );
};

export default SectionFilter;

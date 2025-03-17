
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface LevelFilterProps {
  value: string;
  onChange: (value: string) => void;
}

const LevelFilter = ({ value, onChange }: LevelFilterProps) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Level" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="">All levels</SelectItem>
        <SelectItem value="1">Level 1</SelectItem>
        <SelectItem value="2">Level 2</SelectItem>
        <SelectItem value="3">Level 3</SelectItem>
        <SelectItem value="4">Level 4</SelectItem>
        <SelectItem value="5">Level 5</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default LevelFilter;

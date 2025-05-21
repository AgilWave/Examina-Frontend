"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface CategorySelectorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({ value, onChange, disabled = false }) => {
  return (
    <div className="flex-col w-full grow items-start gap-1.5 space-y-2">
      <Label>Question Category</Label>
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger className="w-full p-[5px] px-3" disabled={disabled}>
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent className="max-h-[200px] overflow-y-auto">
          <SelectItem value="mcq">MCQ</SelectItem>
          <SelectItem value="structured">Structured</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default CategorySelector;

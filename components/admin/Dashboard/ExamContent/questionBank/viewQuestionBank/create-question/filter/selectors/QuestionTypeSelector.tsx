"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface QuestionTypeSelectorProps {
  category: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const QuestionTypeSelector: React.FC<QuestionTypeSelectorProps> = ({
  category,
  value,
  onChange,
  disabled = false,
}) => {
  const mcqTypes = ["Multiple Choice", "Checkbox"];
  const structuredTypes = ["Image Upload", "Short Text", "Long Text", "Code Snippet"];

  const getOptions = () => {
    if (category === "mcq") return mcqTypes;
    if (category === "structured") return structuredTypes;
    return [];
  };

  return (
    <div className="space-y-2 flex-col w-full grow items-start gap-1.5">
      <Label>Question Type</Label>
      <Select
        value={value}
        onValueChange={onChange}
        disabled={disabled || !category}
      >
        <SelectTrigger className="w-full p-[5px] px-3" disabled={disabled || !category}>
          <SelectValue placeholder={!category ? "Select category first" : "Select question type"} />
        </SelectTrigger>
        <SelectContent className="max-h-[200px] overflow-y-auto">
          {getOptions().map((type) => (
            <SelectItem key={type} value={type}>
              {type}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default QuestionTypeSelector;

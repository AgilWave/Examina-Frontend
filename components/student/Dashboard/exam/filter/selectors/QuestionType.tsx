import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Label } from "@/components/ui/label";
import { useQueryState } from "nuqs"; // removed parseAsBoolean

export function QuestionType() {
  const [questionType, setQuestionType] = useQueryState("questionType"); // now a plain string

  const handleChange = (value: string) => {
    if (value === "all") {
      setQuestionType(""); // clear query param when "All" is selected
      return;
    }
    setQuestionType(value); // set the selected string (input, selector, etc.)
  };

  return (
    <div className="flex flex-col w-full grow items-start gap-1.5">
      <Label>By Question Type</Label>
      <Select value={questionType || "all"} onValueChange={handleChange}>
        <SelectTrigger className="w-full p-[5px] px-3">
          <SelectValue placeholder="Select a type" />
        </SelectTrigger>
        <SelectContent className="max-h-[200px] overflow-y-auto">
          <SelectGroup>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="input">Input</SelectItem>
            <SelectItem value="selector">Selector</SelectItem>
            <SelectItem value="multi-selector">Multi Selector</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}

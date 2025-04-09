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
import { parseAsBoolean, useQueryState } from "nuqs";

export function Course() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [filterApplied, setFilterApplied] = useQueryState(
    "filterApplied",
    parseAsBoolean
  );
  const [courseName, setcourseName] = useQueryState("courseName");

  const handleChange = (value: string) => {
    if (value === "null") {
      setcourseName("");
      return;
    }
    setcourseName(value);
  };

  return (
    <div className="flex flex-col w-full grow items-start gap-1.5">
      <Label>By Course</Label>
      <Select value={courseName || "null"} onValueChange={handleChange}>
        <SelectTrigger className="w-full p-[5px] px-3">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="max-h-[200px] overflow-y-auto">
          <SelectGroup>
            <SelectItem value="null">All</SelectItem>
            <SelectItem value="false">HND in Computer Science</SelectItem>
            <SelectItem value="true">DSE in Computer Science</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}

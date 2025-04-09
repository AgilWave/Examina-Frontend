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

export function Faculty() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [filterApplied, setFilterApplied] = useQueryState(
    "filterApplied",
    parseAsBoolean
  );
  const [facultyName, setfacultyName] = useQueryState("facultyName");

  const handleChange = (value: string) => {
    if (value === "null") {
      setfacultyName("");
      return;
    }
    setfacultyName(value);
  };

  return (
    <div className="flex flex-col w-full grow items-start gap-1.5">
      <Label>By Faculty</Label>
      <Select value={facultyName || "null"} onValueChange={handleChange}>
        <SelectTrigger className="w-full p-[5px] px-3">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="max-h-[200px] overflow-y-auto">
          <SelectGroup>
            <SelectItem value="null">All</SelectItem>
            <SelectItem value="false">IT</SelectItem>
            <SelectItem value="true">Management</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}

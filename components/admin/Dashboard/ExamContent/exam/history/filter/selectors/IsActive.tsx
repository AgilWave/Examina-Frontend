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

export function IsBlacklisted() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [filterApplied, setFilterApplied] = useQueryState(
    "filterApplied",
    parseAsBoolean
  );
  const [isActive, setIsActive] = useQueryState("isActive");

  const handleChange = (value: string) => {
    if (value === "null") {
      setIsActive("");
      return;
    }
    setIsActive(value);
  };

  return (
    <div className="flex flex-col w-full grow items-start gap-1.5">
      <Label>By Active Status</Label>
      <Select value={isActive || "null"} onValueChange={handleChange}>
        <SelectTrigger className="w-full p-[5px] px-3">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="max-h-[200px] overflow-y-auto">
          <SelectGroup>
            <SelectItem value="null">All</SelectItem>
            <SelectItem value="true">Activated</SelectItem>
            <SelectItem value="false">Deactivated</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}

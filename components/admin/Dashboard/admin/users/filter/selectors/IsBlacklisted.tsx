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
  const [isBlacklisted, setIsBlacklisted] = useQueryState("isBlacklisted");

  const handleChange = (value: string) => {
    if (value === "null") {
      setIsBlacklisted("");
      return;
    }
    setIsBlacklisted(value);
  };

  return (
    <div className="flex flex-col w-full grow items-start gap-1.5">
      <Label>By BlackList</Label>
      <Select value={isBlacklisted || "null"} onValueChange={handleChange}>
        <SelectTrigger className="w-full p-[5px] px-3">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="max-h-[200px] overflow-y-auto">
          <SelectGroup>
            <SelectItem value="null">All</SelectItem>
            <SelectItem value="false">Non-Blacklisted</SelectItem>
            <SelectItem value="true">Blacklisted</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { setCreateBatchYear } from "@/redux/features/BatchSlice";
import { CalendarDays  } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export default function Years() {
  const dispatch = useDispatch();
  const batch = useSelector((state: RootState) => state.batch);
  const [year, setYear] = useState("");

  useEffect(() => {
    setYear(batch.createBatch.year || "");
  }, [batch.createBatch.year]);

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 11 }, (_, i) => `${currentYear - 5 + i}`);

  const handleChange = (value: string) => {
    setYear(value);
    dispatch(setCreateBatchYear(value)); // ✅ Call the correct action
  };

  return (
    <div className="flex flex-col w-full font-poppins grow gap-2 mb-4">
      <Label
        htmlFor="year-picker"
        className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-200
        "
      >
        <CalendarDays  className="mr-2 h-4 w-4 text-slate-500" />
        Year
        <span className="text-red-500 ml-1">*</span>
      </Label>

      <Select onValueChange={handleChange} value={year}>
        <SelectTrigger id="year-picker" className="w-full bg-white text-slate-900
            dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700">
          <SelectValue placeholder="Select Year" />
        </SelectTrigger>
        <SelectContent>
          {yearOptions.map((y) => (
            <SelectItem key={y} value={y}>
              {y}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

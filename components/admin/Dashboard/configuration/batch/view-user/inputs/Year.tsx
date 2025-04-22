"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { setViewBatchYear } from "@/redux/features/BatchSlice";
import { CalendarDays } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export default function Year() {
  const dispatch = useDispatch();
  const batch = useSelector((state: RootState) => state.batch);
  const [year, setYear] = useState("");

  useEffect(() => {
    setYear(batch.viewBatch.year?.toString() || "");
  }, [batch.viewBatch.year]);

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 11 }, (_, i) => `${currentYear - 5 + i}`);

  const handleChange = (value: string) => {
    setYear(value);
    dispatch(setViewBatchYear(value));
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center">
        <CalendarDays className="mr-2 h-4 w-4" />
        <Label htmlFor="year-picker" className="text-sm font-medium">Year</Label>
      </div>
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
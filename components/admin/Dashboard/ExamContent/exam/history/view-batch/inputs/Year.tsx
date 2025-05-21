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
  SelectLabel,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Lock } from "lucide-react";
import { SelectGroup } from "@radix-ui/react-select";

export default function Year() {
  const dispatch = useDispatch();
  const batch = useSelector((state: RootState) => state.batch);
  const [year, setYear] = useState("");

  useEffect(() => {
    setYear(batch.viewBatch.year?.toString() || "");
  }, [batch.viewBatch.year]);

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from(
    { length: 11 },
    (_, i) => `${currentYear - 5 + i}`
  );

  const handleChange = (value: string) => {
    setYear(value);
    dispatch(setViewBatchYear(value));
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center">
       <Label 
        htmlFor="year-picker" 
        className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-200"
      >
        <CalendarDays className="mr-2 h-4 w-4 text-slate-500" />
        Year
        <span className="text-red-500 ml-1">*</span>
      </Label>
      </div>
      <div className="relative">
        <Select
          onValueChange={handleChange}
          value={year}
          disabled={batch.editBlocked || yearOptions.length === 0}
        >
          <SelectTrigger
            id="year-picker"
            className={`
              w-full pl-3 py-2
              border border-slate-200 rounded-md shadow-sm
              focus:border-teal-500 focus:ring-2 focus:ring-blue-100
              transition-all duration-200
              ${batch.editBlocked ? 'bg-slate-100 text-slate-500' : 'bg-white text-slate-900'}
              dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700
            `}
          >
            <SelectValue placeholder="Select Year" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md shadow-md">
            <SelectGroup>
              <SelectLabel className="px-2 py-1.5 text-sm text-slate-500 dark:text-slate-400">Select a Year</SelectLabel>
               {yearOptions.map((y) => (
              <SelectItem key={y} value={y} className="flex items-center py-2 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700">
                {y}
              </SelectItem>
            ))}
            </SelectGroup>
           
          </SelectContent>
        </Select>

        {batch.editBlocked && (
          <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
            <Lock className="h-4 w-4 text-slate-400" />
          </div>
        )}
      </div>
      {batch.editBlocked && (
        <p className="text-xs text-slate-500 mt-1 flex items-center">
          <Lock className="h-3 w-3 mr-1" />
          This field is currently locked for editing
        </p>
      )}
    </div>
  );
}

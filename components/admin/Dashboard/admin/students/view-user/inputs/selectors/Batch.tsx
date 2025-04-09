"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { setViewBatchCode } from "@/redux/features/StudentSlice";
import { Layers, Calendar, Lock } from "lucide-react";

export function Batch() {
  const dispatch = useDispatch();
  const [batch, setBatch] = useState("");
  const student = useSelector((state: RootState) => state.student);

  useEffect(() => {
    setBatch(student.viewStudent.batchCode || "spring2024");
  }, [student.viewStudent.batchCode]);

  const handleChange = (value: string) => {
    setBatch(value);
    dispatch(setViewBatchCode(value));
  };

  const getBatchIcon = (batchName: string) => {
    switch (batchName) {
      case "spring2024":
        return <Calendar className="h-4 w-4 text-green-500 mr-2" />;
      case "fall2024":
        return <Calendar className="h-4 w-4 text-amber-500 mr-2" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col w-full grow gap-2 mb-4">
      <Label className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-200">
        <Layers className="mr-2 h-4 w-4 text-slate-500" />
        Batch
        <span className="text-red-500 ml-1">*</span>
      </Label>
      
      <div className="relative">
        <Select 
          value={batch} 
          onValueChange={(value) => handleChange(value)} 
          disabled={student.editBlocked}
        >
          <SelectTrigger 
            className={`
              w-full pl-3 pr-10 py-2
              border border-slate-200 rounded-md shadow-sm
              focus:border-blue-500 focus:ring-2 focus:ring-blue-100
              transition-all duration-200
              ${student.editBlocked ? 'bg-slate-100 text-slate-500' : 'bg-white text-slate-900'}
              dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700
            `}
          >
            <SelectValue placeholder="Select a Batch" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md shadow-md">
            <SelectGroup>
              <SelectLabel className="px-2 py-1.5 text-sm text-slate-500 dark:text-slate-400">Select a Batch</SelectLabel>
              <SelectItem value="spring2024" className="flex items-center py-2 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-green-500 mr-2" />
                  Spring 2024
                </div>
              </SelectItem>
              <SelectItem value="fall2024" className="flex items-center py-2 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-amber-500 mr-2" />
                  Fall 2024
                </div>
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        
        {student.editBlocked && (
          <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
            <Lock className="h-4 w-4 text-slate-400" />
          </div>
        )}
      </div>
      
      {batch && !student.editBlocked && (
        <div className="flex items-center mt-1 text-xs text-slate-600 dark:text-slate-300">
          {getBatchIcon(batch)}
          {batch === "spring2024" ? (
            "Spring semester batch (January - May 2024)"
          ) : batch === "fall2024" ? (
            "Fall semester batch (August - December 2024)"
          ) : ""}
        </div>
      )}
      
      {student.editBlocked && (
        <p className="text-xs text-slate-500 mt-1 flex items-center">
          <Lock className="h-3 w-3 mr-1" />
          This field is currently locked for editing
        </p>
      )}
    </div>
  );
}
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDispatch } from "react-redux";
import { CheckCircle, AlertCircle, GraduationCap  } from "lucide-react";
import { setCreateModuleName } from "@/redux/features/ModuleSlice";

export function ModuleName() {
  const [moduleName, setModuleName] = useState("");
  const [isValid, setIsValid] = useState(true);
  const dispatch = useDispatch();


  const validateModuleName = (name: string) => {
    const regex = /^[a-zA-Z0-9\s\-]+$/; // Allow letters, numbers, spaces, and hyphens,
    return regex.test(name);
  };

  const handleChange = (value: string) => {
    setModuleName(value);
    setIsValid(value === "" || validateModuleName(value));
    dispatch(setCreateModuleName(value));
  };

  return (
    <div className="flex flex-col w-full font-poppins grow gap-2 mb-4">
      <Label
        htmlFor="batchName-input"
        className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-200"
      >
        <GraduationCap  className="mr-2 h-4 w-4 text-slate-500" />
        Module Name
        <span className="text-red-500 ml-1">*</span>
      </Label>

      <div className="relative">
        <Input
          id="batchName-input"
          type="text"
          value={moduleName}
          placeholder="Object Oriented Programming"
          className={`
            w-full  pl-3 pr-10 py-2 
            border ${isValid ? "border-slate-200 focus:border-teal-500" : "border-red-300 focus:border-red-500"} 
            rounded-md shadow-sm focus:ring-2 ${isValid ? "focus:ring-blue-100" : "focus:ring-red-100"}
            transition-all duration-200
            bg-white text-slate-900
            dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700
          `}
          onChange={(e) => handleChange(e.target.value)}
        />

        {moduleName && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {isValid ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-500" />
            )}
          </div>
        )}
      </div>

      {!isValid && moduleName && (
        <p className="text-xs text-red-500 mt-1">Please enter a valid module name</p>
      )}
    </div>
  );
}

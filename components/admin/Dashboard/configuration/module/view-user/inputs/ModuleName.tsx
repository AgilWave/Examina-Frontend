"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { setViewModuleName } from "@/redux/features/ModuleSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Lock, CheckCircle, AlertCircle, User2 } from "lucide-react";

export function ModuleName() {
  const [moduleName, setModuleName] = useState("");
  const [isValid, setIsValid] = useState(true);
  const dispatch = useDispatch();
  const module = useSelector((state: RootState) => state.module);

  useEffect(() => {
    setModuleName(module.viewModule.moduleName || "");
  }, [module.viewModule.moduleName]);

  const validateCode = (name: string) => {
    const regex = /^[a-zA-Z0-9\s\-]+$/; // Allow letters, numbers, spaces, and hyphens,
    return regex.test(name);
  }                                                       

  const handleChange = (value: string) => {
    setModuleName(value);
    setIsValid(value === "" || validateCode(value));
    dispatch(setViewModuleName(value));
  };
  
  return (
    <div className="flex flex-col w-full font-poppins grow gap-2 mb-4">
      <Label 
        htmlFor="batchCode-input" 
        className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-200"
      >
        <User2 className="mr-2 h-4 w-4 text-slate-500" />
        Module Name
        <span className="text-red-500 ml-1">*</span>
      </Label>

      <div className="relative">
        <Input
          id="batchCode-input"
          type="text"
          value={moduleName}
          placeholder="KUDSE24.1F"
          className={`
            w-full  pl-3 py-2 
            border ${isValid ? 'border-slate-200 focus:border-blue-500' : 'border-red-300 focus:border-red-500'} 
            rounded-md shadow-sm focus:ring-2 ${isValid ? 'focus:ring-blue-100' : 'focus:ring-red-100'}
            transition-all duration-200
            ${module.editBlocked ? 'bg-slate-100 text-slate-500' : 'bg-white text-slate-900'}
            dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700
          `}
          onChange={(e) => handleChange(e.target.value)}
          disabled={module.editBlocked}
        />
        
        {moduleName && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {module.editBlocked ? (
              <Lock className="h-4 w-4 text-slate-400" />
            ) : isValid ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-500" />
            )}
          </div>
        )}
      </div>
      
      {!isValid && moduleName && (
        <p className="text-xs text-red-500 mt-1">Please enter a valid Module Name</p>
      )}
      
      {module.editBlocked && (
        <p className="text-xs text-slate-500 mt-1 flex items-center">
          <Lock className="h-3 w-3 mr-1" />
          This field is currently locked for editing
        </p>
      )}
    </div>
  );
}
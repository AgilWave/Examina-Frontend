"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Lock, CheckCircle, AlertCircle, User2 } from "lucide-react";

export function FullName() {
  const [fullName, setFullName] = useState("");
  const [isValid, setIsValid] = useState(true);
  const dispatch = useDispatch();
  const student = useSelector((state: RootState) => state.student);

  useEffect(() => {
    setFullName(student.viewStudent.name || "");
  }, [student.viewStudent.name]);

  
  return (
    <div className="flex flex-col w-full font-poppins grow gap-2 mb-4">
      <Label 
        htmlFor="fullName-input" 
        className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-200"
      >
        <User2 className="mr-2 h-4 w-4 text-slate-500" />
        Full Name
        <span className="text-red-500 ml-1">*</span>
      </Label>

      <div className="relative">
        <Input
          id="fullName-input"
          type="text"
          value={fullName}
          placeholder="John Doe"
          className={`
            w-full  pl-3 pr-10 py-2 
            border ${isValid ? 'border-slate-200 focus:border-blue-500' : 'border-red-300 focus:border-red-500'} 
            rounded-md shadow-sm focus:ring-2 ${isValid ? 'focus:ring-blue-100' : 'focus:ring-red-100'}
            transition-all duration-200 bg-slate-100 text-slate-500
            dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700
          `}
          disabled
        />
        
        {fullName && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <CheckCircle className="h-4 w-4 text-green-500" />
          </div>
        )}
      </div>
      
      
        <p className="text-xs text-slate-500 mt-1 flex items-center">
          <Lock className="h-3 w-3 mr-1" />
          You cannot edit this field
        </p>
    </div>
  );
}
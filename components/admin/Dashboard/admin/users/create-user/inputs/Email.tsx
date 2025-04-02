"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { setcreateUserEmail } from "@/redux/features/UserSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { CheckCircle, AlertCircle, Mail } from "lucide-react";

export function Email() {
  const [fullName, setFullName] = useState("");
  const [isValid, setIsValid] = useState(true);
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);

  useEffect(() => {
    setFullName(user.createUser.email || "");
  }, [user.createUser.email]);

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleChange = (value: string) => {
    setFullName(value);
    setIsValid(value === "" || validateEmail(value));
    dispatch(setcreateUserEmail(value));
  };

  return (
    <div className="flex flex-col w-full font-poppins grow gap-2 mb-4">
      <Label
        htmlFor="email-input"
        className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-200"
      >
        <Mail className="mr-2 h-4 w-4 text-slate-500" />
        Email Address
        <span className="text-red-500 ml-1">*</span>
      </Label>

      <div className="relative">
        <Input
          id="email-input"
          type="text"
          value={fullName}
          placeholder="John.Doe@example.com"
          className={`
            w-full  pl-3 pr-10 py-2 
            border ${
              isValid
                ? "border-slate-200 focus:border-blue-500"
                : "border-red-300 focus:border-red-500"
            } 
            rounded-md shadow-sm focus:ring-2 ${
              isValid ? "focus:ring-blue-100" : "focus:ring-red-100"
            }
            transition-all duration-200
            bg-white text-slate-900
            dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700
          `}
          onChange={(e) => handleChange(e.target.value)}
        />

        {fullName && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {isValid ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-500" />
            )}
          </div>
        )}
      </div>

      {!isValid && fullName && (
        <p className="text-xs text-red-500 mt-1">Please enter a Email</p>
      )}
    </div>
  );
}

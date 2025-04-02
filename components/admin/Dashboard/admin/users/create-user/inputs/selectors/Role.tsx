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
import { setcreateRole } from "@/redux/features/UserSlice";
import { Shield, ShieldAlert } from "lucide-react";

export function Role() {
  const dispatch = useDispatch();
  const [role, setRole] = useState("");
  const user = useSelector((state: RootState) => state.user);

  useEffect(() => {
    setRole(user.createUser.role || "");
  }, [user.createUser.role]);

  const handleChange = (value: string) => {
    setRole(value);
    dispatch(setcreateRole(value));
  };

  const getRoleIcon = (roleName: string) => {
    switch (roleName) {
      case "admin":
        return <Shield className="h-4 w-4 text-blue-500 mr-2" />;
      case "superAdmin":
        return <ShieldAlert className="h-4 w-4 text-purple-500 mr-2" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col w-full grow gap-2 mb-4">
      <Label className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-200">
        <Shield className="mr-2 h-4 w-4 text-slate-500" />
        Role
        <span className="text-red-500 ml-1">*</span>
      </Label>

      <div className="relative">
        <Select value={role} onValueChange={(value) => handleChange(value)}>
          <SelectTrigger
            className={`
              w-full pl-3 pr-10 py-2
              border border-slate-200 rounded-md shadow-sm
              focus:border-blue-500 focus:ring-2 focus:ring-blue-100
              transition-all duration-200
              'bg-white text-slate-900
              dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700
            `}
          >
            <SelectValue placeholder="Select a Role" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md shadow-md">
            <SelectGroup>
              <SelectLabel className="px-2 py-1.5 text-sm text-slate-500 dark:text-slate-400">
                Select a Role
              </SelectLabel>
              <SelectItem
                value="admin"
                className="flex items-center py-2 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <div className="flex items-center">
                  <Shield className="h-4 w-4 text-blue-500 mr-2" />
                  Admin
                </div>
              </SelectItem>
              <SelectItem
                value="superAdmin"
                className="flex items-center py-2 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <div className="flex items-center">
                  <ShieldAlert className="h-4 w-4 text-purple-500 mr-2" />
                  Super Admin
                </div>
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {role && (
        <div className="flex items-center mt-1 text-xs text-slate-600 dark:text-slate-300">
          {getRoleIcon(role)}
          {role === "admin"
            ? "Standard administrative privileges"
            : role === "superAdmin"
            ? "Extended privileges with system-wide access"
            : ""}
        </div>
      )}
    </div>
  );
}

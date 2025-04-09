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
import { setViewFaculty } from "@/redux/features/StudentSlice";
import { Users, User, Lock } from "lucide-react";

export function Faculty() {
  const dispatch = useDispatch();
  const [faculty, setFaculty] = useState("");
  const student = useSelector((state: RootState) => state.student);

  useEffect(() => {
    setFaculty(student.viewStudent.faculty || "cs-faculty");
  }, [student.viewStudent.faculty]);

  const handleChange = (value: string) => {
    setFaculty(value);
    dispatch(setViewFaculty(value));
  };

  const getFacultyIcon = (facultyId: string) => {
    switch (facultyId) {
      case "cs-faculty":
        return <User className="h-4 w-4 text-indigo-500 mr-2" />;
      case "math-faculty":
        return <User className="h-4 w-4 text-emerald-500 mr-2" />;
      case "eng-faculty":
        return <User className="h-4 w-4 text-orange-500 mr-2" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col w-full grow gap-2 mb-4">
      <Label className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-200">
        <Users className="mr-2 h-4 w-4 text-slate-500" />
        Faculty
        <span className="text-red-500 ml-1">*</span>
      </Label>
      
      <div className="relative">
        <Select 
          value={faculty} 
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
            <SelectValue placeholder="Select a Faculty" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md shadow-md">
            <SelectGroup>
              <SelectLabel className="px-2 py-1.5 text-sm text-slate-500 dark:text-slate-400">Select a Faculty</SelectLabel>
              <SelectItem value="cs-faculty" className="flex items-center py-2 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700">
                <div className="flex items-center">
                  <User className="h-4 w-4 text-indigo-500 mr-2" />
                  Computer Science Faculty
                </div>
              </SelectItem>
              <SelectItem value="math-faculty" className="flex items-center py-2 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700">
                <div className="flex items-center">
                  <User className="h-4 w-4 text-emerald-500 mr-2" />
                  Mathematics Faculty
                </div>
              </SelectItem>
              <SelectItem value="eng-faculty" className="flex items-center py-2 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700">
                <div className="flex items-center">
                  <User className="h-4 w-4 text-orange-500 mr-2" />
                  Engineering Faculty
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
      
      {faculty && !student.editBlocked && (
        <div className="flex items-center mt-1 text-xs text-slate-600 dark:text-slate-300">
          {getFacultyIcon(faculty)}
          {faculty === "cs-faculty" ? (
            "Faculty of Computer Science & Information Technology"
          ) : faculty === "math-faculty" ? (
            "Faculty of Mathematical Sciences"
          ) : faculty === "eng-faculty" ? (
            "Faculty of Engineering & Applied Sciences"
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
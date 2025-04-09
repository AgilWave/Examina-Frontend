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
import { setViewCourse } from "@/redux/features/StudentSlice";
import { BookOpen, GraduationCap, Lock } from "lucide-react";

export function Course() {
  const dispatch = useDispatch();
  const [course, setCourse] = useState("");
  const student = useSelector((state: RootState) => state.student);

  useEffect(() => {
    setCourse(student.viewStudent.course || "computerScience");
  }, [student.viewStudent.course]);

  const handleChange = (value: string) => {
    setCourse(value);
    dispatch(setViewCourse(value));
  };

  const getCourseIcon = (courseName: string) => {
    switch (courseName) {
      case "computerScience":
        return <GraduationCap className="h-4 w-4 text-blue-500 mr-2" />;
      case "dataScienceAnalytics":
        return <GraduationCap className="h-4 w-4 text-purple-500 mr-2" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col w-full grow gap-2 mb-4">
      <Label className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-200">
        <BookOpen className="mr-2 h-4 w-4 text-slate-500" />
        Course
        <span className="text-red-500 ml-1">*</span>
      </Label>
      
      <div className="relative">
        <Select 
          value={course} 
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
            <SelectValue placeholder="Select a Course" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md shadow-md">
            <SelectGroup>
              <SelectLabel className="px-2 py-1.5 text-sm text-slate-500 dark:text-slate-400">Select a Course</SelectLabel>
              <SelectItem value="computerScience" className="flex items-center py-2 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700">
                <div className="flex items-center">
                  <GraduationCap className="h-4 w-4 text-blue-500 mr-2" />
                  Computer Science
                </div>
              </SelectItem>
              <SelectItem value="dataScienceAnalytics" className="flex items-center py-2 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700">
                <div className="flex items-center">
                  <GraduationCap className="h-4 w-4 text-purple-500 mr-2" />
                  Data Science & Analytics
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
      
      {course && !student.editBlocked && (
        <div className="flex items-center mt-1 text-xs text-slate-600 dark:text-slate-300">
          {getCourseIcon(course)}
          {course === "computerScience" ? (
            "BS in Computer Science (Software Development)"
          ) : course === "dataScienceAnalytics" ? (
            "BS in Data Science & Analytics"
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
"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { setViewCourseName } from "@/redux/features/CourseSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Lock, CheckCircle, AlertCircle, BookOpen } from "lucide-react";

export function CourseName() {
  const [courseName, setCourseName] = useState("");
  const [isValid, setIsValid] = useState(true);
  const dispatch = useDispatch();
  const course = useSelector((state: RootState) => state.course);

  useEffect(() => {
    setCourseName(course.viewCourse.name || "");
  }, [course.viewCourse.name]);

  const validateCourseName = (name: string) => {
    const regex = /^[a-zA-Z0-9\s\-]+$/; // letters, numbers, spaces, hyphens
    return regex.test(name);
  };

  const handleChange = (value: string) => {
    setCourseName(value);
    setIsValid(value === "" || validateCourseName(value));
    dispatch(setViewCourseName(value));
  };

  return (
    <div className="flex flex-col w-full font-poppins grow gap-2 mb-4">
      <Label
        htmlFor="courseName-input"
        className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-200"
      >
        <BookOpen className="mr-2 h-4 w-4 text-slate-500" />
        Course Name
        <span className="text-red-500 ml-1">*</span>
      </Label>

      <div className="relative group">
        <Input
          id="courseName-input"
          type="text"
          value={courseName}
          placeholder="Software Engineering"
          className={`
            w-full pl-3 pr-10 py-2
            border ${isValid ? "border-slate-200 focus:border-blue-500" : "border-red-300 focus:border-red-500"}
            rounded-md shadow-sm focus:ring-2 ${isValid ? "focus:ring-blue-100" : "focus:ring-red-100"}
            transition-all duration-200
            ${course.editBlocked ? "bg-slate-100 text-slate-500 cursor-not-allowed" : "bg-white text-slate-900"}
            dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700
          `}
          onChange={(e) => handleChange(e.target.value)}
          disabled={course.editBlocked}
        />

        {courseName && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {course.editBlocked ? (
              <div className="group-hover:hidden block">
                <Lock className="h-4 w-4 text-slate-400" />
              </div>
            ) : isValid ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-500" />
            )}

            {course.editBlocked && (
              <div className="hidden group-hover:block">
                <AlertCircle className="h-4 w-4 text-red-400" />
              </div>
            )}
          </div>
        )}
      </div>

      {!isValid && courseName && (
        <p className="text-xs text-red-500 mt-1">Please enter a valid Course Name</p>
      )}

      {course.editBlocked && (
        <p className="text-xs text-slate-500 mt-1 flex items-center">
          <Lock className="h-3 w-3 mr-1" />
          This field is currently locked for editing
        </p>
      )}
    </div>
  );
}

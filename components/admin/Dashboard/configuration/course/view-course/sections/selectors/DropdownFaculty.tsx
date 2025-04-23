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
import { setViewCourseFaculty } from "@/redux/features/CourseSlice";
import { Users, User, Lock } from "lucide-react";
import api from "@/lib/axiosInstance";
import Cookies from "js-cookie";

interface Faculty {
  id: number;
  name: string;
}

export function Faculty() {
  const dispatch = useDispatch();
  const course = useSelector((state: RootState) => state.course);
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedValue, setSelectedValue] = useState<string | undefined>(undefined);
  
  const getFaculties = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/faculty/Search", {
        headers: {
          Authorization: `Bearer ${Cookies.get("adminjwt")}`,
        },
      });
      if (response.data.isSuccessful) {
        setFaculties(response.data.listContent);
      } else {
        setFaculties([]);
      }
    } catch (error) {
      console.error("Error fetching faculties:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getFaculties();
  }, []);

  useEffect(() => {
    const facultyId = course.viewCourse.facultyId;
    
    if (facultyId && facultyId !== -1) {
      setSelectedValue(String(facultyId));
    } else {
      setSelectedValue(undefined);
    }
  }, [course.viewCourse.facultyId]);

  const handleChange = (value: string) => {
    setSelectedValue(value);
    dispatch(setViewCourseFaculty(value));
  };

  return (
    <div className="flex flex-col w-full grow gap-2 mb-4 font-poppins">
      <Label className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-200">
        <Users className="mr-2 h-4 w-4 text-slate-500" />
        Faculty
        <span className="text-red-500 ml-1">*</span>
      </Label>

      <div className="relative">
        <Select
          key={`faculty-select-${faculties.length > 0 ? 'loaded' : 'loading'}`}
          value={selectedValue}
          onValueChange={handleChange}
          disabled={course.editBlocked || isLoading}
        >
          <SelectTrigger
            className={`
              w-full pl-3 pr-10 py-2
              border rounded-md shadow-sm
              transition-all duration-200
              ${course.editBlocked ? "text-slate-500 border-slate-200" : "bg-white text-slate-900 border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-blue-100"}
              dark:border-slate-700 dark:text-slate-100
            `}
          >
            <SelectValue placeholder="Select a Faculty" />
          </SelectTrigger>

          <SelectContent className="border border-slate-200 dark:border-slate-700 rounded-md shadow-md">
            <SelectGroup>
              <SelectLabel className="px-2 py-1.5 text-sm text-slate-500 dark:text-slate-400">
                Select a Faculty
              </SelectLabel>
              {faculties.map((faculty) => (
                <SelectItem
                  key={faculty.id}
                  value={faculty.id.toString()}
                  className="flex items-center py-2 cursor-pointer hover:bg-accent"
                >
                  <div className="flex items-center">
                    <User className="h-4 w-4 text-emerald-500 mr-2" />
                    {faculty.name}
                  </div>
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        {isLoading && (
          <div className="absolute right-10 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <div className="h-4 w-4 border-2 border-t-transparent border-slate-400 rounded-full animate-spin"></div>
          </div>
        )}
        
        {course.editBlocked && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <Lock className="h-4 w-4 text-slate-400" />
          </div>
        )}
      </div>

      {course.editBlocked && (
        <p className="text-xs text-slate-500 mt-1 flex items-center">
          <Lock className="h-3 w-3 mr-1" />
          This field is currently locked for editing
        </p>
      )}
    </div>
  );
}
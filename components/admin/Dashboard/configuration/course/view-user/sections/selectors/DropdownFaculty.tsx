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
  const [selectedFaculty, setSelectedFaculty] = useState("");
  const course = useSelector((state: RootState) => state.course);
  const [faculties, setFaculties] = useState<Faculty[]>([]);

  const getFaculties = async () => {
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
    }
  };

  useEffect(() => {
    if (faculties.length === 0) {
      getFaculties();
    }
  }, [faculties.length]);

  useEffect(() => {
    setSelectedFaculty(String(course.viewCourse.facultyId) || "");
  }, [course.viewCourse.facultyId]);

  const handleChange = (value: string) => {
    setSelectedFaculty(value);
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
          value={selectedFaculty}
          onValueChange={handleChange}
          disabled={course.editBlocked || faculties.length === 0}
        >
          <SelectTrigger
            className={`
              w-full pl-3 pr-10 py-2
              border rounded-md shadow-sm
              transition-all duration-200
              ${course.editBlocked ? "bg-slate-100 text-slate-500 border-slate-200" : "bg-white text-slate-900 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"}
              dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100
            `}
          >
            <SelectValue placeholder="Select a Faculty" />
          </SelectTrigger>

          <SelectContent className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md shadow-md">
            <SelectGroup>
              <SelectLabel className="px-2 py-1.5 text-sm text-slate-500 dark:text-slate-400">
                Select a Faculty
              </SelectLabel>
              {faculties.map((faculty) => (
                <SelectItem
                  key={faculty.id}
                  value={faculty.id.toString()}
                  className="flex items-center py-2 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700"
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

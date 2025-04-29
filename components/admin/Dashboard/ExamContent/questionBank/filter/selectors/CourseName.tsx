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
import { useDispatch } from "react-redux";
import { setCreateBatchCourseId } from "@/redux/features/BatchSlice";
import { BookOpen, GraduationCap } from "lucide-react";
import api from "@/lib/axiosInstance";
import Cookies from "js-cookie";
import { useQueryState, parseAsString } from "nuqs";

interface Course {
  id: number;
  name: string;
}

export function CourseName() {
  const dispatch = useDispatch();
  const [course, setCourse] = useState("");
  const [allCourses, setAllCourses] = useState<Course[]>([]);

  const [facultyId] = useQueryState("faculty", parseAsString); // 👉 getting faculty from URL query
  const [courseQuery, setCourseQuery] = useQueryState("course", parseAsString);

  const getCourses = async (facultyId: string) => {
    try {
      const response = await api.get(`/course/Search?facultyId=${facultyId}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("adminjwt")}`,
        },
      });
      if (response.data.isSuccessful) {
        setAllCourses(response.data.listContent);
      } else {
        setAllCourses([]);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  useEffect(() => {
    if (facultyId) {
      getCourses(facultyId); // 👉 only fetch courses when faculty is selected
    } else {
      setAllCourses([]);
    }
  }, [facultyId]);

  useEffect(() => {
    if (courseQuery) {
      setCourse(courseQuery);
      dispatch(setCreateBatchCourseId(courseQuery));
    }
  }, [courseQuery]);

  const handleChange = (value: string) => {
    setCourse(value);
    dispatch(setCreateBatchCourseId(value));
    setCourseQuery(value);
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
          disabled={!facultyId || allCourses.length === 0} // 👉 disabled if no faculty selected
        >
          <SelectTrigger
            className={`
              w-full pl-3 py-2
              border border-slate-200 rounded-md shadow-sm
              focus:border-teal-500 focus:ring-2 focus:ring-blue-100
              transition-all duration-200
              bg-white text-slate-900
              dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700
            `}
          >
            <SelectValue placeholder={!facultyId ? "Select Faculty First" : "Select a Course"} />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md shadow-md overflow-y-auto">
            <SelectGroup>
              <SelectLabel className="px-2 py-1.5 text-sm text-slate-500 dark:text-slate-400">Select a Course</SelectLabel>
              {allCourses.map((course) => (
                <SelectItem
                  key={course.id}
                  value={course.id.toString()}
                  className="flex items-center py-2 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  <GraduationCap className="h-4 w-4 text-blue-500 mr-2" />
                  {course.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

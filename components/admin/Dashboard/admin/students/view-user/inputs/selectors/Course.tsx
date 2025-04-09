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
import { setViewCourseId } from "@/redux/features/StudentSlice";
import { BookOpen, GraduationCap, Lock } from "lucide-react";
import api from "@/lib/axiosInstance";
import Cookies from "js-cookie";

interface Course {
  id: number;
  name: string;
  facultyId: number;
}

export function Course() {
  const dispatch = useDispatch();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [course, setCourse] = useState("");
  const student = useSelector((state: RootState) => state.student);
  const [courses, setCourses] = useState<Course[]>([]);
  const facultyId = student.viewStudent.student.facultyId || "";

  const getCourses = async () => {
    try {
      if (facultyId) {  
        const response = await api.get(`/course/Search?facultyId=${facultyId}`, {
          headers: {
            Authorization: `Bearer ${Cookies.get("adminjwt")}`,
          },
        });
        if (response.data.isSuccessful) {
          setCourses(response.data.listContent);
        } else {
          setCourses([]);
        }
      } else {
        setCourses([]);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  useEffect(() => {
    getCourses();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facultyId]);

  useEffect(() => {
    setCourse(String(student.viewStudent.student.courseId) || "");
  }, [student.viewStudent.student.courseId]);

  const handleChange = (value: string) => {
    setCourse(value);
    dispatch(setViewCourseId(value));
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
          value={String(student.viewStudent.student.courseId) || ""}
          onValueChange={(value) => handleChange(value)} 
          disabled={student.editBlocked || courses.length === 0}
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
              {courses.map((course) => (
                <SelectItem key={course.id} value={course.id.toString()} className="flex items-center py-2 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700">
                  <GraduationCap className="h-4 w-4 text-blue-500 mr-2" />
                  {course.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        
        {student.editBlocked && (
          <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
            <Lock className="h-4 w-4 text-slate-400" />
          </div>
        )}
      </div>
      
      
      {student.editBlocked && (
        <p className="text-xs text-slate-500 mt-1 flex items-center">
          <Lock className="h-3 w-3 mr-1" />
          This field is currently locked for editing
        </p>
      )}
    </div>
  );
}
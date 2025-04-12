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
import { setViewBatchId } from "@/redux/features/StudentSlice";
import { Layers, Calendar, Lock } from "lucide-react";
import api from "@/lib/axiosInstance";
import Cookies from "js-cookie";
interface Batch {
  id: number;
  batchCode: string;
  courseId: number;
}

export function Batch() {
  const dispatch = useDispatch();
  const [allBatches, setAllBatches] = useState<Batch[]>([]);
  const student = useSelector((state: RootState) => state.student);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [batch, setBatch] = useState("");

  const getBatches = async () => {
    try {
        const response = await api.get(`/batch/Search`, {
          headers: {
            Authorization: `Bearer ${Cookies.get("adminjwt")}`,
          },
        });
        if (response.data.isSuccessful) {
          setAllBatches(response.data.listContent);
        } else {
          setAllBatches([]);
        }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (allBatches.length === 0) {
      getBatches();
    }
    setBatch("");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [student.viewStudent.student.course?.id, student.viewStudent.student.faculty?.id]);

  const filteredBatches = allBatches.filter(batch => batch.courseId === Number(student.viewStudent.student.course?.id));

  useEffect(() => {
    setBatch(String(student.viewStudent.student.batch?.id) || "");
  }, [student.viewStudent.student.batch?.id]);

  const handleChange = (value: string) => {
    setBatch(value);
    dispatch(setViewBatchId(Number(value)));
  };

  return (
    <div className="flex flex-col w-full grow gap-2 mb-4">
      <Label className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-200">
        <Layers className="mr-2 h-4 w-4 text-slate-500" />
        Batch
        <span className="text-red-500 ml-1">*</span>
      </Label>

      <div className="relative">
        <Select
          value={String(student.viewStudent.student.batch?.id) || ""}
          onValueChange={(value) => handleChange(value)}
          disabled={student.editBlocked || filteredBatches.length === 0}
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
            <SelectValue placeholder="Select a Batch" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md shadow-md">
            <SelectGroup>
              <SelectLabel className="px-2 py-1.5 text-sm text-slate-500 dark:text-slate-400">Select a Batch</SelectLabel>
              {filteredBatches.map((batch) => (
                <SelectItem key={batch.id} value={batch.id.toString()} className="flex items-center py-2 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700">
                   <Calendar className="h-4 w-4 text-amber-500 mr-2" />
                  {batch.batchCode}
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
import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ExamHistory } from "./type";

export const columns: ColumnDef<ExamHistory>[] = [
  {
    accessorKey: "examName",
    header: () => (
      <div className="min-w-[150px] font-poppins 2xl:text-[14px] text-[11px]">
        Exam Name
      </div>
    ),
    cell: ({ row }) => {
      const examName = row.original.examName;
      return (
        <div className="min-w-[150px] font-poppins 2xl:text-[14px] text-[11px]">
          {examName}
        </div>
      );
    },
  },
  {
    accessorKey: "examCode", 
    header: () => (
      <div className="min-w-[200px] font-poppins 2xl:text-[14px] text-[11px]">
        Exam Code
      </div>
    ),
    cell: ({ row }) => {
      const examCode = row.original.examCode;
      return (
        <div className="min-w-[200px] font-poppins 2xl:text-[14px] text-[11px]">
          {examCode}
        </div>
      );
    },
  },
  {
    accessorKey: "module", 
    header: () => (
      <div className="min-w-[150px] font-poppins 2xl:text-[14px] text-[11px]">
        Module
      </div>
    ),
    cell: ({ row }) => {
      const moduleName = row.original.module;
      return (
        <div className="min-w-[150px] font-poppins 2xl:text-[14px] text-[11px]">
          {moduleName}
        </div>
      );
    },
  },
  {
    accessorKey: "examDate", 
    header: () => (
      <div className="min-w-[120px] font-poppins 2xl:text-[14px] text-[11px]">
        Exam Date
      </div>
    ),
    cell: ({ row }) => {
      const examDate = row.original.examDate;
      const date = new Date(examDate).toLocaleDateString();
      return (
        <div className="min-w-[120px] font-poppins 2xl:text-[14px] text-[11px]">
          {date}
        </div>
      );
    },
  },
  {
    accessorKey: "startTime", 
    header: () => (
      <div className="min-w-[100px] font-poppins 2xl:text-[14px] text-[11px]">
        Start Time
      </div>
    ),
    cell: ({ row }) => {
      const startTime = row.original.startTime;
      const time = new Date(startTime).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      return (
        <div className="min-w-[100px] font-poppins 2xl:text-[14px] text-[11px]">
          {time}
        </div>
      );
    },
  },
  {
    accessorKey: "endTime", 
    header: () => (
      <div className="min-w-[100px] font-poppins 2xl:text-[14px] text-[11px]">
        End Time
      </div>
    ),
    cell: ({ row }) => {
      const endTime = row.original.endTime;
      const time = new Date(endTime).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      return (
        <div className="min-w-[100px] font-poppins 2xl:text-[14px] text-[11px]">
          {time}
        </div>
      );
    },
  },
  {
    accessorKey: "hasParticipated", 
    header: () => (
      <div className="min-w-[120px] font-poppins 2xl:text-[14px] text-[11px]">
        Participation
      </div>
    ),
    cell: ({ row }) => {
      const hasParticipated = row.original.hasParticipated;
      return (
        <div className="min-w-[120px] font-poppins 2xl:text-[14px] text-[11px]">
          <span className={`px-2 py-1 rounded-full text-xs ${
            hasParticipated 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {hasParticipated ? 'Participated' : 'Not Participated'}
          </span>
        </div>
      );
    },
  },
];
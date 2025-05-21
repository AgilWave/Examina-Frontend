import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ExamHistory } from "./type";

const formatDateTime = (date: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(date).toLocaleDateString('en-US', options);
};

const calculateDuration = (startTime: string, endTime: string) => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const durationMs = end.getTime() - start.getTime();
  
  const seconds = Math.floor((durationMs / 1000) % 60);
  const minutes = Math.floor((durationMs / (1000 * 60)) % 60);
  const hours = Math.floor(durationMs / (1000 * 60 * 60));

  const parts = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (seconds > 0 || parts.length === 0) parts.push(`${seconds}s`);
  
  return parts.join(' ');
};

export const columns: ColumnDef<ExamHistory>[] = [
  {
    accessorKey: "id",
    header: () => (
      <div className="text-center min-w-[50px] font-poppins 2xl:text-[14px] text-[11px]">
        ID
      </div>
    ),
    cell: ({ row }) => {
      const id = row.original.id as number;
      return (
        <div className="text-center max-w-[50px] font-poppins 2xl:text-[14px] text-[11px]">
            {id.toString().padStart(4, "0")}
        </div>
      );
    },
  },
  { 
    accessorKey: "examName", 
    header: () => (
      <div className="max-w-[100px] font-poppins 2xl:text-[14px] text-[11px]">
        Exam Name
      </div>  
    ),
    cell: ({ row }) => {
      const examName = row.original.examName as string;
      return (
        <div className="capitalize max-w-[100px] font-poppins 2xl:text-[14px] text-[11px]">
          {examName}
        </div>
      );
    },
  },
  {
    accessorKey: "startTime", 
    header: () => (
      <div className="max-w-[100px] font-poppins 2xl:text-[14px] text-[11px]">
        Start Time
      </div>
    ),
    cell: ({ row }) => {
      const startTime = row.original.startTime as string;
      return (
        <div className="capitalize max-w-[100px] font-poppins 2xl:text-[14px] text-[11px]">
          {formatDateTime(startTime)}
        </div>
      );
    },
  },
  {
    accessorKey: "endTime", 
    header: () => (
      <div className="max-w-[100px] font-poppins 2xl:text-[14px] text-[11px]">
        End Time
      </div>
    ),
    cell: ({ row }) => {
      const endTime = row.original.endTime as string;
      return (
        <div className="capitalize max-w-[100px] font-poppins 2xl:text-[14px] text-[11px]">
          {formatDateTime(endTime)}
        </div>
      );
    },
  },
  {
    accessorKey: "duration", 
    header: () => (
      <div className="max-w-[100px] font-poppins 2xl:text-[14px] text-[11px]">
        Duration 
      </div>
    ),
    cell: ({ row }) => {
      const duration = calculateDuration(row.original.startTime, row.original.endTime);
      return (
        <div className="capitalize max-w-[100px] font-poppins 2xl:text-[14px] text-[11px]">
          {duration}
        </div>
      );
    },
  },
  {
    accessorKey: "status", 
    header: () => (
      <div className="max-w-[100px] font-poppins 2xl:text-[14px] text-[11px]">
        Status 
      </div>
    ),
    cell: ({ row }) => {
      const status = row.original.status as string;
      return (
        <div className="capitalize max-w-[100px] font-poppins 2xl:text-[14px] text-[11px]">
            {status}
        </div>
      );
    },
  },
];
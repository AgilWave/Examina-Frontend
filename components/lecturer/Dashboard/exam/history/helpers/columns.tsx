import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Batch } from "./type";

export const columns: ColumnDef<Batch>[] = [
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
    accessorKey: "username", 
    header: () => (
      <div className="max-w-[100px] font-poppins 2xl:text-[14px] text-[11px]">
        Username
      </div>
    ),
    cell: ({ row }) => {
      const userName = row.original.batchCode as string;
      return (
        <div className="capitalize max-w-[100px] font-poppins 2xl:text-[14px] text-[11px]">
          {userName}
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
      const userName = row.original.year as string;
      return (
        <div className="capitalize max-w-[100px] font-poppins 2xl:text-[14px] text-[11px]">
          {userName}
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
      const userName = row.original.year as string;
      return (
        <div className="capitalize max-w-[100px] font-poppins 2xl:text-[14px] text-[11px]">
          {userName}
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
      const userName = row.original.courseName as string;
      return (
        <div className="capitalize max-w-[100px] font-poppins 2xl:text-[14px] text-[11px]">
          {userName}
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
      const userName = row.original.courseName as string;
      return (
        <div className="capitalize max-w-[100px] font-poppins 2xl:text-[14px] text-[11px]">
          {userName}
        </div>
      );
    },
  },
  {
    accessorKey: "activity", 
    header: () => (
      <div className="max-w-[100px] font-poppins 2xl:text-[14px] text-[11px]">
        Activity 
      </div>
    ),
    cell: ({ row }) => {
      const userName = row.original.courseName as string;
      return (
        <div className="capitalize max-w-[100px] font-poppins 2xl:text-[14px] text-[11px]">
          {userName}
        </div>
      );
    },
  },
  
  // {
  //   accessorKey: "status", 
  //   header: () => (
  //     <div className="text-center max-w-[50px] font-poppins 2xl:text-[14px] text-[11px]">
  //       Status
  //     </div>
  //   ),
  //   cell: ({ row }) => {
  //     const isActive = row.original.isBlacklisted as boolean;
  //     return (
  //       <div className="text-center max-w-[50px] font-poppins 2xl:text-[14px] text-[11px]">
  //         {isActive ? (
  //           <AiOutlineCloseSquare className="inline rounded-full text-red-500 text-[22px]" />
  //         ) : (
  //           <IoIosCheckbox className="inline rounded-full text-primary text-[22px]" />
  //         )}
  //       </div>
  //     );
  //   },
  // },
];
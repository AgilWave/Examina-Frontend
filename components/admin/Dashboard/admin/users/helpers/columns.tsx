import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { User } from "./type";
import { AiOutlineCloseSquare } from "react-icons/ai";
import { IoIosCheckbox } from "react-icons/io";

export const columns: ColumnDef<User>[] = [
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
    accessorKey: "name", 
    header: () => (
      <div className="max-w-[100px] font-poppins 2xl:text-[14px] text-[11px]">
        Name
      </div>
    ),
    cell: ({ row }) => {
      const userName = row.original.name as string;
      return (
        <div className="capitalize max-w-[100px] font-poppins 2xl:text-[14px] text-[11px]">
          {userName}
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: () => (
      <div className="max-w-[100px] font-poppins 2xl:text-[14px] text-[11px]">
        Email
      </div>
    ),
    cell: ({ row }) => {
      const email = row.original.email as string;
      return (
        <div className="max-w-[100px] font-poppins 2xl:text-[14px] text-[11px]">
          {email}
        </div>
      );
    },
  },
  {
    accessorKey: "status", 
    header: () => (
      <div className="text-center max-w-[50px] font-poppins 2xl:text-[14px] text-[11px]">
        Status
      </div>
    ),
    cell: ({ row }) => {
      const isActive = row.original.isBlacklisted as boolean;
      return (
        <div className="text-center max-w-[50px] font-poppins 2xl:text-[14px] text-[11px]">
          {isActive ? (
            <AiOutlineCloseSquare className="inline rounded-full text-red-500 text-[22px]" />
          ) : (
            <IoIosCheckbox className="inline rounded-full text-primary text-[22px]" />
          )}
        </div>
      );
    },
  },
];
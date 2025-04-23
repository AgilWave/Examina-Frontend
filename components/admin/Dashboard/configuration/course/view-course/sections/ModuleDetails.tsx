"use client";
import { Faculty } from "@/components/admin/Dashboard/configuration/course/view-course/sections/selectors/DropdownFaculty";
import { ModuleSelector } from "@/components/admin/Dashboard/configuration/course/view-course/sections/table/Table";

export default function ModuleDetails() {
    return (
      <div className="space-y-6">
        <Faculty />
        <ModuleSelector />
      </div>
    );
  }  
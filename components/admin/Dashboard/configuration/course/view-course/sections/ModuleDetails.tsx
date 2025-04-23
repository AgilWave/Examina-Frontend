"use client";

import { useState } from "react";
import { Faculty } from "@/components/admin/Dashboard/configuration/course/view-course/sections/selectors/DropdownFaculty";
import { ModuleSelector } from "@/components/admin/Dashboard/configuration/course/view-course/sections/table/Table";

export default function ModuleDetails() {
    const [records, setRecords] = useState<
      { faculty: string; batch: string; module: string }[]
    >([]);
  
    const handleAddRecord = (newRecord: {
      faculty: string;
      batch: string;
      module: string;
    }) => {
      setRecords((prev) => [...prev, newRecord]);
    };
  
    return (
      <div className="space-y-6">
        <Faculty />
        <ModuleSelector />
      </div>
    );
  }  
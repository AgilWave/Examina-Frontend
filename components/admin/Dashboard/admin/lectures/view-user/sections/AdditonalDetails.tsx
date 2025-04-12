"use client";

import { useState } from "react";
import { DropdownSelectorGroup } from "@/components/admin/Dashboard/admin/lectures/view-user/sections/selectors/DropdownSelectorGroup";
import { FacultyTable } from "@/components/admin/Dashboard/admin/lectures/view-user/sections/table/Table";

export default function FacultyBatchModuleManager() {
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
        <DropdownSelectorGroup onAdd={handleAddRecord} />
        <FacultyTable data={records} />
      </div>
    );
  }
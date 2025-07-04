"use client";
import React from "react";
import Header from "./Header";
import DataTable from "./DataTable";

function Exam() {
  return (
    <div className="h-fit p-1 md:p-8">
      <div className="max-w-8xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-center mb-4 md:mb-8 gap-4">
          <Header />
        </div>
      </div>
      <DataTable />
    </div>
  );
}

export default Exam;

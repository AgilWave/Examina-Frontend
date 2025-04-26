import React from "react";
import { FacultyName } from "../inputs/FacultyName";
import ActiveSwitch from "../inputs/switches/ActiveSwitch";

function FacultyDetails() {
  return (
    <div className="w-full flex flex-col gap-6">
      <div className="w-full flex flex-col lg:flex-row gap-6 items-start">
        <div className="w-full lg:w-3/4 md:h-[44vh]  bg-white dark:bg-black/30 p-3 rounded-lg border border-slate-100 dark:border-slate-700 shadow-sm">
          <h3 className="text-lg font-medium mb-4 text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-700 pb-2">
            Faculty Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
            <FacultyName />
          </div>
        </div>

        <div className="flex flex-col w-full lg:w-1/4 gap-4">
          <div className=" bg-white dark:bg-black/30 p-5 rounded-lg border border-slate-100 dark:border-slate-700 shadow-sm">
            <h3 className="text-lg font-medium mb-4 text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-700 pb-2">
              Status Actions
            </h3>
            <div className="flex flex-col gap-4">
            <ActiveSwitch />
            </div>
           
          </div>
        </div>
      </div>
    </div>
  );
}

export default FacultyDetails;

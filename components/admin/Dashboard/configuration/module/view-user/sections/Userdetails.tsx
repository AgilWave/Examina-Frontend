import React from "react";
import { ModuleName } from "../inputs/ModuleName";
import { FacultyName } from "../inputs/FacultyName";
import BlackListSwitch from "../inputs/switches/BlackListSwitch";

function UserDetails() {
  return (
    <div className="w-full flex flex-col gap-6 ">
      <div className="w-full flex flex-col lg:flex-row gap-6 items-start">
        <div className="w-full lg:w-3/4 bg-white dark:bg-black/30 p-4 rounded-lg border border-slate-100 dark:border-slate-700 shadow-sm sm:h-[340px]">
          <h3 className="text-lg font-medium mb-4 text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-700 pb-2">
            Batch Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ModuleName />
            <FacultyName />
          </div>
        </div>

        <div className="w-full lg:w-1/4">
          <div className="bg-white dark:bg-black/30 p-4 rounded-lg border border-slate-100 dark:border-slate-700 shadow-sm h-full">
            <h3 className="text-lg font-medium mb-4 text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-700 pb-2">
              Status Controls
            </h3>
            <div className="flex flex-col gap-4">
              <BlackListSwitch />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDetails;
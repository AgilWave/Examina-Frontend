import React from "react";
import { CourseName } from "../inputs/CourseName";
import { ModuleSelector } from "../inputs/ModuleName";
import { Faculty } from "../inputs/FaculyName";

function Coursedetails() {
  return (
    <div className="w-full px-3 py-6 flex flex-col items-center">
      <div className="w-full flex flex-col gap-5 max-w-[1000px]">
        <div className="w-full">
          <CourseName />
          <Faculty />
          <ModuleSelector />
        </div>
        </div>
      </div>
  );
}

export default Coursedetails;

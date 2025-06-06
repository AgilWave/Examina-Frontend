import React from "react";
import { ModuleName } from "../inputs/ModuleName";
import { FacultyName } from "../inputs/FacultyName";

function Moduletails() {
  return (
    <div className="w-full px-3 py-6 flex flex-col items-center">
      <div className="w-full flex flex-col gap-5 max-w-[1000px]">
        <div className="w-full">
          <ModuleName />
        </div>
        <div className="w-full">
          <FacultyName />
        </div>
      </div>
    </div>
  );
}

export default Moduletails;

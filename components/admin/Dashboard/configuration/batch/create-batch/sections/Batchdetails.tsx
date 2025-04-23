import React from "react";
import { BatchName } from "../inputs/BatchName";
import { CourseName } from "../inputs/CourseName";
import Years from "../inputs/Years";

function Batchdetails() {
  return (
    <div className="w-full px-3 py-6 flex flex-col items-center">
      <div className="w-full flex flex-col gap-5 max-w-[1000px]">
        <div className="w-full">
          <BatchName />
        </div>
        <div className="w-full">
          <CourseName />
        </div>
        <div className="w-full">
          <Years />
        </div>
      </div>
    </div>
  );
}

export default Batchdetails;

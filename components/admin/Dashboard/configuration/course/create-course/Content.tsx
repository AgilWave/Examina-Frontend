import React from "react";
import CourseDetails from "./sections/Coursedetails";

function Content() {
  return (
    <>
      <div className="w-full md:w-[550px] px-3 py-6 flex flex-col h-fit justify-between items-center">
        <div className="flex w-full flex-col gap-5">
          <div className="w-full flex  flex-col gap-[30px]">
            <CourseDetails />
          </div>
        </div>
      </div>
    </>
  );
}

export default Content;

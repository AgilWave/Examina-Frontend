import React from "react";
import BatchDetails from "./sections/Batchdetails";

function Content() {
  return (
    <>
      <div className="w-full px-3 py-6 flex flex-col h-fit justify-between items-center">
        <div className="flex w-full flex-col gap-5">
          <div className="w-full flex  flex-col gap-[30px]">
            <BatchDetails />
          </div>
        </div>
      </div>
    </>
  );
}

export default Content;

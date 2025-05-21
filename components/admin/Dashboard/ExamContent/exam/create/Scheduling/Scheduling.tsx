
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarClock } from "lucide-react";

export const Scheduling = () => {
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [durationMessage, setDurationMessage] = useState(
    "Please select both start and end times to see the exam duration"
  );

  useEffect(() => {
    if (startTime && endTime) {
      const [startHour, startMin] = startTime.split(":").map(Number);
      const [endHour, endMin] = endTime.split(":").map(Number);

      const start = new Date();
      start.setHours(startHour, startMin, 0, 0);

      const end = new Date();
      end.setHours(endHour, endMin, 0, 0);

      const diffMs = end.getTime() - start.getTime();

      if (diffMs > 0) {
        const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        const hoursStr =
          diffHrs > 0 ? `${diffHrs} hr${diffHrs > 1 ? "s" : ""}` : "";
        const minsStr =
          diffMins > 0 ? `${diffMins} min${diffMins > 1 ? "s" : ""}` : "";
        const finalDuration = `${hoursStr} ${minsStr}`.trim() || "0 min";
        setDurationMessage(
          `Duration: The exam is scheduled to run for ${finalDuration}`
        );
      } else {
        setDurationMessage("Duration: Invalid time range");
      }
    } else {
      setDurationMessage(
        "Please select both start and end times to see the exam duration"
      );
    }
  }, [startTime, endTime]);

  return (
    <div className="p-6 border rounded-2xl shadow-md w-full bg-white dark:bg-card dark:border-black/20">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-3  ">
        <CalendarClock className="text-teal-600 bg-teal-500/20 p-2 rounded-full" size={40}/>
        <div>
          <h3 className="text-xl font-semibold text-black dark:text-white">Scheduling</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Shedule your exam</p>
        </div>
      </div>
        {/* <h2 className="text-xl font-semibold mb-4 text-black dark:text-white flex items-center gap-2">
          <span className="bg-teal-100 dark:bg-teal-100 text-teal-600 dark:text-teal-300 p-2 rounded-full">
            <CalendarClock className=" text-teal-600" size={20} />
          </span>
          Scheduling
        </h2> */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label className="mb-2 text-gray-700 dark:text-white">Exam Date</Label>
          <Input type="date"
          className="text-gray-500 dark:text-white" />
        </div>
        <div>
          <Label className="mb-2 text-gray-700 dark:text-white" >Start Time</Label>
          <Input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </div>
        <div>
          <Label className="mb-2 text-gray-700 dark:text-white">End Time</Label>
          <Input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </div>
      </div>

      {/* Always-visible duration message */}
      <div className="mt-4 text-md text-teal-800 dark:text-teal-500 bg-teal-50 dark:bg-card rounded-lg px-4 py-2 border border-teal-200 dark:border-teal-700 w-full ">
        <div className="font-bold mb-5 mt-2">Duration Information</div>
        {durationMessage}
      </div>
    </div>
  );
};

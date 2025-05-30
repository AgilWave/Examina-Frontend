import React, { useEffect } from "react";
import { Label } from "@/components/ui/label";
import { CalendarClock } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { TimePicker } from "@/components/ui/time-picker";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  setCreateExamDate,
  setCreateExamStartTime,
  setCreateExamEndTime,
} from "@/redux/features/examSlice";

export const Scheduling = () => {
  const dispatch = useDispatch();
  const examState = useSelector((state: RootState) => state.exam.createExam);
  const [durationMessage, setDurationMessage] = React.useState(
    "Please select both start and end times to see the exam duration"
  );

  const createISODateString = (date: string, time: string) => {
    if (!date || !time) return "";
    try {
      const [hours, minutes] = time.split(":").map(Number);
      if (isNaN(hours) || isNaN(minutes)) return "";
      
      const dateObj = new Date(date);
      dateObj.setHours(hours, minutes, 0, 0);
      return dateObj.toISOString();
    } catch (error) {
      console.error("Error creating ISO date string:", error);
      return "";
    }
  };

  const formatTimeForDisplay = (isoString: string) => {
    try {
      if (!isoString) return "";
      const date = new Date(isoString);
      if (isNaN(date.getTime())) return "";
      return format(date, "HH:mm");
    } catch (error) {
      console.error("Error formatting time:", error);
      return "";
    }
  };

  useEffect(() => {
    if (examState.startTime && examState.endTime && examState.examDate) {
      try {
        const startDate = new Date(examState.startTime);
        const endDate = new Date(examState.endTime);

        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
          setDurationMessage("Duration: Invalid time values");
          return;
        }

        const diffMs = endDate.getTime() - startDate.getTime();

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
      } catch (error) {
        console.error("Error calculating duration:", error);
        setDurationMessage("Duration: Error calculating duration");
      }
    } else {
      setDurationMessage(
        "Please select both start and end times to see the exam duration"
      );
    }
  }, [examState.startTime, examState.endTime, examState.examDate]);

  const handleTimeChange = (time: string, isStart: boolean) => {
    if (!time) {
      if (isStart) {
        dispatch(setCreateExamStartTime(""));
      } else {
        dispatch(setCreateExamEndTime(""));
      }
      return;
    }

    if (examState.examDate) {
      const isoString = createISODateString(examState.examDate, time);
      if (isoString) {
        if (isStart) {
          dispatch(setCreateExamStartTime(isoString));
        } else {
          dispatch(setCreateExamEndTime(isoString));
        }
      }
    } else {
      // If no date is selected, just store the time component
      if (isStart) {
        dispatch(setCreateExamStartTime(time));
      } else {
        dispatch(setCreateExamEndTime(time));
      }
    }
  };

  return (
    <div className="p-6 border rounded-2xl shadow-md w-full bg-white dark:bg-card dark:border-black/20">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-3">
          <CalendarClock className="text-teal-600 bg-teal-500/20 p-2 rounded-full" size={40}/>
          <div>
            <h3 className="text-xl font-semibold text-black dark:text-white">Scheduling</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Schedule your exam</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label className="mb-2 text-gray-700 dark:text-white">Exam Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !examState.examDate && "text-muted-foreground"
                )}
              >
                {examState.examDate ? format(new Date(examState.examDate), "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={examState.examDate ? new Date(examState.examDate) : undefined}
                onSelect={(date) => {
                  const newDate = date ? format(date, "yyyy-MM-dd") : "";
                  dispatch(setCreateExamDate(newDate));
                  // Update times with new date if they exist
                  if (examState.startTime) {
                    handleTimeChange(formatTimeForDisplay(examState.startTime), true);
                  }
                  if (examState.endTime) {
                    handleTimeChange(formatTimeForDisplay(examState.endTime), false);
                  }
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div>
          <Label className="mb-2 text-gray-700 dark:text-white">Start Time</Label>
          <TimePicker 
            value={formatTimeForDisplay(examState.startTime)} 
            onChange={(time) => handleTimeChange(time, true)} 
            placeholder="HH:MM" 
          />
        </div>
        <div>
          <Label className="mb-2 text-gray-700 dark:text-white">End Time</Label>
          <TimePicker 
            value={formatTimeForDisplay(examState.endTime)} 
            onChange={(time) => handleTimeChange(time, false)} 
            placeholder="HH:MM" 
          />
        </div>
      </div>

      <div className="mt-4 text-md text-teal-800 dark:text-teal-500 bg-teal-50 dark:bg-card rounded-lg px-4 py-2 border border-teal-200 dark:border-teal-700 w-full">
        <div className="font-bold mb-5 mt-2">Duration Information</div>
        {durationMessage}
      </div>
    </div>
  );
};

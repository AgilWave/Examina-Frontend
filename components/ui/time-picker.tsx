"use client";

import * as React from "react";
import { Clock } from "lucide-react";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface TimePickerProps {
  value?: string; // Format: "HH:mm" (e.g., "14:30")
  onChange?: (time: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function TimePicker({ 
  value, 
  onChange, 
  placeholder = "Select time",
  className,
  disabled = false
}: TimePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedHour, setSelectedHour] = React.useState<number | null>(null);
  const [selectedMinute, setSelectedMinute] = React.useState<number | null>(null);

  // Parse the initial value
  React.useEffect(() => {
    if (value) {
      const [hourStr, minuteStr] = value.split(':');
      const hour = parseInt(hourStr);
      const minute = parseInt(minuteStr);
      
      if (!isNaN(hour) && !isNaN(minute)) {
        setSelectedHour(hour);
        setSelectedMinute(minute);
      }
    }
  }, [value]);

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 12 }, (_, i) => i * 5);

  const handleHourSelect = (hour: number) => {
    setSelectedHour(hour);
    const minute = selectedMinute ?? 0;
    const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    onChange?.(timeString);
  };

  const handleMinuteSelect = (minute: number) => {
    setSelectedMinute(minute);
    const hour = selectedHour ?? 0;
    const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    onChange?.(timeString);
  };

  const formatDisplayTime = () => {
    if (selectedHour !== null && selectedMinute !== null) {
      return `${selectedHour.toString().padStart(2, '0')}:${selectedMinute.toString().padStart(2, '0')}`;
    }
    return null;
  };

  const displayTime = formatDisplayTime();

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full justify-start text-left font-normal",
            !displayTime && "text-muted-foreground",
            className
          )}
        >
          <Clock className="mr-2 h-4 w-4" />
          {displayTime || placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex">
          <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
            {/* Hours */}
            <ScrollArea className="w-64 sm:w-auto">
              <div className="flex sm:flex-col p-2">
                {hours.map((hour) => (
                  <Button
                    key={hour}
                    size="icon"
                    variant={selectedHour === hour ? "default" : "ghost"}
                    className="sm:w-full shrink-0 aspect-square"
                    onClick={() => handleHourSelect(hour)}
                  >
                    {hour.toString().padStart(2, '0')}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="sm:hidden" />
            </ScrollArea>
            
            {/* Minutes */}
            <ScrollArea className="w-64 sm:w-auto">
              <div className="flex sm:flex-col p-2">
                {minutes.map((minute) => (
                  <Button
                    key={minute}
                    size="icon"
                    variant={selectedMinute === minute ? "default" : "ghost"}
                    className="sm:w-full shrink-0 aspect-square"
                    onClick={() => handleMinuteSelect(minute)}
                  >
                    {minute.toString().padStart(2, '0')}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="sm:hidden" />
            </ScrollArea>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

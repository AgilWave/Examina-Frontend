"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TimerIcon } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MultiSelectQuestionProps {
  question: string;
  options: string[];
  currentQuestion: number;
  totalQuestions: number;
  selected: number[];
  onSelect: (index: number) => void;
  onNext: () => void;
  time: string;
  attachment?: string;
}

export function MultiSelectQuestion({
  question,
  options,
  currentQuestion,
  totalQuestions,
  selected,
  onSelect,
  onNext,
  time,
  attachment,
}: MultiSelectQuestionProps) {
  return (
    <div className="fixed inset-0 w-full h-screen z-50 flex flex-col items-center p-6 bg-white dark:bg-black text-black dark:text-white">
      {/* Top bar with question progress and timer */}
      <div className="w-[90vw] flex justify-between items-center">
        <div className="flex gap-1">
          {[...Array(totalQuestions)].map((_, idx) => (
            <div
              key={idx}
              className={cn(
                "h-1.5 w-6 rounded-full",
                idx < currentQuestion
                  ? "bg-teal-600"
                  : "bg-gray-300 dark:bg-gray-700"
              )}
            />
          ))}
        </div>
        <div className="flex items-center gap-2 text-sm border px-3 py-1.5 rounded-full">
          <TimerIcon className="w-4 h-4 text-orange-500" />
          <span>{time}</span>
        </div>
      </div>
      {/* Main content with question and answers in two columns */}
      <div className="mt-6 w-[90vw] flex-1 flex flex-col md:flex-row gap-6 mb-6">
        {/* Left side - Question with scrollable area */}
        <div className="w-full md:w-2/5 border rounded-lg p-5 shadow-md flex flex-col">
          <h3 className="font-medium text-lg mb-3">
            Question {currentQuestion}
          </h3>
          <ScrollArea className="flex-1 pr-4 max-h-[65vh]">
            <div className="text-base">{question}</div>

            {/* Attachment section below the question if present */}
            {attachment && (
              <div className="mt-4 border-t pt-4">
                <h4 className="font-medium text-sm mb-2">Attachment</h4>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
                  {/* Display attachment - could be an image, PDF link, or other content */}
                  <img
                    src={attachment}
                    alt="Question attachment"
                    className="max-w-full rounded"
                  />
                </div>
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Right side - Answer options */}
        <div className="w-[90vw] md:w-3/5 border rounded-lg p-5 shadow-md">
          <h3 className="font-medium text-lg">Select your answer(s)</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">You may select multiple correct options</p>{" "}
          <div className="grid grid-cols-1 gap-4 mt-2">
            {options.map((option: string, index: number) => (
              <Card
                key={index}
                className={cn(
                  "p-4 cursor-pointer border transition",
                  selected.includes(index)
                    ? "bg-teal-100 dark:bg-teal-800 text-black dark:text-white"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800"
                )}
                onClick={() => onSelect(index)}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      "flex justify-center items-center h-6 w-6 rounded-md text-sm font-medium",
                      selected.includes(index)
                        ? "bg-teal-600 text-white"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                    )}
                  >
                    {selected.includes(index) ? "✓" : ""}
                  </div>
                  <p className="flex-1 text-base">{option}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>{" "}
      {/* Bottom section with navigation button */}
      <div className="w-[90vw] flex justify-end items-end mb-6">
        {/* Navigation button */}
        <Button className="px-8 py-2 text-base" onClick={onNext}>
          Next Question
        </Button>
      </div>
    </div>
  );
}

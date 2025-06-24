'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { TimerIcon } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';

interface StructuredQuestionProps {
  question: string;
  currentQuestion: number;
  totalQuestions: number;
  answer: string;
  setAnswer: (value: string) => void;
  onNext: () => void;
  time: string;
  attachment?: string;
  isLastQuestion?: boolean;
}

export function StructuredQuestion({
  question,
  currentQuestion,
  totalQuestions,
  answer,
  setAnswer,
  onNext,
  time,
  attachment,
  isLastQuestion = false,
}: StructuredQuestionProps) {
  return (
    <div className="fixed inset-0 w-full h-screen z-50 flex flex-col items-center p-6 bg-white dark:bg-black text-black dark:text-white">
      {/* Top bar with question progress and timer */}
      <div className="w-[90vw] flex justify-between items-center">
        <div className="flex gap-1">
          {[...Array(totalQuestions)].map((_, idx) => (
            <div
              key={idx}
              className={cn(
                'h-1.5 w-6 rounded-full',
                idx < currentQuestion ? 'bg-teal-600' : 'bg-gray-300 dark:bg-gray-700'
              )}
            />
          ))}
        </div>
        <div className="flex items-center gap-2 text-sm border px-3 py-1.5 rounded-full">
          <TimerIcon className="w-4 h-4 text-orange-500" />
          <span>{time}</span>
        </div>
      </div>

      {/* Main content with question and answer area in two columns */}
      <div className="mt-6 w-[90vw] flex-1 flex flex-col md:flex-row gap-6 mb-6">
        {/* Left side - Question with scrollable area */}
        <div className="w-full md:w-2/5 border rounded-lg p-5 shadow-md flex flex-col">
          <h3 className="font-medium text-lg mb-3">Question {currentQuestion}</h3>
          <ScrollArea className="flex-1 pr-4 max-h-[65vh]">
            <div className="text-base">
              {question}
            </div>
            
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
        
        {/* Right side - Answer area */}
        <div className="w-full md:w-3/5 border rounded-lg p-5 shadow-md flex flex-col">
          <h3 className="font-medium text-lg mb-3">Your Answer</h3>
          <div className="flex-1">
            <Textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your answer here..."
              className="w-full h-full min-h-[300px] resize-vertical border-gray-300 dark:border-gray-700 focus:border-teal-500 dark:focus:border-teal-500"
            />
          </div>
        </div>
      </div>

      {/* Bottom section with navigation button */}
      <div className="w-[90vw] flex justify-end items-end mb-6">
        {/* Navigation button */}
        <Button 
          className={cn(
            "px-8 py-2 text-base",
            isLastQuestion 
              ? "bg-red-600 hover:bg-red-700 text-white" 
              : "bg-teal-600 hover:bg-teal-700 text-white"
          )} 
          onClick={onNext}
        >
          {isLastQuestion ? 'Submit and End Exam' : 'Next Question'}
        </Button>
      </div>
    </div>
  );
}

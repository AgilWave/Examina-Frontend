'use client';

import { cn } from '@/lib/utils';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center">
      {Array.from({ length: totalSteps }, (_, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isCompleted = stepNumber < currentStep;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const isNext = stepNumber === currentStep + 1;
        
        return (
          <div key={stepNumber} className="flex items-center">
            <div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300",
                {
                  "bg-teal-600 text-white shadow-lg shadow-teal-500/25": isActive,
                  "bg-teal-700 text-white": isCompleted,
                  "bg-card text-gray-400": !isActive && !isCompleted,
                }
              )}
            >
              {stepNumber}
            </div>
            
            {/* Connecting line */}
            {stepNumber < totalSteps && (
              <div 
                className={cn(
                  "w-12 h-0.5 transition-all duration-300",
                  {
                    "bg-teal-500": isCompleted,
                    "bg-card": !isCompleted,
                  }
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
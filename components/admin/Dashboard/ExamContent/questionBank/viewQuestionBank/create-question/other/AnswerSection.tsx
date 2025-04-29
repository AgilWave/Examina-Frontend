"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AnswerOption {
  text: string;
  clarification: string;
}

interface AnswerSectionProps {
  correctAnswer: string;
  wrongAnswers: string[];
  onCorrectAnswerChange: (value: string) => void;
  onWrongAnswerChange: (index: number, value: string) => void;
  disabled?: boolean;
  errorCorrect?: string;
  errorWrong?: string;
}

const AnswerSection: React.FC<AnswerSectionProps> = ({
  correctAnswer,
  wrongAnswers,
  onCorrectAnswerChange,
  onWrongAnswerChange,
  disabled = false,
  errorCorrect,
  errorWrong,
}) => {
  // Combine correct + wrong answers into a full list
  const [answers, setAnswers] = useState<AnswerOption[]>([]);

  useEffect(() => {
    const combined = [correctAnswer, ...wrongAnswers];
    const filled = combined.map((ans) => ({
      text: ans,
      clarification: "",
    }));

    // Always have at least 3 options
    while (filled.length < 3) {
      filled.push({ text: "", clarification: "" });
    }
    setAnswers(filled);
  }, [correctAnswer, wrongAnswers]);

  const handleTextChange = (index: number, value: string) => {
    if (disabled) return;
    
    const updated = [...answers];
    updated[index].text = value;
    setAnswers(updated);

    if (index === 0) {
      onCorrectAnswerChange(value);
    } else {
      onWrongAnswerChange(index - 1, value);
    }
  };

  const handleClarificationChange = (index: number, value: string) => {
    if (disabled) return;
    
    const updated = [...answers];
    updated[index].clarification = value;
    setAnswers(updated);
  };

  const handleCorrectSelection = (index: number) => {
    if (disabled) return;
    
    const selectedAnswer = answers[index].text;
    const newWrongAnswers = answers
      .filter((_, idx) => idx !== index)
      .map((ans) => ans.text);

    onCorrectAnswerChange(selectedAnswer);
    newWrongAnswers.forEach((val, idx) => onWrongAnswerChange(idx, val));
  };

  return (
    <div className="space-y-6 w-full">
      <div className="flex justify-between">
        <Label className="text-lg font-semibold text-foreground">Answer Options</Label>
        {errorCorrect && (
          <span className="text-red-500 dark:text-red-400 text-sm">{errorCorrect}</span>
        )}
      </div>
      
      <div className="space-y-4">
        {answers.map((answer, index) => (
          <div
            key={index}
            className={`border rounded-lg p-4 space-y-3 transition 
              ${correctAnswer === answer.text ? 'border-teal-400 bg-teal-50 dark:bg-teal-900/20 dark:border-teal-600' : 'dark:border-slate-700 dark:bg-black/40'}
              ${(index === 0 && errorCorrect) || (index > 0 && errorWrong && !answer.text) ? 'border-red-400 dark:border-red-500' : ''}
              ${disabled ? 'opacity-70' : 'hover:shadow-md dark:hover:shadow-md dark:hover:shadow-emerald-900/5'}`}
          >
            <div className="flex items-start gap-3">
              <input
                type="radio"
                name="correct-answer"
                checked={correctAnswer === answer.text}
                onChange={() => handleCorrectSelection(index)}
                className="h-5 w-5 mt-2 accent-blue-600 dark:accent-teal-500"
                disabled={disabled}
              />
              <div className="flex flex-col w-full space-y-2">
                <Input
                  value={answer.text}
                  onChange={(e) => handleTextChange(index, e.target.value)}
                  placeholder={index === 0 ? 'Correct option' : `Option ${index}`}
                  className={`w-full ${(index === 0 && errorCorrect) || (index > 0 && errorWrong && !answer.text) 
                    ? 'border-red-400 focus-visible:ring-red-400 dark:border-red-500 dark:focus-visible:ring-red-500' : ''}`}
                  disabled={disabled}
                />
                <Input
                  value={answer.clarification}
                  onChange={(e) =>
                    handleClarificationChange(index, e.target.value)
                  }
                  placeholder={`Clarification (optional)`}
                  className="w-full text-sm"
                  disabled={disabled}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {errorWrong && (
        <p className="text-red-500 dark:text-red-400 text-sm">{errorWrong}</p>
      )}
    </div>
  );
};

export default AnswerSection;



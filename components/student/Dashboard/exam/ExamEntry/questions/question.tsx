'use client';

import { useState, useEffect } from 'react';
import { MCQQuestion } from './Mcq/mcq';
import { MultiSelectQuestion } from './MultiSelect/multiSelect';
import { StructuredQuestion } from './structure/structure';

export type QuestionType = 'mcq' | 'multiSelect' | 'structured';

export interface BaseQuestionData {
  id: string;
  question: string;
  type: QuestionType;
  attachment?: string;
}

export interface MCQQuestionData extends BaseQuestionData {
  type: 'mcq';
  options: string[];
  correctAnswer?: number; // For instructor view or results
}

export interface MultiSelectQuestionData extends BaseQuestionData {
  type: 'multiSelect';
  options: string[];
  correctAnswers?: number[]; // For instructor view or results
}

export interface StructuredQuestionData extends BaseQuestionData {
  type: 'structured';
  expectedAnswer?: string; // For instructor view or results
}

export type QuestionData = MCQQuestionData | MultiSelectQuestionData | StructuredQuestionData;

interface QuestionComponentProps {
  questions: QuestionData[];
  currentQuestionIndex: number;
  onNext: () => void;
  onPrevious?: () => void;
  onComplete: () => void;
  timeRemaining: string;
  onAnswerChange?: (answer: any) => void;
}

export function QuestionComponent({
  questions,
  currentQuestionIndex,
  onNext,
  onComplete,
  timeRemaining,
  onAnswerChange,
}: QuestionComponentProps) {
  const [mcqSelected, setMcqSelected] = useState<number | null>(null);
  const [multiSelectSelected, setMultiSelectSelected] = useState<number[]>([]);
  const [structuredAnswer, setStructuredAnswer] = useState<string>('');
  
  // Reset answers when question changes
  useEffect(() => {
    setMcqSelected(null);
    setMultiSelectSelected([]);
    setStructuredAnswer('');
  }, [currentQuestionIndex]);

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
  // MCQ selection handler
  const handleMcqSelect = (index: number) => {
    setMcqSelected(index);
    if (onAnswerChange) onAnswerChange(index);
  };

  // MultiSelect selection handler
  const handleMultiSelectSelect = (index: number) => {    const newSelected = (prev: number[]) => {
      // If already selected, remove it
      if (prev.includes(index)) {
        return prev.filter((i: number) => i !== index);
      }
      // Otherwise add it
      return [...prev, index];
    };
    
    setMultiSelectSelected(prev => {
      const updated = newSelected(prev);
      if (onAnswerChange) onAnswerChange(updated);
      return updated;
    });
  };

  // Structured question answer handler
  const handleStructuredAnswerChange = (value: string) => {
    setStructuredAnswer(value);
    if (onAnswerChange) onAnswerChange(value);
  };

  // Handle next button click
  const handleNextClick = () => {
    if (isLastQuestion) {
      onComplete();
    } else {
      onNext();
    }
  };

  // Render the appropriate question component based on the question type
  const renderQuestion = () => {
    if (!currentQuestion) return null;

    switch (currentQuestion.type) {
      case 'mcq':
        return (
          <MCQQuestion
            question={currentQuestion.question}
            options={currentQuestion.options}
            currentQuestion={currentQuestionIndex + 1}
            totalQuestions={totalQuestions}
            selected={mcqSelected}
            onSelect={handleMcqSelect}
            onNext={handleNextClick}
            time={timeRemaining}
            attachment={currentQuestion.attachment}
          />
        );
      
      case 'multiSelect':
        return (
          <MultiSelectQuestion
            question={currentQuestion.question}
            options={currentQuestion.options}
            currentQuestion={currentQuestionIndex + 1}
            totalQuestions={totalQuestions}
            selected={multiSelectSelected}
            onSelect={handleMultiSelectSelect}
            onNext={handleNextClick}
            time={timeRemaining}
            attachment={currentQuestion.attachment}
          />
        );
      
      case 'structured':
        return (
          <StructuredQuestion
            question={currentQuestion.question}
            currentQuestion={currentQuestionIndex + 1}
            totalQuestions={totalQuestions}
            answer={structuredAnswer}
            setAnswer={handleStructuredAnswerChange}
            onNext={handleNextClick}
            time={timeRemaining}
            attachment={currentQuestion.attachment}
          />
        );
      
      default:
        return <div>Unsupported question type</div>;
    }
  };

  return (
    <div>
      {renderQuestion()}
    </div>
  );
}

export default QuestionComponent;
'use client';

import { useState } from 'react';
import { QuestionComponent, QuestionData } from '@/components/student/Dashboard/exam/ExamEntry/questions/question';
import { Summary } from '@/components/student/Dashboard/exam/ExamEntry/questions/summary/summary';
import { Button } from '@/components/ui/button';

const ExamQuestionPage = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<string, any>>({});
  
  // Example questions with mixed types
  const exampleQuestions: QuestionData[] = [
    {
      id: '1',
      type: 'mcq',
      question: "What is the capital of France?",
      options: ["Berlin", "Paris", "Madrid", "Rome"]
    },
    {
      id: '2',
      type: 'multiSelect',
      question: "Select all the programming languages from the list:",
      options: ["JavaScript", "HTML", "Python", "CSS", "Java"]
    },
    {
      id: '3',
      type: 'structured',
      question: "Explain the process of photosynthesis in plants."
    },
    {
      id: '4',
      type: 'mcq',
      question: "Which planet is closest to the sun?",
      options: ["Venus", "Earth", "Mercury", "Mars"]
    },
    {
      id: '5',
      type: 'multiSelect',
      question: "Which of the following are mammals?",
      options: ["Shark", "Dolphin", "Eagle", "Bat", "Crocodile"]
    },
    {
      id: '6',
      type: 'structured',
      question: "Describe the impact of climate change on global ecosystems."
    }
  ];
    // Mock timer - in a real application, you would implement a proper timer
  const timeRemaining = "10:00";

  // Handle answer updates for different question types
  const handleAnswerUpdate = (answer: any) => {
    const currentQuestion = exampleQuestions[currentQuestionIndex];
    setUserAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: answer
    }));
  };
  
  const handleNext = () => {
    if (currentQuestionIndex < exampleQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };
  
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };
  
  const handleComplete = () => {
    // Toggle summary view instead of showing alert
    setShowSummary(true);
  };
  
  const handleQuestionClick = (questionId: string) => {
    // Find the index of the question with the given ID
    const questionIndex = exampleQuestions.findIndex(q => q.id === questionId);
    if (questionIndex !== -1) {
      setCurrentQuestionIndex(questionIndex);
      setShowSummary(false);
    }
  };
    return (
    <div className="container mx-auto py-4 px-4">
      {!showSummary ? (
        <>
          <div className="flex justify-end mb-4">
            <Button 
              variant="outline" 
              onClick={() => setShowSummary(true)}
              className="text-sm"
            >
              Show Summary
            </Button>
          </div>
          <QuestionComponent
            questions={exampleQuestions}
            currentQuestionIndex={currentQuestionIndex}
            onNext={handleNext}
            onPrevious={handlePrevious}
            onComplete={handleComplete}
            timeRemaining={timeRemaining}
            onAnswerChange={handleAnswerUpdate}
          />
        </>
      ) : (
        <Summary 
          questions={exampleQuestions}
          userAnswers={userAnswers}
          onQuestionClick={handleQuestionClick}
        />
      )}
    </div>
  );
};

export default ExamQuestionPage;
'use client';

import { MCQQuestion } from '@/components/student/Dashboard/exam/ExamEntry/questions/Mcq/mcq';
import { useState } from 'react';

const MCQQuestionTab = () => {
  // Example question data - you would typically fetch this from an API
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  const exampleQuestions = [
    {
      question: "What is the capital of France?",
      options: ["Berlin", "Paris", "Madrid", "Rome"]
    },
    {
      question: "Which planet is closest to the sun?",
      options: ["Venus", "Earth", "Mercury", "Mars"]
    },
    // Add more questions as needed
  ];
  
  const totalQuestions = exampleQuestions.length;
  const currentQuestion = exampleQuestions[currentQuestionIndex];
  
  const handleSelect = (index: number) => {
    setSelectedOption(index);
  };
  
  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null); // Reset selection for the next question
    } else {
      // Handle exam submission or completion
      alert("You've completed all questions!");
    }
  };
  
  // Mock timer - in a real application, you would implement a proper timer
  const timeRemaining = "10:00";
  
  return (
    <div>
      {currentQuestion && (
        <MCQQuestion 
          question={currentQuestion.question} 
          options={currentQuestion.options} 
          currentQuestion={currentQuestionIndex + 1} 
          totalQuestions={totalQuestions} 
          selected={selectedOption} 
          onSelect={handleSelect} 
          onNext={handleNext} 
          time={timeRemaining} 
        />
      )}
    </div>
  );
};

export default MCQQuestionTab;
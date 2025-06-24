"use client";

import { useState } from "react";
import { StepIndicator } from "./Stepper/Stepper";
import { MicCameraSetup } from "./MicCameraStep/MicCameraStep";
import { ConnectionStep } from "./ConnectionStep/ConnectionStep";
import { SystemCheckup } from "./systemcheck/system";
import { EnvironmentCheckup } from "./environment/environment";
import { DataManagement } from "./welcome/welcome";
import QuestionComponent from "./questions/question";

// Mock exam data for demonstration
const mockQuestions = [
  {
    id: "1",
    question: "What is the capital of France?",
    type: "mcq" as const,
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: 2
  },
  {
    id: "2",
    question: "Which programming languages are object-oriented?",
    type: "multiSelect" as const,
    options: ["Java", "Python", "C++", "Assembly"],
    correctAnswers: [0, 1, 2]
  },
  {
    id: "3",
    question: "Explain the concept of inheritance in object-oriented programming.",
    type: "structured" as const,
    expectedAnswer: "Inheritance allows a class to inherit properties and methods from another class."
  }
];

export default function ExamSetupPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [examId] = useState("test-exam-123"); // In real app, this would come from props or route
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [answers, setAnswers] = useState<{ [key: string]: any }>({});
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [timeRemaining, setTimeRemaining] = useState("45:00");
  const totalSteps = 6; // Added questions step

  const handleNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleAnswerChange = (answer: any) => {
    setAnswers(prev => ({
      ...prev,
      [mockQuestions[currentStep - 6]?.id]: answer
    }));
  };

  const handleExamComplete = () => {
    console.log("Exam completed with answers:", answers);
    // Here you would typically submit answers to backend
    setCurrentStep(totalSteps + 1); // Move to completion state
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <MicCameraSetup onNext={handleNextStep} />;
      case 2:
        return (
          <ConnectionStep onNext={handleNextStep} onPrev={handlePrevStep} />
        );
      case 3:
        return (
          <SystemCheckup onNext={handleNextStep} onPrev={handlePrevStep} />
        );
      case 4:
        return (
          <EnvironmentCheckup onNext={handleNextStep} onPrev={handlePrevStep} />
        );
      case 5:
        return (
          <DataManagement
            onNext={handleNextStep}
            onPrev={handlePrevStep}
            examId={examId}
            examStartTime={'2025-06-24T05:50:00Z'}
          />
        );
      case 6:
        return (
          <QuestionComponent
            questions={mockQuestions}
            currentQuestionIndex={0}
            onNext={handleNextStep}
            onComplete={handleExamComplete}
            timeRemaining={timeRemaining}
            onAnswerChange={handleAnswerChange}
            examId={examId}
          />
        );
      case 7:
        return (
          <div className="text-center space-y-8">
            <div className="space-y-3">
              <h1 className="text-3xl font-bold text-black dark:text-white">
                Exam Completed
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Thank you for completing the exam. Your answers have been submitted.
              </p>
            </div>
            <div className="bg-white dark:bg-card rounded-xl p-6 shadow-lg max-w-2xl mx-auto">
              <h3 className="text-xl font-semibold text-black dark:text-white mb-4">
                Summary
              </h3>
              <div className="space-y-2 text-left">
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Total Questions:</span> {mockQuestions.length}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Answered:</span> {Object.keys(answers).length}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Time Remaining:</span> {timeRemaining}
                </p>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="text-center text-white">
            Step {currentStep} - Coming Soon
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto">
        <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />
        <div className="mt-12">{renderCurrentStep()}</div>
      </div>
    </div>
  );
}

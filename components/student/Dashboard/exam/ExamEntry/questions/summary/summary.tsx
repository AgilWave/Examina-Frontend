import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Define the Question Data interface based on the provided example
interface QuestionData {
  id: string;
  type: 'mcq' | 'multiSelect' | 'structured';
  question: string;
  options?: string[];
}

// Interface for component props
export interface SummaryProps {
  questions: QuestionData[];
  userAnswers: Record<string, any>; // Map of question id to user answer
  onQuestionClick: (questionId: string) => void;
}

export const Summary: React.FC<SummaryProps> = ({ questions, userAnswers, onQuestionClick }) => {
  const router = useRouter();

  // Function to display user answers based on question type
  const renderAnswer = (question: QuestionData, answer: any) => {
    if (!answer) return <span className="text-red-500">Not answered</span>;

    switch (question.type) {
      case 'mcq':
        return <span>{question.options?.[answer] || answer}</span>;
      case 'multiSelect':
        if (Array.isArray(answer)) {
          return (
            <ul className="list-disc ml-4">
              {answer.map((optionIndex, idx) => (
                <li key={idx}>{question.options?.[optionIndex] || optionIndex}</li>
              ))}
            </ul>
          );
        }
        return <span>{answer}</span>;
      case 'structured':
        return <p className="text-sm italic">{answer}</p>;
      default:
        return <span>{JSON.stringify(answer)}</span>;
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-8 px-4">
      <h2 className="text-2xl font-bold mb-6">Questions Summary</h2>
      
      <div className="space-y-4">
        {questions.map((question) => (
          <Card key={question.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <CardContent className="p-0">
              <div 
                className="p-4 cursor-pointer"
                onClick={() => onQuestionClick(question.id)}
              >
                <div className="flex justify-between">
                  <span className="font-semibold">Question {question.id}</span>
                  <span className="text-sm px-2 py-1 bg-gray-100 dark:bg-teal-500 rounded-full">
                    {question.type === 'mcq' ? 'Multiple Choice' : 
                     question.type === 'multiSelect' ? 'Multiple Select' : 'Structured'}
                  </span>
                </div>
                <p className="mt-2 text-gray-800 dark:text-white">{question.question}</p>
                
                <div className="mt-3">
                  <p className="text-sm font-medium text-gray-500">Your Answer:</p>
                  <div className="mt-1 text-gray-300 ">
                    {renderAnswer(question, userAnswers[question.id])}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 flex justify-between">
        <Button variant="outline" onClick={() => router.back()}>
          Back to Exam
        </Button>
        <Button variant="default">
          Submit Exam
        </Button>
      </div>
    </div>
  );
};

// Example implementation with the provided questions
const ExampleSummary = () => {
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

  // Example user answers
  const exampleUserAnswers = {
    '1': 1, // Paris
    '2': [0, 2, 4], // JavaScript, Python, Java
    '3': "Photosynthesis is the process by which plants convert light energy into chemical energy...",
    '4': 2, // Mercury
    '5': [1, 3], // Dolphin, Bat
    // Question 6 not answered
  };

  // Example handler for question click
  const handleQuestionClick = (questionId: string) => {
    console.log(`Navigate to question ${questionId}`);
    // In a real implementation, you would navigate to the specific question
    // For example: router.push(`/exam/question/${questionId}`);
  };

  return (
    <Summary 
      questions={exampleQuestions}
      userAnswers={exampleUserAnswers}
      onQuestionClick={handleQuestionClick}
    />
  );
};

export default ExampleSummary;
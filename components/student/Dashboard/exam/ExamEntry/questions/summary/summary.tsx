'use client'
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, ArrowLeft, Send } from 'lucide-react';

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  userAnswers: Record<string, any>; 
  onQuestionClick: (questionId: string) => void;
  onBackToQuestions: () => void;
  onFinalSubmit: () => void;
}

export const Summary: React.FC<SummaryProps> = ({ 
  questions, 
  userAnswers, 
  onQuestionClick, 
  onBackToQuestions, 
  onFinalSubmit 
}) => {
  // Function to display user answers based on question type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderAnswer = (question: QuestionData, answer: any) => {
    if (!answer) return <span className="text-red-500 flex items-center gap-1"><XCircle className="w-4 h-4" />Not answered</span>;

    switch (question.type) {
      case 'mcq':
        return <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-teal-500" />{question.options?.[answer] || answer}</span>;
      case 'multiSelect':
        if (Array.isArray(answer)) {
          return (
            <div className="flex items-start gap-1">
              <CheckCircle className="w-4 h-4 text-teal-500 mt-0.5 flex-shrink-0" />
              <ul className="list-disc ml-4 space-y-1">
                {answer.map((optionIndex, idx) => (
                  <li key={idx} className="text-sm">{question.options?.[optionIndex] || optionIndex}</li>
                ))}
              </ul>
            </div>
          );
        }
        return <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-teal-500" />{answer}</span>;
      case 'structured':
        return (
          <div className="flex items-start gap-1">
            <CheckCircle className="w-4 h-4 text-teal-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm italic line-clamp-2">{answer}</p>
          </div>
        );
      default:
        return <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-teal-500" />{JSON.stringify(answer)}</span>;
    }
  };

  const getQuestionTypeIcon = (type: string) => {
    switch (type) {
      case 'mcq':
        return '🔘';
      case 'multiSelect':
        return '☑️';
      case 'structured':
        return '📝';
      default:
        return '❓';
    }
  };

  const getQuestionTypeLabel = (type: string) => {
    switch (type) {
      case 'mcq':
        return 'Multiple Choice';
      case 'multiSelect':
        return 'Multiple Select';
      case 'structured':
        return 'Structured';
      default:
        return 'Unknown';
    }
  };

  const answeredCount = questions.filter(q => userAnswers[q.id]).length;
  const totalQuestions = questions.length;

  return (
    <div className="fixed inset-0 w-full h-screen z-50 flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black text-black dark:text-white overflow-y-auto">
      <div className="w-full max-w-6xl mx-auto py-6 px-4">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
            Exam Summary
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Review your answers before final submission
          </p>
          <div className="mt-3 flex justify-center">
            <div className="bg-white dark:bg-gray-800 rounded-full px-4 py-2 shadow-sm border border-gray-200 dark:border-gray-700">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {answeredCount} of {totalQuestions} questions answered
              </span>
            </div>
          </div>
        </div>
        
        {/* Questions Grid */}
        <div className="grid gap-3 mb-6">
          {questions.map((question, index) => (
            <Card 
              key={question.id} 
              className="group cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-teal-300 dark:hover:border-teal-600"
              onClick={() => onQuestionClick(question.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-teal-100 dark:bg-gray-800 text-teal-600 dark:text-teal-400 text-sm font-semibold group-hover:bg-teal-200 dark:group-hover:bg-teal-800 transition-colors">
                      {index + 1}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getQuestionTypeIcon(question.type)}</span>
                      <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-full font-medium">
                        {getQuestionTypeLabel(question.type)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {userAnswers[question.id] ? (
                      <CheckCircle className="w-5 h-5 text-teal-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                </div>
                
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-3 line-clamp-2">
                  {question.question}
                </p>
                
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
                    Your Answer:
                  </p>
                  <div className="text-gray-700 dark:text-gray-300 text-sm">
                    {renderAnswer(question, userAnswers[question.id])}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button 
            variant="outline" 
            onClick={onBackToQuestions}
            className="flex items-center gap-2 px-6 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Exam
          </Button>
          
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium text-teal-600 dark:text-teal-400">{answeredCount}</span> answered • 
              <span className="font-medium text-red-600 dark:text-red-400 ml-1">{totalQuestions - answeredCount}</span> remaining
            </div>
            <Button 
              variant="default" 
              onClick={onFinalSubmit}
              className="flex items-center gap-2 px-8 py-2 text-sm bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Send className="w-4 h-4" />
              Submit Exam
            </Button>
          </div>
        </div>
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
      onBackToQuestions={() => console.log('Back to questions')}
      onFinalSubmit={() => console.log('Final submit')}
    />
  );
};

export default ExampleSummary;
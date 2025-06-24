"use client";

import { useState, useEffect } from "react";
import { StepIndicator } from "./Stepper/Stepper";
import { MicCameraSetup } from "./MicCameraStep/MicCameraStep";
import { ConnectionStep } from "./ConnectionStep/ConnectionStep";
import { SystemCheckup } from "./systemcheck/system";
import { EnvironmentCheckup } from "./environment/environment";
import { DataManagement } from "./welcome/welcome";
import QuestionComponent, { QuestionData } from "./questions/question";
import { getExamById } from "@/services/exams/getExamById";
import { submitExamAnswers, ExamAnswerSubmission } from "@/services/exams/submitExamAnswers";
import { joinExam, updateConnectionStatus } from "@/services/exams/joinExam";
import { checkParticipantStatus, ParticipantStatus } from "@/services/exams/checkParticipantStatus";
import { updateParticipantStatus } from "@/services/exams/updateParticipantStatus";
import { Exam, ExamQuestion } from "@/types/exam";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { decrypt } from "@/lib/encryption";
import Cookies from "js-cookie";
import { Summary } from '@/components/student/Dashboard/exam/ExamEntry/questions/summary/summary';

// Helper function to convert ExamQuestion to QuestionData
const convertExamQuestionsToQuestionData = (examQuestions: ExamQuestion[]): QuestionData[] => {
  return examQuestions.map((q, index) => {
    const baseQuestion = {
      id: q.id?.toString() || index.toString(),
      question: q.text,
      attachment: q.attachment || undefined,
    };

    const questionType = q.type?.toLowerCase();

    if (questionType === 'mcq') {
      return {
        ...baseQuestion,
        type: 'mcq' as const,
        options: q.answerOptions?.map((opt) => opt.text) || [],
        correctAnswer: q.answerOptions?.findIndex((opt) => opt.isCorrect) || 0
      };
    } else if (questionType === 'multiselect') {
      return {
        ...baseQuestion,
        type: 'multiSelect' as const,
        options: q.answerOptions?.map((opt) => opt.text) || [],
        correctAnswers: q.answerOptions?.map((opt, idx: number) => opt.isCorrect ? idx : -1).filter((idx: number) => idx !== -1)
      };
    } else {
      return {
        ...baseQuestion,
        type: 'structured' as const,
        expectedAnswer: '' // Default empty string for structured questions
      };
    }
  });
};

export default function ExamSetupPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [examData, setExamData] = useState<Exam | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasJoined, setHasJoined] = useState(false);
  const [participantStatus, setParticipantStatus] = useState<ParticipantStatus | null>(null);
  const [isReturningUser, setIsReturningUser] = useState(false);
  const [showReturningUserMessage, setShowReturningUserMessage] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [answers, setAnswers] = useState<{ [key: string]: any }>({});
  const [timeRemaining, setTimeRemaining] = useState<string>("00:00");
  const [examStartTime, setExamStartTime] = useState<Date | null>(null);
  const [examEndTime, setExamEndTime] = useState<Date | null>(null);
  const [examEnded, setExamEnded] = useState(false);
  const [examSubmitted, setExamSubmitted] = useState(false);
  const searchParams = useSearchParams();
  const examId = searchParams.get("examId");

  const totalSteps = isReturningUser ? 2 : 6;

  // Calculate remaining time
  const calculateTimeRemaining = () => {
    if (!examEndTime) return "00:00";

    const now = new Date();
    const endTime = new Date(examEndTime);
    const diff = endTime.getTime() - now.getTime();

    if (diff <= 0) {
      return "00:00";
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Update time remaining every second
  useEffect(() => {
    if (!examEndTime) return;

    const timer = setInterval(() => {
      const remaining = calculateTimeRemaining();
      setTimeRemaining(remaining);

      // Auto-submit when time runs out
      if (remaining === "00:00:00" && currentStep === 6) {
        handleExamComplete();
      }

      // Check if exam has ended
      const now = new Date();
      const endTime = new Date(examEndTime);
      if (endTime < now && !examEnded) {
        setExamEnded(true);
        if (currentStep === 6) {
          handleExamComplete();
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [examEndTime, currentStep, examEnded]);

  // Get student details from cookies
  const getStudentDetails = () => {
    try {
      const userData = Cookies.get("userDetails");
      if (userData) {
        const decryptedData = decrypt(userData);
        const parsedData = JSON.parse(decryptedData);
        return {
          id: parsedData.id,
          studentId: parsedData.studentDetails?.id,
          studentName: parsedData.name,
        };
      }
      return null;
    } catch (error) {
      console.error("Error parsing user details:", error);
      return null;
    }
  };

  // Place this at the top level inside ExamSetupPage, after all useState declarations
  useEffect(() => {
    if (showReturningUserMessage) {
      const timer = setTimeout(() => {
        setShowReturningUserMessage(false);
        setCurrentStep(6); // Go to exam questions
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showReturningUserMessage]);

  // Update the checkIfReturningUser function to set showReturningUserMessage
  const checkIfReturningUser = async (examId: number, studentId: number) => {
    try {
      const status = await checkParticipantStatus(examId, studentId);
      setParticipantStatus(status);
      
      // Check if exam is already submitted
      if (status.isSubmitted) {
        setExamSubmitted(true);
        toast.error("You have already submitted this exam. Cannot attempt again.");
        return status;
      }
      
      if (status.hasJoined) {
        setIsReturningUser(true);
        setShowReturningUserMessage(true);
        setCurrentStep(5);
        toast.success("Welcome back! Continuing from where you left off.");
      }
      return status;
    } catch (error) {
      console.error("Error checking participant status:", error);
      return null;
    }
  };

  // Update connection status when component mounts/unmounts
  useEffect(() => {
    const studentDetails = getStudentDetails();

    if (examData && studentDetails?.id) {
      checkIfReturningUser(examData.id, studentDetails.studentId).then(() => {
        // Only join if not already joined
        if (hasJoined) {
          setHasJoined(true)
        }

      });
    }

    // Update connection status to connected
    const updateConnection = async () => {
      if (examData && studentDetails?.id) {
        try {
          await updateConnectionStatus(examData.id, studentDetails.studentId, true);
        } catch (error) {
          console.error("Error updating connection status:", error);
        }
      }
    };

    updateConnection();

    // Cleanup function to update connection status to disconnected
    return () => {
      const cleanup = async () => {
        if (examData && studentDetails?.id) {
          try {
            await updateConnectionStatus(examData.id, studentDetails.studentId, false);
          } catch (error) {
            console.error("Error updating connection status on cleanup:", error);
          }
        }
      };
      cleanup();
    };
  }, [examData, hasJoined]);

  // Fetch exam data on component mount
  useEffect(() => {
    const fetchExamData = async () => {
      if (!examId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await getExamById(examId);
        setExamData(response.content);

        // Set exam start and end times
        if (response.content.startTime) {
          setExamStartTime(new Date(response.content.startTime));
        }
        if (response.content.endTime) {
          setExamEndTime(new Date(response.content.endTime));
          
          // Check if exam has already ended
          const endTime = new Date(response.content.endTime);
          const now = new Date();
          if (endTime < now) {
            setExamEnded(true);
            setLoading(false);
            return;
          }
        }

        setLoading(false);
      } catch (err: unknown) {
        console.error("Error fetching exam:", err);
        setLoading(false);
      }
    };

    fetchExamData();
  }, [examId]);

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

  const handleNextQuestion = () => {
    if (examData?.examQuestions && currentQuestionIndex < examData.examQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleAnswerChange = (answer: any) => {
    if (examData?.examQuestions) {
      const questionId = examData.examQuestions[currentQuestionIndex]?.id?.toString() || currentQuestionIndex.toString();
      setAnswers(prev => ({
        ...prev,
        [questionId]: answer
      }));
    }
  };

  const handleExamComplete = async () => {
    // Show summary first instead of submitting immediately
    setShowSummary(true);
  };

  const handleFinalSubmit = async () => {
    try {
      if (!examData) {
        toast.error("No exam data available");
        return;
      }

      const studentDetails = getStudentDetails();
      if (!studentDetails?.id) {
        toast.error("Student details not found");
        return;
      }

      // Convert answers to the format expected by the backend
      const answerSubmissions: ExamAnswerSubmission[] = Object.entries(answers).map(([questionId, answer]) => ({
        examId: examData.id,
        questionId: parseInt(questionId),
        answer: typeof answer === 'string' ? answer : JSON.stringify(answer),
        timeTaken: 0, // This will be determined by the backend
        isCorrect: false // This will be determined by the backend
      }));

      console.log(answerSubmissions)

      // Submit answers to backend
      await submitExamAnswers(answerSubmissions);

      // Mark participant as submitted
      await updateParticipantStatus({
        examId: examData.id,
        studentId: studentDetails.studentId,
        isSubmitted: true,
        submittedAt: new Date().toISOString()
      });

      setExamSubmitted(true);
      toast.success("Exam completed successfully!");
      console.log("Exam completed with answers:", answers);

      // Move to completion state
      setCurrentStep(totalSteps + 1);
    } catch (error) {
      console.error("Error submitting exam answers:", error);
      toast.error("Failed to submit exam answers. Please try again.");
    }
  };

  const handleBackToQuestions = () => {
    setShowSummary(false);
  };

  const handleQuestionClick = (questionId: string) => {
    // Find the question index and navigate to it
    if (examData?.examQuestions) {
      const questionIndex = examData.examQuestions.findIndex(q => q.id?.toString() === questionId);
      if (questionIndex !== -1) {
        setCurrentQuestionIndex(questionIndex);
        setShowSummary(false);
      }
    }
  };

  const handleJoinExamAndNext = async () => {
    if (!examData) return;
    const studentDetails = getStudentDetails();
    if (!studentDetails?.id) return;
    try {
      await joinExam(examData.id, studentDetails.id);
      setHasJoined(true);
      handleNextStep();
    } catch (error) {
      console.error(error)
      toast.error("Failed to join exam. Please try again.");
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-4xl mx-auto text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 dark:border-white mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading exam data...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (!examData) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-4xl mx-auto text-center">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-red-800 dark:text-red-200 mb-2">
              Error Loading Exam
            </h2>
            <p className="text-red-600 dark:text-red-300">Failed to load exam data</p>
          </div>
        </div>
      </div>
    );
  }

  // Show exam ended screen
  if (examEnded && !examSubmitted) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-4xl mx-auto text-center">
          <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-8">
            <div className="text-6xl mb-4">⏰</div>
            <h2 className="text-2xl font-semibold text-orange-800 dark:text-orange-200 mb-4">
              Exam Time Has Ended
            </h2>
            <p className="text-orange-600 dark:text-orange-300 text-lg mb-6">
              The exam period has ended. Your answers have been automatically submitted.
            </p>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-left max-w-md mx-auto">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Exam Summary
              </h3>
              <div className="space-y-2 text-sm">
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Exam:</span> {examData.examName}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Total Questions:</span> {examData.examQuestions?.length || 0}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Answered:</span> {Object.keys(answers).length}
                </p>
                {examStartTime && (
                  <p className="text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Started:</span> {examStartTime.toLocaleString()}
                  </p>
                )}
                {examEndTime && (
                  <p className="text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Ended:</span> {examEndTime.toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show already submitted screen
  if (examSubmitted) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-4xl mx-auto text-center">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-8">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-semibold text-blue-800 dark:text-blue-200 mb-4">
              Exam Already Submitted
            </h2>
            <p className="text-blue-600 dark:text-blue-300 text-lg mb-6">
              You have already submitted this exam. You cannot attempt it again.
            </p>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-left max-w-md mx-auto">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Submission Details
              </h3>
              <div className="space-y-2 text-sm">
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Exam:</span> {examData.examName}
                </p>
                {participantStatus?.submittedAt && (
                  <p className="text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Submitted:</span> {new Date(participantStatus.submittedAt).toLocaleString()}
                  </p>
                )}
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Status:</span> <span className="text-green-600 dark:text-green-400 font-medium">Submitted</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show returning user indicator
  if (isReturningUser && participantStatus && showReturningUserMessage) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-4xl mx-auto text-center">
          <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-teal-800 dark:text-teal-200 mb-2">
              Welcome Back!
            </h2>
            <p className="text-teal-600 dark:text-teal-300">
              You previously joined this exam on {new Date(participantStatus.joinedAt).toLocaleString()}
            </p>
            <p className="text-sm text-teal-500 dark:text-teal-400 mt-2">
              Skipping environment checks and continuing to exam...
            </p>
          </div>
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-teal-500 mx-auto"></div>
        </div>
      </div>
    );
  }

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return isReturningUser ? null : <MicCameraSetup onNext={handleNextStep} />;
      case 2:
        return isReturningUser ? null : (
          <ConnectionStep onNext={handleNextStep} onPrev={handlePrevStep} />
        );
      case 3:
        return isReturningUser ? null : (
          <SystemCheckup onNext={handleNextStep} onPrev={handlePrevStep} />
        );
      case 4:
        return isReturningUser ? null : (
          <EnvironmentCheckup onNext={handleNextStep} onPrev={handlePrevStep} />
        );
      case 5:
        return (
          <DataManagement
            onNext={handleJoinExamAndNext}
            onPrev={isReturningUser ? () => { } : handlePrevStep}
            examId={examData.examCode}
            examStartTime={examStartTime?.toISOString() || examData.startTime}
          />
        );
      case 6:
        if (showSummary) {
          const questionData = convertExamQuestionsToQuestionData(examData.examQuestions || []);
          return (
            <Summary
              questions={questionData}
              userAnswers={answers}
              onQuestionClick={handleQuestionClick}
              onBackToQuestions={handleBackToQuestions}
              onFinalSubmit={handleFinalSubmit}
            />
          );
        }
        const questionData = convertExamQuestionsToQuestionData(examData.examQuestions || []);
        return (
          <QuestionComponent
            questions={questionData}
            currentQuestionIndex={currentQuestionIndex}
            onNext={handleNextQuestion}
            onPrevious={handlePrevQuestion}
            onComplete={handleExamComplete}
            timeRemaining={timeRemaining}
            onAnswerChange={handleAnswerChange}
            examId={examData.examCode}
          />
        );
      case 7:
        return (
          <div className="text-center space-y-8">
            <div className="space-y-3">
              <h1 className="text-3xl font-bold text-black dark:text-white">
                Exam Completed Successfully!
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Thank you for completing the exam. Your answers have been submitted and recorded.
              </p>
            </div>
            <div className="bg-white dark:bg-card rounded-xl p-6 shadow-lg max-w-2xl mx-auto">
              <h3 className="text-xl font-semibold text-black dark:text-white mb-4">
                Exam Summary
              </h3>
              <div className="space-y-2 text-left">
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Exam:</span> {examData.examName}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Total Questions:</span> {examData.examQuestions?.length || 0}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Answered:</span> {Object.keys(answers).length}
                </p>
                {examStartTime && (
                  <p className="text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Started:</span> {examStartTime.toLocaleString()}
                  </p>
                )}
                {examEndTime && (
                  <p className="text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Ended:</span> {examEndTime.toLocaleString()}
                  </p>
                )}
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Time Remaining:</span> {timeRemaining}
                </p>
              </div>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <p className="text-green-700 dark:text-green-300">
                ✅ Your exam has been successfully submitted and recorded in the system.
              </p>
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
        {/* Time Remaining Display - Only show during exam */}
        {currentStep === 6 && examEndTime && (
          <div className="mb-6 text-center">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 inline-block">
              <div className="text-sm text-red-600 dark:text-red-400 mb-1">Time Remaining</div>
              <div className="text-2xl font-bold text-red-700 dark:text-red-300 font-mono">
                {timeRemaining}
              </div>
            </div>
          </div>
        )}

        <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />
        <div className="mt-12">{renderCurrentStep()}</div>
      </div>
    </div>
  );
}

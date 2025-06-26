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
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { decrypt } from "@/lib/encryption";
import Cookies from "js-cookie";
import { Summary } from '@/components/student/Dashboard/exam/ExamEntry/questions/summary/summary';
import { 
  CheckCircle, 
  Clock, 
  FileX, 
  Loader2, 
  ArrowRight,
  BookOpen,
  User,
  CheckSquare
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
  const [justSubmitted, setJustSubmitted] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
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

  // Update connection status when component mounts/unmounts
  useEffect(() => {
    const studentDetails = getStudentDetails();

    // Only update connection status, do not check returning user here
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
  }, [examData]);

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

  // On mount, check if already joined
  useEffect(() => {
    const studentDetails = getStudentDetails();
    if (examData && studentDetails?.id) {
      checkParticipantStatus(examData.id, studentDetails.studentId).then((status) => {
        setParticipantStatus(status);
        if (status?.isSubmitted) {
          setExamSubmitted(true);
          toast.error("You have already submitted this exam. Cannot attempt again.");
          return;
        }
        if (status?.hasJoined) {
          setIsReturningUser(true);
          setShowReturningUserMessage(true);
          setCurrentStep(5);
          toast.success("Welcome back! Continuing from where you left off.");
        }
      });
    }
  }, [examData]);

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
    // Check if this is an auto-submission due to time running out
    const isAutoSubmission = timeRemaining === "00:00:00" || examEnded;
    
    if (isAutoSubmission) {
      // Auto-submit the exam when time runs out
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
        toast.success("Exam auto-submitted due to time expiration!");
        console.log("Exam auto-completed with answers:", answers);

        // Navigate to student exams page after auto-submission
        setTimeout(() => {
          router.push("/student/dashboard/exams");
        }, 2000);
      } catch (error) {
        console.error("Error auto-submitting exam answers:", error);
        toast.error("Failed to auto-submit exam answers. Please contact support.");
      }
    } else {
      // Show summary first for manual completion
      setShowSummary(true);
    }
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
      setJustSubmitted(true);
      setCurrentStep(7);
      toast.success("Exam completed successfully!");
      console.log("Exam completed with answers:", answers);

      // Navigate to student exams page after successful submission
      setTimeout(() => {
        router.push("/student/dashboard/exams");
      }, 2000);
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
      setCurrentStep(currentStep + 1); // Just go to next step, don't check returning user here
    } catch (error) {
      console.error(error)
      toast.error("Failed to join exam. Please try again.");
    }
  };

  // Auto-navigate after exam ends
  useEffect(() => {
    if (examEnded && !examSubmitted) {
      const timer = setTimeout(() => {
        router.push("/student/dashboard/exams");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [examEnded, examSubmitted, router]);

  // Auto-navigate after exam is already submitted
  useEffect(() => {
    if (examSubmitted) {
      const timer = setTimeout(() => {
        router.push("/student/dashboard/exams");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [examSubmitted, router]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-4xl mx-auto text-center">
          <Card className="max-w-md mx-auto bg-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-teal-900 shadow-lg">
            <CardContent className="p-8">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <Loader2 className="h-16 w-16 text-teal-600 dark:text-teal-400 animate-spin" />
                </div>
                <div className="text-center space-y-2">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Loading Exam Data
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Please wait while we prepare your exam...
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Show error state
  if (!examData) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-4xl mx-auto text-center">
          <Card className="max-w-md mx-auto bg-white dark:bg-[#0A0A0A] border border-red-200 dark:border-red-800 shadow-lg">
            <CardContent className="p-8">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                    <FileX className="h-8 w-8 text-red-600 dark:text-red-400" />
                  </div>
                </div>
                <div className="text-center space-y-2">
                  <h2 className="text-xl font-semibold text-red-800 dark:text-red-200">
                    Error Loading Exam
                  </h2>
                  <p className="text-red-600 dark:text-red-300 text-sm">
                    Failed to load exam data. Please check the exam link and try again.
                  </p>
                </div>
                <Button 
                  onClick={() => router.push("/student/dashboard/exams")}
                  className="mt-4 bg-teal-600 hover:bg-teal-700 text-white"
                >
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Back to Exams
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Show exam ended screen
  if (examEnded && !examSubmitted) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-4xl mx-auto text-center">
          <Card className="max-w-lg mx-auto bg-white dark:bg-[#0A0A0A] border border-orange-200 dark:border-orange-800 shadow-lg">
            <CardContent className="p-8">
              <div className="flex flex-col items-center space-y-6">
                <div className="relative">
                  <div className="w-20 h-20 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center">
                    <Clock className="h-10 w-10 text-orange-600 dark:text-orange-400" />
                  </div>
                </div>
                <div className="text-center space-y-3">
                  <h2 className="text-2xl font-bold text-orange-800 dark:text-orange-200">
                    Exam Time Has Ended
                  </h2>
                  <p className="text-orange-600 dark:text-orange-300 text-lg">
                    The exam period has ended. Your answers have been automatically submitted.
                  </p>
                </div>
                
                <Card className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                      Exam Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400 font-medium">Exam:</span>
                      <span className="text-gray-800 dark:text-gray-200">{examData.examName}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400 font-medium">Total Questions:</span>
                      <span className="text-gray-800 dark:text-gray-200">{examData.examQuestions?.length || 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400 font-medium">Answered:</span>
                      <span className="text-gray-800 dark:text-gray-200">{Object.keys(answers).length}</span>
                    </div>
                    {examStartTime && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400 font-medium">Started:</span>
                        <span className="text-gray-800 dark:text-gray-200">{examStartTime.toLocaleString()}</span>
                      </div>
                    )}
                    {examEndTime && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400 font-medium">Ended:</span>
                        <span className="text-gray-800 dark:text-gray-200">{examEndTime.toLocaleString()}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <Button 
                  onClick={() => router.push("/student/dashboard/exams")}
                  className="mt-4 bg-teal-600 hover:bg-teal-700 text-white"
                >
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Back to Exams
                </Button>
                
                <div className="text-sm text-orange-500 dark:text-orange-400">
                  Redirecting to exams page in 5 seconds...
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Show already submitted screen
  if (examSubmitted && !justSubmitted) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-4xl mx-auto text-center">
          <Card className="max-w-lg mx-auto bg-white dark:bg-[#0A0A0A] border border-teal-200 dark:border-teal-800 shadow-lg">
            <CardContent className="p-8">
              <div className="flex flex-col items-center space-y-6">
                <div className="relative">
                  <div className="w-20 h-20 bg-teal-100 dark:bg-teal-900/20 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-10 w-10 text-teal-600 dark:text-teal-400" />
                  </div>
                </div>
                <div className="text-center space-y-3">
                  <h2 className="text-2xl font-bold text-teal-800 dark:text-teal-200">
                    Exam Submitted
                  </h2>
                  <p className="text-teal-600 dark:text-teal-300 text-lg">
                    You have already submitted this exam. You cannot attempt it again.
                  </p>
                </div>
                
                <Card className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                      <CheckSquare className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                      Submission Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400 font-medium">Exam:</span>
                      <span className="text-gray-800 dark:text-gray-200">{examData.examName}</span>
                    </div>
                    {participantStatus?.submittedAt && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400 font-medium">Submitted:</span>
                        <span className="text-gray-800 dark:text-gray-200">{new Date(participantStatus.submittedAt).toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400 font-medium">Status:</span>
                      <span className="text-green-600 dark:text-green-400 font-medium flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        Submitted
                      </span>
                    </div>
                  </CardContent>
                </Card>
                
                <Button 
                  onClick={() => router.push("/student/dashboard/exams")}
                  className="mt-4 bg-teal-600 hover:bg-teal-700 text-white"
                >
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Back to Exams
                </Button>
                
                <div className="text-sm text-teal-500 dark:text-teal-400">
                  Redirecting to exams page in 5 seconds...
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Show returning user indicator
  if (isReturningUser && participantStatus && showReturningUserMessage) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-4xl mx-auto text-center">
          <Card className="max-w-lg mx-auto bg-white dark:bg-[#0A0A0A] border border-teal-200 dark:border-teal-800 shadow-lg mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <div className="w-16 h-16 bg-teal-100 dark:bg-teal-900/20 rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-teal-600 dark:text-teal-400" />
                  </div>
                </div>
                <div className="text-center space-y-2">
                  <h2 className="text-xl font-semibold text-teal-800 dark:text-teal-200">
                    Welcome Back!
                  </h2>
                  <p className="text-teal-600 dark:text-teal-300">
                    You previously joined this exam on {new Date(participantStatus.joinedAt).toLocaleString()}
                  </p>
                  <p className="text-sm text-teal-500 dark:text-teal-400">
                    Skipping environment checks and continuing to exam...
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="flex justify-center">
            <Loader2 className="h-16 w-16 text-teal-500 animate-spin" />
          </div>
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
            <Card className="max-w-2xl mx-auto bg-white dark:bg-[#0A0A0A] border border-green-200 dark:border-green-800 shadow-lg">
              <CardContent className="p-8">
                <div className="flex flex-col items-center space-y-6">
                  <div className="relative">
                    <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                  <div className="text-center space-y-3">
                    <h1 className="text-3xl font-bold text-green-800 dark:text-green-200">
                      Exam Completed Successfully!
                    </h1>
                    <p className="text-green-600 dark:text-green-300 text-lg">
                      Thank you for completing the exam. Your answers have been submitted and recorded.
                    </p>
                  </div>
                  
                  <Card className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                        Exam Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400 font-medium">Exam:</span>
                        <span className="text-gray-800 dark:text-gray-200">{examData.examName}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400 font-medium">Total Questions:</span>
                        <span className="text-gray-800 dark:text-gray-200">{examData.examQuestions?.length || 0}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400 font-medium">Answered:</span>
                        <span className="text-gray-800 dark:text-gray-200">{Object.keys(answers).length}</span>
                      </div>
                      {examStartTime && (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 dark:text-gray-400 font-medium">Started:</span>
                          <span className="text-gray-800 dark:text-gray-200">{examStartTime.toLocaleString()}</span>
                        </div>
                      )}
                      {examEndTime && (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 dark:text-gray-400 font-medium">Ended:</span>
                          <span className="text-gray-800 dark:text-gray-200">{examEndTime.toLocaleString()}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400 font-medium">Time Remaining:</span>
                        <span className="text-gray-800 dark:text-gray-200">{timeRemaining}</span>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 w-full">
                    <p className="text-green-700 dark:text-green-300 flex items-center justify-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Your exam has been successfully submitted and recorded in the system.
                    </p>
                  </div>
                  
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Redirecting to exams page...
                  </div>
                </div>
              </CardContent>
            </Card>
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

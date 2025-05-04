import {
  ListChecks,
  TextCursorInput,
  UserRound,
  CheckCircle,
  Eye,
  Trash2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { BACKEND_URL } from "@/Constants/backend";
import { toast } from "sonner";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CardContent } from "@/components/ui/card";

interface Question {
  id: number;
  text: string;
  type: "Long Text" | "Short Text" | "Multiple Choice" | "Choice" | "Short Answer";
  createdBy: string;
  answerOptions?: {
    text: string;
    clarification: string;
    isCorrect: boolean;
  }[];
}

interface QuestionBankProps {
  questions: Question[];
  onDelete: () => void;
}

export default function QuestionBank({ questions, onDelete }: QuestionBankProps) {
  const [isDeletingDialogOpen, setIsDeletingDialogOpen] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState<Question | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);

  const renderTypeIcon = (type: Question["type"]) => {
    if (type === "Long Text" || type === "Short Text" || type === "Short Answer") {
      return <TextCursorInput className="h-5 w-4 text-teal-500" />;
    } else if (type === "Multiple Choice") {
      return <ListChecks className="h-4 w-4 text-emerald-500" />;
    } else if (type === "Choice") {
      return <CheckCircle className="h-4 w-4 text-emerald-500" />;
    }
  };

  const truncateText = (text: string, maxLength = 80) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  const handleDeleteQuestion = async (questionId: number) => {
    const jwt = Cookies.get("adminjwt");
    const headers = {
      Accept: "text/plain",
      Authorization: `Bearer ${jwt}`,
    };
    try {
      const response = await axios.delete(`${BACKEND_URL}/question-bank/question/Interact/${questionId}`, { headers });
      if (response.data.isSuccessful) {
        toast.success("Question deleted successfully");
        onDelete();
      }
    } catch (error) {
      toast.error("Error deleting question");
      console.error("Error deleting question:", error);
    }
  };

  const handleCloseViewDialog = (value: boolean) => {
    setViewDialogOpen(value);
    if (value === false) {
      setTimeout(() => {
        setSelectedQuestion(null);
      }, 0);
    }
  };

  const openViewDialog = (question: Question) => {
    setSelectedQuestion(question);
    setTimeout(() => {
      setViewDialogOpen(true);
    }, 0);
  };
  return (
    <div className="flex flex-col rounded-2xl transition-colors duration-200 h-full">
      {/* View Question Dialog */}
      <Dialog
        open={viewDialogOpen}
        onOpenChange={handleCloseViewDialog}
      >
        <DialogContent className="min-w-5xl w-[90vw] max-h-[90vh] overflow-hidden bg-card">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2 dark:text-gray-100">
              <Eye className="h-5 w-5 text-teal-500" />
              View Question
            </DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              Reviewing question details
            </DialogDescription>
          </DialogHeader>

          {selectedQuestion && (
            <div className="mt-4">
              <div className="space-y-6">
                <Badge variant="outline" className="mb-4 font-normal  dark:border-gray-600 bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400">
                  {selectedQuestion.type}
                </Badge>

                <Card className="bg-gray-50 dark:bg-gray-900">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Question Text:</Label>
                        <div className="text-gray-800 dark:text-gray-200 p-3 bg-white dark:bg-gray-800 rounded-md border dark:border-gray-700">
                          {selectedQuestion.text}
                        </div>
                      </div>

                      {selectedQuestion.answerOptions && selectedQuestion.answerOptions.length > 0 && (
                        <div className="space-y-4 h-[400px] overflow-y-auto scrollbar-custom">
                          {/* Correct Answers Section */}
                          <div>
                            <Label className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Correct Answers:</Label>
                            <div className="space-y-2">
                              {selectedQuestion.answerOptions
                                .filter(option => option.isCorrect)
                                .map((option, idx) => (
                                  <Card
                                    key={`correct-${idx}`}
                                    className="bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800"
                                  >
                                    <CardContent className="p-3">
                                      <div className="text-gray-800 dark:text-green-200">
                                        {option.text}
                                        {option.clarification && (
                                          <div className="text-xs mt-1 italic text-gray-600 dark:text-gray-400">
                                            Clarification: {option.clarification}
                                          </div>
                                        )}
                                      </div>
                                    </CardContent>
                                  </Card>
                                ))}
                            </div>
                          </div>

                          {/* Wrong Answers Section */}
                          <div>
                            <Label className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Other Options:</Label>
                            <div className="space-y-2">
                              {selectedQuestion.answerOptions
                                .filter(option => !option.isCorrect)
                                .map((option, idx) => (
                                  <Card
                                    key={`wrong-${idx}`}
                                    className="bg-card border border-gray-200 dark:border-gray-700"
                                  >
                                    <CardContent className="p-3">
                                      <div className="text-gray-800 dark:text-gray-300">
                                        {option.text}
                                        {option.clarification && (
                                          <div className="text-xs mt-1 italic text-gray-600 dark:text-gray-400">
                                            Clarification: {option.clarification}
                                          </div>
                                        )}
                                      </div>
                                    </CardContent>
                                  </Card>
                                ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Scrollable card section */}
      <div className="h-[431px] overflow-y-auto rounded-2xl p-2 bg-white dark:bg-[#000000a9] border-gray-200 dark:border-black border shadow-sm w-full scrollbar-custom">
        <div className="space-y-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {questions.length > 0 ? questions.map((question) => (
            <Card
              key={question.id}
              className="transition-all hover:shadow-md bg-[#fdfdfd] dark:bg-[#0A0A0A] border border-gray-200 dark:border-teal-900 rounded-xl shadow-sm cursor-pointer p-3 flex flex-col justify-start h-full"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300 text-xs font-medium rounded-full px-3 py-1.5 flex items-center space-x-1">
                    {renderTypeIcon(question.type)}
                    <span className="capitalize">
                      {question.type.replace("-", " ")}
                      {(question.type === "Multiple Choice" || question.type === "Choice") && question.answerOptions && (
                        <span className="ml-1">({question.answerOptions.length} options)</span>
                      )}
                    </span>
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-900 border border-teal-800 flex items-center gap-3 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-full px-2 py-1.5">
                    <UserRound className="h-4 w-4 text-gray-500" />
                    {question.createdBy}
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 15 15"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                      >
                        <path
                          d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM13.625 7.5C13.625 8.12132 13.1213 8.625 12.5 8.625C11.8787 8.625 11.375 8.12132 11.375 7.5C11.375 6.87868 11.8787 6.375 12.5 6.375C13.1213 6.375 13.625 6.87868 13.625 7.5Z"
                          fill="currentColor"
                          fillRule="evenodd"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem
                      onClick={() => openViewDialog(question)}
                      className="flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setQuestionToDelete(question);
                        setIsDeletingDialogOpen(true);
                      }}
                      className="flex items-center gap-2 text-red-500 hover:bg-red-700 dark:hover:bg-red-900/50"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                      <div className="text-red-500">Delete</div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <AlertDialog open={isDeletingDialogOpen} onOpenChange={(open) => {
                setIsDeletingDialogOpen(open);
                if (!open) setQuestionToDelete(null);
              }}>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will delete the question &quot;{questionToDelete?.text}&quot; from the question bank.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <Button variant="outline" onClick={() => setIsDeletingDialogOpen(false)}>Cancel</Button>
                    <Button variant="destructive" onClick={() => {
                      if (questionToDelete) {
                        handleDeleteQuestion(questionToDelete.id);
                        setIsDeletingDialogOpen(false);
                      }
                    }}>Delete</Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              {/* Main Content */}
              <div className="flex items-start">
                <div>
                  <p className="text-gray-800 dark:text-gray-200 text-m font-regular leading-relaxed">
                    {truncateText(question.text)}
                  </p>
                </div>
              </div>
            </Card>
          )) :
            <div className="w-full h-full flex items-center justify-center">
              <p className="text-gray-800 dark:text-gray-200 text-m font-regular leading-relaxed">
                No questions found
              </p>
            </div>
          }
        </div>
      </div>
    </div>
  );
}
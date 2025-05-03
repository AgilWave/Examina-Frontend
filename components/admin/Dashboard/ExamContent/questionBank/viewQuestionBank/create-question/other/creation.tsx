"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import QuestionTextInput from "./QuestionTextInput";
import AnswerSection from "./AnswerSection";
import CategorySelector from "../filter/selectors/CategorySelector";
import QuestionTypeSelector from "../filter/selectors/QuestionTypeSelector";
import {
  Plus, Save, Paperclip, X,
  Pencil, FileQuestion, Eye, Trash2,
  FileImage, File
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";

interface QuestionData {
  id: string;
  questionText: string;
  correctAnswers: string[];
  correctAnswerClarifications: string[];
  wrongAnswers: string[];
  wrongAnswerClarifications: string[];
  collapsed: boolean;
  category: string;
  questionType: string;

  saved: boolean;
  disabled?: boolean;
  attachment?: File | null;
  attachmentName?: string;
  attachmentPreviewUrl?: string;
}

interface CreationPageProps {
  category: string;
  questionType: string;
  onResetSelectors: () => void;
}

import { setCreateQuestionBankQuestion, setCreateQuestionModuleId, removeCreateQuestionBankQuestion, updateCreateQuestionBankQuestion } from "@/redux/features/QuestionBankSlice";

import { RootState } from "@/redux/store";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

const CreationPage: React.FC<CreationPageProps> = () => {
  const searchParams = useSearchParams();
  const idString = searchParams?.get('id');
  const id = idString ? parseInt(idString, 10) : undefined;
  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [newQuestion, setNewQuestion] = useState<QuestionData | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<QuestionData | null>(null);
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [category, setCategory] = useState("");
  const [questionType, setQuestionType] = useState("");
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();
  const createQuestionBank = useSelector((state: RootState) => state.questionBank.createQuestionBank);

  useEffect(() => {
    const handleReset = () => {
      setQuestions([]);
    };

    const element = document.querySelector('.creation-page');
    if (element) {
      element.addEventListener('resetQuestions', handleReset);
      return () => {
        element.removeEventListener('resetQuestions', handleReset);
      };
    }
  }, []);

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    setQuestionType("");
  };

  useEffect(() => {
    if (dialogOpen && category && questionType) {
      setNewQuestion({
        id: generateUniqueId(),
        questionText: "",
        correctAnswers: [""],
        correctAnswerClarifications: [""],
        wrongAnswers: ["", ""],
        wrongAnswerClarifications: ["", ""],
        collapsed: false,
        category,
        questionType,
        saved: false,
      });
      setValidationErrors({});
    }
  }, [dialogOpen, category, questionType]);

  const generateUniqueId = () => {
    return `question-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  };

  const handleQuestionFieldChange = (field: keyof QuestionData, value: string | string[]) => {
    if (newQuestion) {
      if (field === "correctAnswers") {
        const answers = Array.isArray(value)
          ? value
          : typeof value === 'string'
            ? value.split("|").filter(Boolean)
            : [];

        setNewQuestion({ ...newQuestion, correctAnswers: answers });
      } else if (field === "correctAnswerClarifications") {
        // For correct answer clarifications, ensure it's an array
        const clarifications = Array.isArray(value) ? value : [value];
        setNewQuestion({ ...newQuestion, correctAnswerClarifications: clarifications });
      } else {
        setNewQuestion({ ...newQuestion, [field]: value });
      }

      if (validationErrors[field]) {
        const newErrors = { ...validationErrors };
        delete newErrors[field];
        setValidationErrors(newErrors);
      }
    }
  };

  const handleWrongAnswerChange = (index: number, value: string) => {
    if (newQuestion) {
      const updatedWrongAnswers = [...newQuestion.wrongAnswers];
      updatedWrongAnswers[index] = value;
      setNewQuestion({ ...newQuestion, wrongAnswers: updatedWrongAnswers });

      if (validationErrors.wrongAnswers) {
        const newErrors = { ...validationErrors };
        delete newErrors.wrongAnswers;
        setValidationErrors(newErrors);
      }
    }
  };

  const handleWrongClarificationChange = (index: number, value: string) => {
    if (newQuestion) {
      const updatedClarifications = [...(newQuestion.wrongAnswerClarifications || [])];
      while (updatedClarifications.length <= index) {
        updatedClarifications.push("");
      }
      updatedClarifications[index] = value;
      setNewQuestion({ ...newQuestion, wrongAnswerClarifications: updatedClarifications });
    }
  };

  const validateQuestion = (question: QuestionData): boolean => {
    const errors: { [key: string]: string } = {};

    if (!question.questionText.trim()) {
      errors.questionText = "Question text is required";
    }

    console.log('question', question);

    if (question.category === "mcq" &&
      (question.questionType === "Multiple Choice" || question.questionType === "Choice")) {
      const correctAnswers = question.correctAnswers.filter(answer => answer.trim());

      if (correctAnswers.length === 0) {
        errors.correctAnswer = "At least one correct answer is required";
      }

      const validWrongAnswers = question.wrongAnswers.filter(answer => answer.trim()).length;
      if (validWrongAnswers === 0) {
        errors.wrongAnswers = "At least one wrong answer is required";
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveNewQuestion = () => {
    if (newQuestion && validateQuestion(newQuestion)) {
      let answerOptions: { text: string; clarification: string; isCorrect: boolean; }[] = [];

      if (newQuestion.category === "mcq") {
        if (newQuestion.questionType === "Multiple Choice") {
          const correctAnswers = newQuestion.correctAnswers.filter(answer => answer.trim());

          answerOptions = correctAnswers.map((text, idx) => ({
            text,
            clarification: newQuestion.correctAnswerClarifications?.[idx] ||
              newQuestion.correctAnswerClarifications?.[0] || "",
            isCorrect: true
          }));

          // Add wrong answers
          answerOptions = [
            ...answerOptions,
            ...newQuestion.wrongAnswers
              .filter(answer => answer.trim())
              .map((answer, index) => ({
                text: answer,
                clarification: newQuestion.wrongAnswerClarifications?.[index] || "",
                isCorrect: false
              }))
          ];
        } else {
          answerOptions = [
            {
              text: newQuestion.correctAnswers[0],
              clarification: newQuestion.correctAnswerClarifications?.[0] || "",
              isCorrect: true
            },
            ...newQuestion.wrongAnswers
              .filter(answer => answer.trim())
              .map((answer, index) => ({
                text: answer,
                clarification: newQuestion.wrongAnswerClarifications?.[index] || "",
                isCorrect: false
              }))
          ];
        }
      }

      const structuredQuestion = {
        category: category,
        type: questionType,
        text: newQuestion.questionText,
        attachment: newQuestion.attachment,
        ...(category === "mcq" ? { answerOptions } : {})
      };

      dispatch(setCreateQuestionModuleId(id));
      setQuestions([...questions, { ...newQuestion, saved: true, collapsed: true }]);
      dispatch(setCreateQuestionBankQuestion(structuredQuestion));
      setSaveSuccess(true);
      setDialogOpen(false);

      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);

      console.log(createQuestionBank);
      console.log(structuredQuestion);
      setCategory("");
      setQuestionType("");
      toast.success("Question Added to Creation List");
    }
  };

  const openEditDialog = (question: QuestionData, index: number) => {
    setCurrentQuestion({ ...question });
    setCurrentIndex(index);
    setEditDialogOpen(true);
  };

  const openViewDialog = (question: QuestionData) => {
    setCurrentQuestion({ ...question });
    setViewDialogOpen(true);
  };

  // eslint-disable-next-line
  const handleEditQuestionChange = (field: keyof QuestionData, value: any) => {
    if (currentQuestion) {
      setCurrentQuestion({ ...currentQuestion, [field]: value });
      if (validationErrors[field]) {
        const newErrors = { ...validationErrors };
        delete newErrors[field];
        setValidationErrors(newErrors);
      }
    }
  };

  const handleEditWrongAnswerChange = (answerIndex: number, value: string) => {
    if (currentQuestion) {
      const updatedWrongAnswers = [...currentQuestion.wrongAnswers];
      updatedWrongAnswers[answerIndex] = value;
      setCurrentQuestion({ ...currentQuestion, wrongAnswers: updatedWrongAnswers });

      if (validationErrors.wrongAnswers) {
        const newErrors = { ...validationErrors };
        delete newErrors.wrongAnswers;
        setValidationErrors(newErrors);
      }
    }
  };

  const handleEditWrongClarificationChange = (answerIndex: number, value: string) => {
    if (currentQuestion) {
      const updatedClarifications = [...(currentQuestion.wrongAnswerClarifications || [])];
      while (updatedClarifications.length <= answerIndex) {
        updatedClarifications.push("");
      }
      updatedClarifications[answerIndex] = value;
      setCurrentQuestion({ ...currentQuestion, wrongAnswerClarifications: updatedClarifications });
    }
  };

  const saveEditedQuestion = () => {
    if (currentQuestion && validateQuestion(currentQuestion)) {
      const updatedQuestions = [...questions];
      updatedQuestions[currentIndex] = { ...currentQuestion };
      setQuestions(updatedQuestions);

      let answerOptions: { text: string; clarification: string; isCorrect: boolean; }[] = [];

      if (currentQuestion.category === "mcq") {
        if (currentQuestion.questionType === "Multiple Choice") {
          const correctAnswers = currentQuestion.correctAnswers.filter(answer => answer.trim());

          answerOptions = correctAnswers.map(text => ({
            text,
            clarification: currentQuestion.correctAnswerClarifications?.[0] || "",
            isCorrect: true
          }));

          answerOptions = [
            ...answerOptions,
            ...currentQuestion.wrongAnswers.map((answer, index) => ({
              text: answer,
              clarification: currentQuestion.wrongAnswerClarifications?.[index] || "",
              isCorrect: false
            }))
          ];
        } else {
          answerOptions = [
            {
              text: currentQuestion.correctAnswers[0],
              clarification: currentQuestion.correctAnswerClarifications?.[0] || "",
              isCorrect: true
            },
            ...currentQuestion.wrongAnswers.map((answer, index) => ({
              text: answer,
              clarification: currentQuestion.wrongAnswerClarifications?.[index] || "",
              isCorrect: false
            }))
          ];
        }
      }

      const structuredQuestion = {
        category: currentQuestion.category,
        type: currentQuestion.questionType,
        text: currentQuestion.questionText,
        attachment: currentQuestion.attachment,

        ...(currentQuestion.category === "mcq" ? { answerOptions } : {})
      };

      dispatch(updateCreateQuestionBankQuestion({
        index: currentIndex,
        question: structuredQuestion
      }));
      dispatch(setCreateQuestionModuleId(id));

      setEditDialogOpen(false);
      setSaveSuccess(true);
      toast.success("Question Updated Successfully");

      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    }
  };

  const addWrongAnswer = () => {
    if (newQuestion) {
      setNewQuestion({
        ...newQuestion,
        wrongAnswers: [...newQuestion.wrongAnswers, ""],
        wrongAnswerClarifications: [...(newQuestion.wrongAnswerClarifications || []), ""]
      });
    }
  };

  const addWrongAnswerToExisting = () => {
    if (currentQuestion) {
      setCurrentQuestion({
        ...currentQuestion,
        wrongAnswers: [...currentQuestion.wrongAnswers, ""],
        wrongAnswerClarifications: [...(currentQuestion.wrongAnswerClarifications || []), ""]
      });
    }
  };

  const removeWrongAnswer = (answerIndex: number) => {
    if (newQuestion && newQuestion.wrongAnswers.length > 2) {
      const updatedWrongAnswers = [...newQuestion.wrongAnswers];
      updatedWrongAnswers.splice(answerIndex, 1);

      const updatedClarifications = [...(newQuestion.wrongAnswerClarifications || [])];
      if (updatedClarifications.length > answerIndex) {
        updatedClarifications.splice(answerIndex, 1);
      }

      setNewQuestion({
        ...newQuestion,
        wrongAnswers: updatedWrongAnswers,
        wrongAnswerClarifications: updatedClarifications
      });
    }
  };

  const removeWrongAnswerFromExisting = (answerIndex: number) => {
    if (currentQuestion && currentQuestion.wrongAnswers.length > 2) {
      const updatedWrongAnswers = [...currentQuestion.wrongAnswers];
      updatedWrongAnswers.splice(answerIndex, 1);

      const updatedClarifications = [...(currentQuestion.wrongAnswerClarifications || [])];
      if (updatedClarifications.length > answerIndex) {
        updatedClarifications.splice(answerIndex, 1);
      }

      setCurrentQuestion({
        ...currentQuestion,
        wrongAnswers: updatedWrongAnswers,
        wrongAnswerClarifications: updatedClarifications
      });
    }
  };

  const openQuestionDialog = () => {
    setDialogOpen(true);
  };

  const handleAttachmentClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const previewUrl = URL.createObjectURL(file);

      if (newQuestion) {
        setNewQuestion({
          ...newQuestion,
          attachment: file,
          attachmentName: file.name,
          attachmentPreviewUrl: previewUrl
        });
      }
    }
  };

  const handleExistingFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const previewUrl = URL.createObjectURL(file);

      if (currentQuestion) {
        setCurrentQuestion({
          ...currentQuestion,
          attachment: file,
          attachmentName: file.name,
          attachmentPreviewUrl: previewUrl
        });
      }
    }
  };

  const removeAttachment = () => {
    if (newQuestion && newQuestion.attachmentPreviewUrl) {
      URL.revokeObjectURL(newQuestion.attachmentPreviewUrl);
    }

    if (newQuestion) {
      setNewQuestion({
        ...newQuestion,
        attachment: null,
        attachmentName: undefined,
        attachmentPreviewUrl: undefined
      });
    }
  };

  const removeExistingAttachment = () => {
    if (currentQuestion && currentQuestion.attachmentPreviewUrl) {
      URL.revokeObjectURL(currentQuestion.attachmentPreviewUrl);
    }

    if (currentQuestion) {
      setCurrentQuestion({
        ...currentQuestion,
        attachment: null,
        attachmentName: undefined,
        attachmentPreviewUrl: undefined
      });
    }
  };

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      // Clean up any created object URLs to prevent memory leaks
      questions.forEach(q => {
        if (q.attachmentPreviewUrl) {
          URL.revokeObjectURL(q.attachmentPreviewUrl);
        }
      });

      if (newQuestion?.attachmentPreviewUrl) {
        URL.revokeObjectURL(newQuestion.attachmentPreviewUrl);
      }

      if (currentQuestion?.attachmentPreviewUrl) {
        URL.revokeObjectURL(currentQuestion.attachmentPreviewUrl);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Helper function to determine file type
  const getFileType = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (!extension) return 'unknown';

    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'];
    const pdfExtension = 'pdf';

    if (imageExtensions.includes(extension)) return 'image';
    if (extension === pdfExtension) return 'pdf';
    return 'other';
  };

  const renderAttachmentPreview = (attachmentName?: string, previewUrl?: string) => {
    if (!attachmentName || !previewUrl) return null;

    const fileType = getFileType(attachmentName);

    switch (fileType) {
      case 'image':
        return (
          <div className="mt-2 border rounded-md overflow-hidden dark:border-gray-600">
            <Image
              src={previewUrl}
              alt="Attachment preview"
              className="w-full h-[200px] object-cover"
              width={200}
              height={200}
            />
          </div>
        );
      case 'pdf':
        return (
          <div className="mt-2 border rounded-md overflow-hidden dark:border-gray-600">
            <iframe
              src={previewUrl}
              className="w-full h-[200px]"
              title="PDF preview"
            />
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center p-4 mt-2 border rounded-md dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
            <File className="h-12 w-12 text-gray-400" />
            <p className="ml-2 text-sm text-gray-500 dark:text-gray-400">No preview available for this file type</p>
          </div>
        );
    }
  };

  const handleRemoveQuestion = (idx: number) => {
    if (idx === -1) {
      toast.error("Please select a question to remove");
      return;
    }
    if (questions.length > 1) {
      const updatedQuestions = questions.filter((_, i) => i !== idx);
      setQuestions(updatedQuestions);
      dispatch(removeCreateQuestionBankQuestion(idx));
      toast.success("Question Removed from Creation List");
    } else {
      setQuestions([]);
      dispatch(removeCreateQuestionBankQuestion(idx));
      toast.success("Question Removed from Creation List");
    }
  };

  return (
    <div className="flex flex-col gap-6 dark:text-gray-100 creation-page">
      {/* Main Card */}
      {questions.length > 0 && (
        <div className="w-full flex justify-end items-center mb-4">
          <Button
            onClick={openQuestionDialog}
            variant="default"
            className="w-full sm:w-[40px] gap-2"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Question Creation Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="min-w-5xl w-[90vw] max-h-[90vh] overflow-hidden dark:bg-card">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2 dark:text-gray-100">
              <FileQuestion className="h-5 w-5" />
              Create New Question
            </DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              Fill in the details below to create your question
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <CategorySelector
                  value={category}
                  onChange={handleCategoryChange}
                />
              </div>

              <div>
                <QuestionTypeSelector
                  category={category}
                  value={questionType}
                  onChange={setQuestionType}
                />
              </div>
            </div>

            {category && questionType ? (
              <ScrollArea className="h-[50vh] pr-4">
                <div className="space-y-6">
                  <Badge variant="outline" className="mb-4 font-normal dark:text-gray-300 dark:border-gray-600">
                    {category} - {questionType}
                  </Badge>

                  <QuestionTextInput
                    value={newQuestion?.questionText || ""}
                    onChange={(val) => handleQuestionFieldChange("questionText", val)}
                    error={validationErrors.questionText}
                  />

                  {/* Only show answer options for MCQ questions */}
                  {category === "mcq" && (questionType === "Multiple Choice" || questionType === "Choice") && (
                    <div className="space-y-4">
                      <AnswerSection
                        correctAnswers={newQuestion?.correctAnswers || []}
                        wrongAnswers={newQuestion?.wrongAnswers || []}
                        correctAnswerClarifications={newQuestion?.correctAnswerClarifications || []}
                        wrongAnswerClarifications={newQuestion?.wrongAnswerClarifications || []}
                        onCorrectAnswerChange={(val) => handleQuestionFieldChange("correctAnswers", val)}
                        onCorrectClarificationChange={(val) => handleQuestionFieldChange("correctAnswerClarifications", val)}
                        onWrongAnswerChange={(index, val) => handleWrongAnswerChange(index, val)}
                        onWrongClarificationChange={(index, val) => handleWrongClarificationChange(index, val)}
                        errorCorrect={validationErrors.correctAnswer}
                        errorWrong={validationErrors.wrongAnswers}
                        questionType={questionType}
                      />

                      <div className="flex items-center justify-between">
                        <Button
                          onClick={addWrongAnswer}
                          variant="ghost"
                          size="sm"
                          className="text-teal-600 dark:text-teal-400 hover:text-teal-800 hover:bg-teal-50 dark:hover:bg-teal-900/20"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add Another Option
                        </Button>

                        {newQuestion && newQuestion.wrongAnswers.length > 2 && (
                          <Button
                            onClick={() => removeWrongAnswer(newQuestion.wrongAnswers.length - 1)}
                            variant="ghost"
                            size="sm"
                            className="text-red-500 dark:text-red-400 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <X className="h-4 w-4 mr-1" />
                            Remove Last Option
                          </Button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Hidden file input */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                  />

                  {/* Add Attachment Button and Preview */}
                  <div className="space-y-3">
                    {newQuestion?.attachment ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 p-2 border rounded-md dark:border-gray-600">
                          {getFileType(newQuestion.attachmentName || '') === 'image' ? (
                            <FileImage className="h-4 w-4 text-teal-500 dark:text-teal-400" />
                          ) : getFileType(newQuestion.attachmentName || '') === 'pdf' ? (
                            <File className="h-4 w-4 text-red-500 dark:text-red-400" />
                          ) : (
                            <Paperclip className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                          )}
                          <span className="text-sm flex-grow truncate dark:text-gray-300">
                            {newQuestion.attachmentName}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={removeAttachment}
                            className="h-7 w-7 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        {renderAttachmentPreview(newQuestion.attachmentName, newQuestion.attachmentPreviewUrl)}
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                        onClick={handleAttachmentClick}
                      >
                        <Paperclip className="h-4 w-4" />
                        Add Attachment
                      </Button>
                    )}
                  </div>
                </div>
              </ScrollArea>
            ) : (
              <div className="h-[20vh] flex items-center justify-center">
                <p className="text-gray-500 dark:text-gray-400">
                  Please select a category and question type to continue
                </p>
              </div>
            )}
          </div>

          <DialogFooter className="mt-4">
            <Button
              onClick={handleSaveNewQuestion}
              variant="default"
              className="gap-2"
              disabled={!category || !questionType}
            >
              <Save className="h-4 w-4" />
              Save Question
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Question Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="min-w-5xl w-[90vw] max-h-[90vh] overflow-hidden bg-card ">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2 dark:text-gray-100">
              <Pencil className="h-5 w-5" />
              Edit Question
            </DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              Make changes to your question
            </DialogDescription>
          </DialogHeader>

          {currentQuestion && (
            <div className="mt-4">
              <ScrollArea className="max-h-[50vh] h-[45vh] pr-4 ">
                <div className="space-y-6">
                  <Badge variant="outline" className="mb-4 font-normal dark:text-gray-300 dark:border-gray-600">
                    {currentQuestion.category} - {currentQuestion.questionType}
                  </Badge>

                  <QuestionTextInput
                    value={currentQuestion.questionText}
                    onChange={(val) => handleEditQuestionChange("questionText", val)}
                    error={validationErrors.questionText}
                  />

                  {currentQuestion.category === "mcq" && (currentQuestion.questionType === "Multiple Choice" || currentQuestion.questionType === "Choice") && (
                    <div className="space-y-4">
                      <AnswerSection
                        correctAnswers={currentQuestion.correctAnswers}
                        wrongAnswers={currentQuestion.wrongAnswers}
                        correctAnswerClarifications={currentQuestion.correctAnswerClarifications}
                        wrongAnswerClarifications={currentQuestion.wrongAnswerClarifications}
                        onCorrectAnswerChange={(val) => handleEditQuestionChange("correctAnswers", val)}
                        onCorrectClarificationChange={(val) => handleEditQuestionChange("correctAnswerClarifications", val)}
                        onWrongAnswerChange={(answerIndex, val) => handleEditWrongAnswerChange(answerIndex, val)}
                        onWrongClarificationChange={(answerIndex, val) => handleEditWrongClarificationChange(answerIndex, val)}
                        errorCorrect={validationErrors.correctAnswer}
                        errorWrong={validationErrors.wrongAnswers}
                        questionType={currentQuestion.questionType}
                      />

                      <div className="flex items-center justify-between">
                        <Button
                          onClick={addWrongAnswerToExisting}
                          variant="ghost"
                          size="sm"
                          className="text-teal-600 dark:text-teal-400 hover:text-teal-800 hover:bg-teal-50 dark:hover:bg-teal-900/20"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add Another Option
                        </Button>

                        {currentQuestion.wrongAnswers.length > 2 && (
                          <Button
                            onClick={() => removeWrongAnswerFromExisting(currentQuestion.wrongAnswers.length - 1)}
                            variant="ghost"
                            size="sm"
                            className="text-red-500 dark:text-red-400 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <X className="h-4 w-4 mr-1" />
                            Remove Last Option
                          </Button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Hidden file input for edit dialog */}
                  <input
                    type="file"
                    id="edit-file-input"
                    onChange={handleExistingFileChange}
                    className="hidden"
                    accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                  />

                  {/* Add Attachment Button for edit dialog with preview */}
                  <div className="space-y-3">
                    {currentQuestion.attachment ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 p-2 border rounded-md dark:border-gray-600">
                          {getFileType(currentQuestion.attachmentName || '') === 'image' ? (
                            <FileImage className="h-4 w-4 text-teal-500 dark:text-teal-400" />
                          ) : getFileType(currentQuestion.attachmentName || '') === 'pdf' ? (
                            <File className="h-4 w-4 text-red-500 dark:text-red-400" />
                          ) : (
                            <Paperclip className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                          )}
                          <span className="text-sm flex-grow truncate dark:text-gray-300">
                            {currentQuestion.attachmentName}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={removeExistingAttachment}
                            className="h-7 w-7 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        {renderAttachmentPreview(currentQuestion.attachmentName, currentQuestion.attachmentPreviewUrl)}
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => document.getElementById('edit-file-input')?.click()}
                      >
                        <Paperclip className="h-4 w-4" />
                        Add Attachment
                      </Button>
                    )}
                  </div>
                </div>
              </ScrollArea>
            </div>
          )}

          <DialogFooter className="mt-4">
            <Button
              onClick={saveEditedQuestion}
              variant="default"
              className="gap-2"
            >
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Question Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="min-w-5xl w-[90vw] max-h-[90vh] overflow-hidden bg-card ">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2 dark:text-gray-100">
              <Eye className="h-5 w-5" />
              View Question
            </DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              Reviewing question details
            </DialogDescription>
          </DialogHeader>

          {currentQuestion && (
            <ScrollArea className="max-h-[50vh] pr-4">
              <div className="space-y-6">
                <Badge variant="outline" className="mb-4 font-normal dark:text-gray-300 dark:border-gray-600">
                  {currentQuestion.category} - {currentQuestion.questionType}
                </Badge>

                <div className="pb-3">
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Question Text:</div>
                  <div className="text-gray-800 dark:text-gray-200 p-3 bg-gray-50 dark:bg-gray-900 rounded-md border ">
                    {currentQuestion.questionText}
                  </div>
                </div>

                {currentQuestion.category === "mcq" && (
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                        {currentQuestion.questionType === "Multiple Choice"
                          ? "Correct Answers:"
                          : "Correct Answer:"}
                      </div>
                      <div className="space-y-2">
                        {currentQuestion.questionType === "Multiple Choice"
                          ? currentQuestion.correctAnswers.map((answer, idx) => (
                            <div key={idx} className="bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 text-gray-800 dark:text-green-200 p-3 rounded-md">
                              {answer}
                              {currentQuestion.correctAnswerClarifications?.[idx] && (
                                <div className="text-xs mt-1 italic text-gray-600 dark:text-gray-400">
                                  Clarification: {currentQuestion.correctAnswerClarifications?.[idx]}
                                </div>
                              )}
                            </div>
                          ))
                          : (
                            <div className="bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 text-gray-800 dark:text-green-200 p-3 rounded-md">
                              {currentQuestion.correctAnswers[0]}
                              {currentQuestion.correctAnswerClarifications?.[0] && (
                                <div className="text-xs mt-1 italic text-gray-600 dark:text-gray-400">
                                  Clarification: {currentQuestion.correctAnswerClarifications?.[0]}
                                </div>
                              )}
                            </div>
                          )
                        }
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Other Options:</div>
                      <div className="space-y-2">
                        {currentQuestion.wrongAnswers.map((answer, ansIdx) => (
                          <div key={ansIdx} className="bg-card border border-gray-500 text-gray-800 dark:text-gray-300 p-3 rounded-md">
                            {answer}
                            {currentQuestion.wrongAnswerClarifications?.[ansIdx] && (
                              <div className="text-xs mt-1 italic text-gray-600 dark:text-gray-400">
                                Clarification: {currentQuestion.wrongAnswerClarifications?.[ansIdx]}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {currentQuestion.attachment && (
                  <div>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Attachment:</div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 p-2 border rounded-md dark:border-gray-600">
                        {getFileType(currentQuestion.attachmentName || '') === 'image' ? (
                          <FileImage className="h-4 w-4 text-teal-500 dark:text-teal-400" />
                        ) : getFileType(currentQuestion.attachmentName || '') === 'pdf' ? (
                          <File className="h-4 w-4 text-red-500 dark:text-red-400" />
                        ) : (
                          <Paperclip className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                        )}
                        <span className="text-sm dark:text-gray-300">
                          {currentQuestion.attachmentName}
                        </span>
                      </div>
                      {renderAttachmentPreview(currentQuestion.attachmentName, currentQuestion.attachmentPreviewUrl)}
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          )}

        </DialogContent>
      </Dialog>

      {/* Saved Questions Grid View */}
      {questions.length > 0 && (
        <Card className="bg-card h-[58vh] overflow-auto scrollbar-custom">
          <CardHeader className="pb-3">
            <CardTitle className="flex justify-between items-center dark:text-gray-100">
              <span>Saved Questions ({questions.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {questions.map((q, idx) => (
                <Card key={q.id} className="h-full flex flex-col dark:bg-black/50 ">
                  <div className="p-4 flex flex-col h-full">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="font-medium dark:text-gray-200">Q{idx + 1}</span>
                        <Badge variant="outline" className="font-normal text-xs dark:border-gray-600 dark:text-gray-300">
                          {q.category} - {q.questionType}
                        </Badge>
                      </div>
                      <Button
                        onClick={() => {
                          handleRemoveQuestion(idx);
                        }}
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 rounded-full text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="mt-3 line-clamp-3 text-sm text-gray-700 dark:text-gray-300 flex-grow">
                      {q.questionText || "Empty question"}
                    </div>

                    <div className="mt-3 pt-3 border-t ">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {q.category === "mcq" && (
                            q.questionType === "Multiple Choice"
                              ? `${q.correctAnswers.filter(a => a.trim()).length + q.wrongAnswers.filter(a => a.trim()).length} total options`
                              : `${q.wrongAnswers.length + 1} options`
                          )}
                        </span>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => openViewDialog(q)}
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs dark:text-gray-300 dark:hover:bg-gray-800"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                          <Button
                            onClick={() => openEditDialog(q, idx)}
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs dark:text-gray-300 dark:hover:bg-gray-800"
                          >
                            <Pencil className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}

            </div>
          </CardContent>
        </Card>
      )}
      {questions.length === 0 && (
        <Card className="bg-card ">
          <CardContent className="flex flex-col items-center justify-center py-10 text-center">
            <FileQuestion className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-3" />
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">No questions saved yet</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mb-4">
              Create a new question by clicking the plus button above to get started with your question bank
            </p>
            <Button
              onClick={openQuestionDialog}
              variant="default"
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Create Question
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CreationPage;





"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import QuestionTextInput from "./QuestionTextInput";
import AnswerSection from "./AnswerSection";
import CategorySelector from "../filter/selectors/CategorySelector";
import QuestionTypeSelector from "../filter/selectors/QuestionTypeSelector";
import { 
  Plus, Save, Paperclip,  X,   
  Pencil, FileQuestion, Eye, Trash2, 
  FileImage,  File
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

interface QuestionData {
  id: string;
  questionText: string;
  correctAnswer: string;
  wrongAnswers: string[];
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

const CreationPage: React.FC<CreationPageProps> = () => {
  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [newQuestion, setNewQuestion] = useState<QuestionData | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<QuestionData | null>(null);
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [category, setCategory] = useState("");
  const [questionType, setQuestionType] = useState("");
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    setQuestionType("");
  };

  // Create new question editor when dialog opens
  useEffect(() => {
    if (dialogOpen && category && questionType) {
      setNewQuestion({
        id: generateUniqueId(),
        questionText: "",
        correctAnswer: "",
        wrongAnswers: ["", ""],
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

  const handleQuestionFieldChange = (field: keyof QuestionData, value: any) => {
    if (newQuestion) {
      setNewQuestion({ ...newQuestion, [field]: value });
      // Clear validation error when field is changed
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
      
      // Clear validation error for wrong answers
      if (validationErrors.wrongAnswers) {
        const newErrors = { ...validationErrors };
        delete newErrors.wrongAnswers;
        setValidationErrors(newErrors);
      }
    }
  };

  const validateQuestion = (question: QuestionData): boolean => {
    const errors: {[key: string]: string} = {};
    
    if (!question.questionText.trim()) {
      errors.questionText = "Question text is required";
    }
    
    if (question.category === "mcq" && question.questionType === "Multiple Choice") {
      if (!question.correctAnswer.trim()) {
        errors.correctAnswer = "Correct answer is required";
      }
      
      const emptyWrongAnswers = question.wrongAnswers.filter(answer => !answer.trim()).length;
      if (emptyWrongAnswers > 0) {
        errors.wrongAnswers = "All answer options must be filled";
      }
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveNewQuestion = () => {
    if (newQuestion && validateQuestion(newQuestion)) {
      setQuestions([...questions, { ...newQuestion, saved: true, collapsed: true }]);
      setSaveSuccess(true);
      setDialogOpen(false);
      
      // Reset for next question
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
      
      // Reset selectors for next question
      setCategory("");
      setQuestionType("");
    }
  };

  const openEditDialog = (question: QuestionData, index: number) => {
    setCurrentQuestion({...question});
    setCurrentIndex(index);
    setEditDialogOpen(true);
  };

  const openViewDialog = (question: QuestionData) => {
    setCurrentQuestion({...question});
    setViewDialogOpen(true);
  };

  const handleEditQuestionChange = (field: keyof QuestionData, value: any) => {
    if (currentQuestion) {
      setCurrentQuestion({ ...currentQuestion, [field]: value });
      // Clear validation error when field is changed
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
      
      // Clear validation error for wrong answers
      if (validationErrors.wrongAnswers) {
        const newErrors = { ...validationErrors };
        delete newErrors.wrongAnswers;
        setValidationErrors(newErrors);
      }
    }
  };

  const saveEditedQuestion = () => {
    if (currentQuestion && validateQuestion(currentQuestion)) {
      const updatedQuestions = [...questions];
      updatedQuestions[currentIndex] = { ...currentQuestion };
      setQuestions(updatedQuestions);
      
      setEditDialogOpen(false);
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    }
  };

  const addWrongAnswer = () => {
    if (newQuestion) {
      setNewQuestion({
        ...newQuestion,
        wrongAnswers: [...newQuestion.wrongAnswers, ""]
      });
    }
  };

  const addWrongAnswerToExisting = () => {
    if (currentQuestion) {
      setCurrentQuestion({
        ...currentQuestion,
        wrongAnswers: [...currentQuestion.wrongAnswers, ""]
      });
    }
  };

  const removeWrongAnswer = (answerIndex: number) => {
    if (newQuestion && newQuestion.wrongAnswers.length > 2) {
      const updatedWrongAnswers = [...newQuestion.wrongAnswers];
      updatedWrongAnswers.splice(answerIndex, 1);
      setNewQuestion({ ...newQuestion, wrongAnswers: updatedWrongAnswers });
    }
  };

  const removeWrongAnswerFromExisting = (answerIndex: number) => {
    if (currentQuestion && currentQuestion.wrongAnswers.length > 2) {
      const updatedWrongAnswers = [...currentQuestion.wrongAnswers];
      updatedWrongAnswers.splice(answerIndex, 1);
      setCurrentQuestion({ ...currentQuestion, wrongAnswers: updatedWrongAnswers });
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
            <img 
              src={previewUrl} 
              alt="Attachment preview" 
              className="max-h-[200px] w-auto mx-auto object-contain"
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

  return (
    <div className="flex flex-col gap-6 dark:text-gray-100">
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

                  {category === "mcq" && questionType === "Multiple Choice" && (
                    <div className="space-y-4">
                      <AnswerSection
                        correctAnswer={newQuestion?.correctAnswer || ""}
                        wrongAnswers={newQuestion?.wrongAnswers || []}
                        onCorrectAnswerChange={(val) => handleQuestionFieldChange("correctAnswer", val)}
                        onWrongAnswerChange={(index, val) => handleWrongAnswerChange(index, val)}
                        errorCorrect={validationErrors.correctAnswer}
                        errorWrong={validationErrors.wrongAnswers}
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

                  {currentQuestion.category === "mcq" && currentQuestion.questionType === "Multiple Choice" && (
                    <div className="space-y-4">
                      <AnswerSection
                        correctAnswer={currentQuestion.correctAnswer}
                        wrongAnswers={currentQuestion.wrongAnswers}
                        onCorrectAnswerChange={(val) => handleEditQuestionChange("correctAnswer", val)}
                        onWrongAnswerChange={(answerIndex, val) => handleEditWrongAnswerChange(answerIndex, val)}
                        errorCorrect={validationErrors.correctAnswer}
                        errorWrong={validationErrors.wrongAnswers}
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

                {currentQuestion.category === "mcq" && currentQuestion.questionType === "Multiple Choice" && (
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Correct Answer:</div>
                      <div className="bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 text-gray-800 dark:text-green-200 p-3 rounded-md">
                        {currentQuestion.correctAnswer}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Other Options:</div>
                      <div className="space-y-2">
                        {currentQuestion.wrongAnswers.map((answer, ansIdx) => (
                          <div key={ansIdx} className=" bg-card border border-gray-500  text-gray-800 dark:text-gray-300 p-3 rounded-md">
                            {answer}
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
        <Card className="bg-card h-[60vh] overflow-auto scrollbar-custom">
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
                          const updatedQuestions = questions.filter((_, i) => i !== idx);
                          setQuestions(updatedQuestions);
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
                            `${q.wrongAnswers.length + 1} options`
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





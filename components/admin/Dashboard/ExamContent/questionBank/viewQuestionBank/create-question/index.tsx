"use client";

import React, { useState } from "react";
import Header from "./Header";
import CreationPage from "./other/creation";
import { Button } from "@/components/ui/button";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { toast } from "sonner";
import axios from "axios";
import Cookies from "js-cookie";
import { BACKEND_URL } from "@/Constants/backend";
import { resetCreateQuestionBank } from "@/redux/features/QuestionBankSlice";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter } from "@/components/ui/alert-dialog";
import { setCreateQuestionDefault } from "@/redux/features/QuestionSlice";
import { Loader2 } from "lucide-react";
export function DataTable() {
  const [category, setCategory] = useState("");
  const [questionType, setQuestionType] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const createQuestionBank = useSelector((state: RootState) => state.questionBank.createQuestionBank);
  const dispatch = useDispatch();
  const resetSelectors = () => {
    setCategory("");
    setQuestionType("");
    dispatch(resetCreateQuestionBank());
    const creationPage = document.querySelector('.creation-page');
    if (creationPage) {
      const event = new CustomEvent('resetQuestions');
      creationPage.dispatchEvent(event);
    }
  };

  const handleReset = () => {
    resetSelectors();
    setShowResetDialog(false);
  };

  const onSubmit = async () => {
    setIsLoading(true);
    const token = Cookies.get("adminjwt");
    const body = {
      questions: createQuestionBank.questions,
      moduleId: createQuestionBank.moduleId,
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    console.log(body);
    const response = await axios.post(`${BACKEND_URL}/question-bank/question/Interact`, body, { headers });
    if (response.data.isSuccessful) {
      toast.success(response.data.message);
      setShowConfirmDialog(false);
      dispatch(setCreateQuestionDefault());
      window.location.reload();
    } else {
      toast.error(response.data.message);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col gap-4 w-full h-[80dvh] p-1 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <Header />
      </div>

      <CreationPage
        category={category}
        questionType={questionType}
        onResetSelectors={() => setShowResetDialog(true)}
      />

      {
        createQuestionBank.questions.length > 0 && (
          <div className="flex justify-end mt-4 gap-4">
            <Button
              variant="outline"
              className="bg-white text-black dark:bg-slate-900 dark:text-white"
              onClick={() => setShowResetDialog(true)}
            >
              Reset
            </Button>

            <Button
              variant="default"
              className=""
              onClick={() => setShowConfirmDialog(true)}
            >
              Save Questions
            </Button>

          </div>
        )
      }

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Question Submission</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to submit these questions? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancel
            </Button>
            <Button variant="default" onClick={onSubmit}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Reset</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reset the questions in the creation list? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button variant="outline" onClick={() => setShowResetDialog(false)}>
              Cancel
            </Button>
            <Button variant="default" onClick={handleReset}>
              Confirm
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default DataTable;

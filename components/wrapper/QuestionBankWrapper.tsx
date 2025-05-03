"use client";

import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import QuestionBank from "../admin/Dashboard/ExamContent/questionBank/viewQuestionBank/Cards";


function QuestionBankWrapper() {
  const params = useParams();
  const id = params?.id ? parseInt(params.id as string, 10) : null;

  if (!id || isNaN(id)) {
    return (
      <div className="flex flex-col justify-center items-center h-[88vh] bg-card px-4 text-center">
        <div className="max-w-md space-y-6">
          <h1 className="text-3xl font-extrabold text-foreground">
            Invalid Question Bank ID
          </h1>
          <p className="text-muted-foreground">
            The ID you provided is either missing or invalid.
          </p>
          <Button asChild>
            <Link href="/admin/dashboard/exams/questions-bank">
              Go to Question Bank
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return <QuestionBank />;
}

export default QuestionBankWrapper;


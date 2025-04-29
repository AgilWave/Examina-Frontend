"use client";

import { useParams } from "next/navigation";
import QuestionBank from "@/components/admin/Dashboard/ExamContent/questionBank/viewQuestionBank/index";

export default function ViewQuestionBankPage() {
  const params = useParams();
  const idString = params?.id ? (Array.isArray(params.id) ? params.id[0] : params.id) : undefined;
  
  const id = idString ? parseInt(idString, 10) : undefined;

  if (!id || isNaN(id)) {
    return <div>Invalid question bank ID</div>;
  }

  return (
    <div>
        <QuestionBank/>
    </div>
  );
}

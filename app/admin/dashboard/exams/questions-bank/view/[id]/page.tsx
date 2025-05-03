import QuestionBank from "@/components/admin/Dashboard/ExamContent/questionBank/viewQuestionBank/index";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const dynamic = 'force-dynamic';

type ViewQuestionBankPageProps = {
  params: {
    id: string;
  };
};

const ViewQuestionBankPage = async ({ params }: ViewQuestionBankPageProps) => {
  const id = parseInt(params.id, 10);

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

  return (
    <div>
      <QuestionBank />
    </div>
  );
};

export default ViewQuestionBankPage;

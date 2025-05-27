"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

function CreateExamPage() {
  const router = useRouter();

  const handleNavigate = () => {
    router.push("/admin/dashboard/exams/manage-exams/create-exam");
  };

  return (
    <Button
      variant="outline"
      onClick={handleNavigate}
      className="bg-primary dark:bg-primary flex items-center justify-center hover:bg-primary/80 dark:hover:bg-primary/80 text-primary-foreground cursor-pointer w-full md:w-auto px-4 py-2 mt-12"
    >
      Create New Exam
    </Button>
  );
}

export default CreateExamPage;

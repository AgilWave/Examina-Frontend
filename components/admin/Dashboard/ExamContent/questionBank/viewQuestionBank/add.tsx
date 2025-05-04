"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {  useRouter, useSearchParams } from "next/navigation";

function CreateCourseDialog() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const idString = searchParams?.get('id');
  const moduleName = searchParams?.get('module');

  const handleNavigate = () => {
    if (idString) {
      router.push(`/admin/dashboard/exams/questions-bank/view-questions/create?id=${idString}&module=${moduleName}`);
    } else {
      console.error("No valid ID found in URL.");
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleNavigate}
      className="bg-primary dark:bg-primary flex items-center justify-center hover:bg-primary/80 dark:hover:bg-primary/80 text-primary-foreground cursor-pointer w-full md:w-auto px-4 py-2"
    >
      <Plus className="h-4 w-4" />
    </Button>
  );
}

export default CreateCourseDialog;

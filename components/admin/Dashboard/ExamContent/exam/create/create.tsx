import React from "react";
import { useSelector } from "react-redux";
import ExamDetailsForm from "./ExamDetails/ExamDetails";
import { Scheduling } from "./Scheduling/Scheduling";
import ExamFormat from "./ExamFormat/ExamFormat";
import SecuritySettings from "./SecuritySettings/SecuritySettings";
import Questions from "./Questions/Questions";
import NotificationSettings from "./NotificationSettings/NotificationSettings";
import ExamSummary from "./ExamSummary/ExamSummary";
import { Button } from "@/components/ui/button";
import { RootState } from "@/redux/store";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { BACKEND_URL } from "@/Constants/backend";
import Cookies from "js-cookie";

export default function CreateExamPage() {
  const examState = useSelector((state: RootState) => state.exam.createExam);
  const router = useRouter();


  const handleCreateExam = async () => {
    try {
      const token = Cookies.get("adminjwt");

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.post(`${BACKEND_URL}/exams/Interact`, examState, { headers });
      if (response.data.isSucessful) {
        toast.success(response.data.message);
        router.push("/admin/dashboard/exam");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }

  };

  return (
    <div className="min-h-screen bg-white text-zinc-900 dark:bg-black rounded-2xl dark:text-white p-4 space-y-6">
      <div className="grid gap-6">
        <ExamDetailsForm />
        <Scheduling />
        <ExamFormat />
        <SecuritySettings />
        <Questions createdBy="current-user" />
        <NotificationSettings />
        <ExamSummary />
        <div className="flex justify-end mt-6">
          <Button
            onClick={handleCreateExam}
            className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg"
          >
            Create Exam
          </Button>
        </div>
      </div>
    </div>
  );
}

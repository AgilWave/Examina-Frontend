import React from "react";
import ExamDetailsForm from "./ExamDetails/ExamDetails";
import { Scheduling } from "./Scheduling/Scheduling";
import ExamFormat from "./ExamFormat/ExamFormat";
import SecuritySettings from "./SecuritySettings/SecuritySettings";
import Questions from "./Questions/Questions";
import NotificationSettings from "./NotificationSettings/NotificationSettings";
import ExamSummary from "./ExamSummary/ExamSummary";

export default function CreateExamPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 dark:bg-black rounded-2xl dark:text-white p-4 space-y-6">
      {/* <h1 className="text-3xl font-bold text-center text-teal-600 dark:text-teal-400">
        📝 Create New Exam
      </h1> */}
      <div className="grid gap-6">
        <ExamDetailsForm />
        <Scheduling />
        <ExamFormat />
        <SecuritySettings />
        <Questions />
        <NotificationSettings />
        <ExamSummary
          data={{
            examDetails: {
              name: "Midterm Test",
              code: "MT2025",
              faculty: "Computing",
              course: "Web Development",
              batch: "Y2S1",
              module: "Frontend Basics",
              examiner: "Dr. Nirmala",
            },
            scheduling: {
              date: "2025-06-15",
              time: "10:00 AM",
            },
            securitySettings: {
              webcam: true,
              mic: false,
              networkTest: true,
              lockBrowser: true,
              surroundingsPhoto: false,
            },
            format: {
              mode: "MCQ",
              randomizeQuestions: false,
              randomizeAnswers: false,
              allowBacktracking: true,
              lateEntry: "10 minutes",
            },
            questions: {
              source: "Existing",
              count: 0,
            },
            notifications: {
              sendEmail: true,
              reminder: "24 hours before",
            },
          }}
        />
      </div>
    </div>
  );
}

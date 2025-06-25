/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { LogoutAction } from "@/services/actions/auth";
import axios from "axios";
import Cookies from "js-cookie";
import { BACKEND_URL } from "@/Constants/backend";

export interface ExamAnswerSubmission {
  examId: number;
  questionId: number;
  answer: string;
  timeTaken?: number;
  isCorrect?: boolean;
}

export async function submitExamAnswers(answers: ExamAnswerSubmission[]) {
    const jwt = Cookies.get("jwt");
    const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
    };
    
    try {
        const response = await axios.post(`${BACKEND_URL}/exam-answers/submit`, answers, { headers });

        if (response.data.isSuccessful) {
            return response.data;
        } else {
            throw new Error(response.data.message || "Failed to submit exam answers");
        }
    } catch (err: any) {
        if (err.response?.status === 401) {
            LogoutAction();
        }
        throw err;
    }
} 
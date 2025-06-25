/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { LogoutAction } from "@/services/actions/auth";
import axios from "axios";
import Cookies from "js-cookie";
import { BACKEND_URL } from "@/Constants/backend";

export interface JoinExamRequest {
  examId: number;
  studentId: number;
}

export async function joinExam(examId: number, studentId: number) {
    const jwt = Cookies.get("jwt");
    const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
    };
    
    try {
        const response = await axios.post(`${BACKEND_URL}/exam-participants/join`, {
            examId,
            studentId
        }, { headers });

        if (response.data.isSuccessful) {
            return response.data;
        } else {
            throw new Error(response.data.message || "Failed to join exam");
        }
    } catch (err: any) {
        if (err.response?.status === 401) {
            LogoutAction();
        }
        throw err;
    }
}

export async function updateConnectionStatus(examId: number, studentId: number, isConnected: boolean) {
    const jwt = Cookies.get("studentjwt") || Cookies.get("adminjwt") || Cookies.get("lecturerjwt");
    const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
    };
    
    try {
        const response = await axios.patch(`${BACKEND_URL}/exam-participants/connection-status`, {
            examId,
            studentId,
            isConnected
        }, { headers });

        if (response.data.isSuccessful) {
            return response.data;
        } else {
            throw new Error(response.data.message || "Failed to update connection status");
        }
    } catch (err: any) {
        if (err.response?.status === 401) {
            LogoutAction();
        }
        throw err;
    }
} 
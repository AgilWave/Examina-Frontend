/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { LogoutAction } from "@/services/actions/auth";
import axios from "axios";
import Cookies from "js-cookie";
import { BACKEND_URL } from "@/Constants/backend";

export interface UpdateParticipantStatusRequest {
    examId: number;
    studentId: number;
    isSubmitted?: boolean;
    submittedAt?: string;
}

export async function updateParticipantStatus(data: UpdateParticipantStatusRequest) {
    const jwt = Cookies.get("jwt");
    const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
    };

    try {
        const response = await axios.patch(`${BACKEND_URL}/exam-participants/connection-status`, data, { headers });

        if (response.data.isSuccessful) {
            return response.data;
        } else {
            throw new Error(response.data.message || "Failed to update participant status");
        }
    } catch (err: any) {
        if (err.response?.status === 401) {
            LogoutAction();
        }
        throw err;
    }
} 
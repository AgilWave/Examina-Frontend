/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { LogoutAction } from "@/services/actions/auth";
import axios from "axios";
import Cookies from "js-cookie";
import { BACKEND_URL } from "@/Constants/backend";

export interface ParticipantStatus {
  hasJoined: boolean;
  joinedAt: string;
  isConnected: boolean;
  disconnectedAt?: string;
  isSubmitted?: boolean;
  submittedAt?: string;
}

export async function checkParticipantStatus(examId: number, studentId: number): Promise<ParticipantStatus> {
    const jwt = Cookies.get("jwt") || Cookies.get("adminjwt") || Cookies.get("lecturerjwt");
    const headers = {
        Accept: "application/json",
        Authorization: `Bearer ${jwt}`,
    };
    
    try {
        const response = await axios.get(`${BACKEND_URL}/exam-participants/status/${examId}/${studentId}`, { headers });

        if (response.data.isSuccessful) {
            return response.data.content;
        } else {
            // If no participant found, return default status
            return {
                hasJoined: false,
                joinedAt: new Date().toISOString(),
                isConnected: false
            };
        }
    } catch (err: any) {
        if (err.response?.status === 401) {
            LogoutAction();
        }
        // If participant not found (404), return default status
        if (err.response?.status === 404) {
            return {
                hasJoined: false,
                joinedAt: new Date().toISOString(),
                isConnected: false
            };
        }
        throw err;
    }
} 
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { LogoutAction } from "@/services/actions/auth";
import axios from "axios";
import Cookies from "js-cookie";
import { BACKEND_URL } from "@/Constants/backend";

export async function getExamStatistics(examId: number) {
    const jwt = Cookies.get("adminjwt") || Cookies.get("lecturerjwt") || Cookies.get("jwt");
    const headers = {
        Accept: "application/json",
        Authorization: `Bearer ${jwt}`,
    };
    
    try {
        const response = await axios.get(`${BACKEND_URL}/exam-answers/statistics/exam/${examId}`, { headers });

        if (response.data.isSuccessful) {
            return response.data.content;
        } else {
            throw new Error(response.data.message || "Failed to fetch exam statistics");
        }
    } catch (err: any) {
        if (err.response?.status === 401) {
            LogoutAction();
        }
        throw err;
    }
}

export async function getExamAnswers(examId: number) {
    const jwt = Cookies.get("adminjwt") || Cookies.get("lecturerjwt") || Cookies.get("jwt");
    const headers = {
        Accept: "application/json",
        Authorization: `Bearer ${jwt}`,
    };
    
    try {
        const response = await axios.get(`${BACKEND_URL}/exam-answers/exam/${examId}`, { headers });

        if (response.data.isSuccessful) {
            return response.data.content;
        } else {
            throw new Error(response.data.message || "Failed to fetch exam answers");
        }
    } catch (err: any) {
        if (err.response?.status === 401) {
            LogoutAction();
        }
        throw err;
    }
}

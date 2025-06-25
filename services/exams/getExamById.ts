/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

// import { LogoutAction } from "@/services/actions/auth";
import axios from "axios";
import Cookies from "js-cookie";
import { BACKEND_URL } from "@/Constants/backend";

export async function getExamById(examId: string) {
    const jwt = Cookies.get("jwt");
    const headers = {
        Accept: "text/plain",
        Authorization: `Bearer ${jwt}`,
    };
    
    try {
        const response = await axios.get(`${BACKEND_URL}/exams/${examId}`, { headers });

        if (response.data.isSuccessful) {
            return response.data;
        } else {
            throw new Error(response.data.message || "Failed to fetch exam");
        }
    } catch (err: any) {
        // if (err.response?.status === 401) {
        //     LogoutAction();
        // }
        throw err;
    }
} 
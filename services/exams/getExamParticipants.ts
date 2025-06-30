/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { LogoutAction } from "@/services/actions/auth";
import axios from "axios";
import Cookies from "js-cookie";
import { BACKEND_URL } from "@/Constants/backend";

export async function getExamParticipants(examId: number) {
    const jwt = Cookies.get("adminjwt") || Cookies.get("lecturerjwt") || Cookies.get("jwt");
    const headers = {
        Accept: "application/json",
        Authorization: `Bearer ${jwt}`,
    };
    
    try {
        const response = await axios.get(`${BACKEND_URL}/exam-participants/${examId}/participants`, { headers });

        if (response.data.isSuccessful) {
            return response.data.content;
        } else {
            throw new Error(response.data.message || "Failed to fetch exam participants");
        }
    } catch (err: any) {
        if (err.response?.status === 401) {
            LogoutAction();
        }
        throw err;
    }
}

export async function getExamParticipantCount(examId: number) {
    const jwt = Cookies.get("adminjwt") || Cookies.get("lecturerjwt") || Cookies.get("jwt");
    const headers = {
        Accept: "application/json",
        Authorization: `Bearer ${jwt}`,
    };
    
    try {
        const response = await axios.get(`${BACKEND_URL}/exam-participants/${examId}/participant-count`, { headers });

        if (response.data.isSuccessful) {
            return response.data.content;
        } else {
            throw new Error(response.data.message || "Failed to fetch participant count");
        }
    } catch (err: any) {
        if (err.response?.status === 401) {
            LogoutAction();
        }
        throw err;
    }
}

export async function getConnectedParticipants(examId: number) {
    const jwt = Cookies.get("adminjwt") || Cookies.get("lecturerjwt") || Cookies.get("jwt");
    const headers = {
        Accept: "application/json",
        Authorization: `Bearer ${jwt}`,
    };
    
    try {
        const response = await axios.get(`${BACKEND_URL}/exam-participants/${examId}/connected-participants`, { headers });

        if (response.data.isSuccessful) {
            return response.data.content;
        } else {
            throw new Error(response.data.message || "Failed to fetch connected participants");
        }
    } catch (err: any) {
        if (err.response?.status === 401) {
            LogoutAction();
        }
        throw err;
    }
}

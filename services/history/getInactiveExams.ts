/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { LogoutAction } from "@/services/actions/auth";
import {
    setExamHistoryPage,
    setExamHistoryTotalPages,
    setExamHistoryNextPage,
    setExamHistoryPrevPage,
} from "@/redux/features/pageSlice";
import axios from "axios";      
import Cookies from "js-cookie";
import { BACKEND_URL } from "@/Constants/backend";

export async function getInactiveExams(
    dispatch: any | null,
    page: number,
    pageSize: number,
    name: string | null,
) {
    const jwt = Cookies.get("adminjwt");
    const headers = {
        Accept: "text/plain",
        Authorization: `Bearer ${jwt}`,
    };
    try {
        let url = `${BACKEND_URL}/exams/Search?page=${page}&pageSize=${pageSize}&status=completed`;
        if (name) {
            url += `?name=${name}`;
        }
        const response = await axios.get(url, { headers });

        if (response.data.isSuccessful) {
            if (dispatch === null) return response.data;
            dispatch(setExamHistoryPage(response.data.paginationInfo.page));
            dispatch(setExamHistoryTotalPages(response.data.paginationInfo.totalPages));
            dispatch(setExamHistoryNextPage(response.data.paginationInfo.nextPage));
            dispatch(setExamHistoryPrevPage(response.data.paginationInfo.page - 1));
            return response.data;
        } else {
            if (dispatch === null) return response.data;
            dispatch(setExamHistoryPage(1));
            dispatch(setExamHistoryTotalPages(0));
            dispatch(setExamHistoryNextPage(-1));
            dispatch(setExamHistoryPrevPage(-1));
            return response.data;
        }
    } catch (err: any) {
        if (err.response.status === 401) {
            LogoutAction();
        }
    }
}
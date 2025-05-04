

/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { LogoutAction } from "@/services/actions/auth";
import {
    setQuestionPage,
    setQuestionTotalPages,
    setQuestionNextPage,
    setQuestionPrevPage,    
} from "@/redux/features/pageSlice";
import axios from "axios";
import Cookies from "js-cookie";
import { BACKEND_URL } from "@/Constants/backend";

export async function getAllQuestionsByModuleId(
    dispatch: any | null,
    page: number,
    pageSize: number,
    moduleId: string | null,
    searchQuery: string | null,

) {
    const jwt = Cookies.get("adminjwt");
    const headers = {
        Accept: "text/plain",
        Authorization: `Bearer ${jwt}`,
    };
    try {
        let url = `${BACKEND_URL}/question-bank/question/Search?page=${page}&pageSize=${pageSize}&moduleId=${moduleId}`;

        if (searchQuery) {
            url += `&name=${searchQuery}`;
        }

        const response = await axios.get(url, { headers });

        if (response.data.isSuccessful) {
            if (dispatch === null) return response.data;
            dispatch(setQuestionPage(response.data.paginationInfo.page));
            dispatch(setQuestionTotalPages(response.data.paginationInfo.totalPages));
            dispatch(setQuestionNextPage(response.data.paginationInfo.nextPage));
            dispatch(setQuestionPrevPage(response.data.paginationInfo.page - 1));
            return response.data;
        } else {
            if (dispatch === null) return response.data;
            dispatch(setQuestionPage(1));
            dispatch(setQuestionTotalPages(0));
            dispatch(setQuestionNextPage(-1));
            dispatch(setQuestionPrevPage(-1));
            return response.data;
        }
    } catch (err: any) {
        if (err.response.status === 401) {
            LogoutAction();
        }
    }
}
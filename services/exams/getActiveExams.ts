/* eslint-disable @typescript-eslint/no-explicit-any */
 "use client";

import { LogoutAction } from "@/services/actions/auth";
import {
    setExamPage,
    setExamTotalPages,
    setExamNextPage,
    setExamPrevPage,
} from "@/redux/features/pageSlice";
import axios from "axios";
import Cookies from "js-cookie";
import { BACKEND_URL } from "@/Constants/backend";

export async function getActiveExams(
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
        let url = `${BACKEND_URL}/exams/Search?page=${page}&pageSize=${pageSize}&status=pending`;
        if (name) {
            url += `?name=${name}`;
        }
        const response = await axios.get(url, { headers });

        if (response.data.isSuccessful) {
            if (dispatch === null) return response.data;
            dispatch(setExamPage(response.data.paginationInfo.page));
            dispatch(setExamTotalPages(response.data.paginationInfo.totalPages));
            dispatch(setExamNextPage(response.data.paginationInfo.nextPage));
            dispatch(setExamPrevPage(response.data.paginationInfo.page - 1));
            return response.data;
        } else {
            if (dispatch === null) return response.data;
            dispatch(setExamPage(1));
            dispatch(setExamTotalPages(0));
            dispatch(setExamNextPage(-1));
            dispatch(setExamPrevPage(-1));
            return response.data;
        }
    } catch (err: any) {
        if (err.response.status === 401) {
            LogoutAction();
        }
    }
}
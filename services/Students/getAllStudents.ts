/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { LogoutAction } from "@/services/actions/auth";
import {
    setStudentPage,
    setStudentTotalPages,
    setStudentNextPage,
    setStudentPrevPage,
} from "@/redux/features/pageSlice";
import axios from "axios";
import Cookies from "js-cookie";
import { BACKEND_URL } from "@/Constants/backend";

export async function getAllStudents(
dispatch: any | null, page: number, pageSize: number, filterApplied: boolean | null, name: string | null, isBlacklisted: string | null, batchCode: string | null) {
    const jwt = Cookies.get("adminjwt");
    const headers = {
        Accept: "text/plain",
        Authorization: `Bearer ${jwt}`,
    };
    try {
        let url = `${BACKEND_URL}/users/Search?page=${page}&pageSize=${pageSize}&role=student`;
        if (name) {
            url += `&name=${name}`;
        }
        if (batchCode) {
            url += `&batchCode=${batchCode}`;
        }
        const response = await axios.get(url, { headers });

        if (response.data.isSuccessful) {
            if (dispatch === null) return response.data;
            dispatch(setStudentPage(response.data.paginationInfo.page));
            dispatch(setStudentTotalPages(response.data.paginationInfo.totalPages));
            dispatch(setStudentNextPage(response.data.paginationInfo.nextPage));
            dispatch(setStudentPrevPage(response.data.paginationInfo.page - 1));
            return response.data;
        } else {
            if (dispatch === null) return response.data;
            dispatch(setStudentPage(1));
            dispatch(setStudentTotalPages(0));
            dispatch(setStudentNextPage(-1));
            dispatch(setStudentPrevPage(-1));
            return response.data;
        }
    } catch (err: any) {
        if (err.response.status === 401) {
            LogoutAction();
        }
    }
}
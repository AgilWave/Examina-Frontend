/* eslint-disable @typescript-eslint/no-explicit-any */
 "use client";

import { LogoutAction } from "@/services/actions/auth";
import {
    setResultPage,
    setResultTotalPages,
    setResultNextPage,
    setResultPrevPage,
} from "@/redux/features/resultSlice";
import axios from "axios";
import Cookies from "js-cookie";
import { BACKEND_URL } from "@/Constants/backend";

export async function getAllResultes(
    dispatch: any | null,
    page: number,
    pageSize: number,
    filterApplied: boolean | null,
    name: string | null,
    isActive: string | null
) {
    const jwt = Cookies.get("adminjwt");
    const headers = {
        Accept: "text/plain",
        Authorization: `Bearer ${jwt}`,
    };
    try {
        let url = `${BACKEND_URL}/Result/Search?page=${page}&pageSize=${pageSize}`;

        if (filterApplied) {
            url += `&isActive=${isActive}`;
        }
        if (name) {
            url += `&name=${name}`;
        }
        const response = await axios.get(url, { headers });

        if (response.data.isSuccessful) {
            if (dispatch === null) return response.data;
            dispatch(setResultPage(response.data.paginationInfo.page));
            dispatch(setResultTotalPages(response.data.paginationInfo.totalPages));
            dispatch(setResultNextPage(response.data.paginationInfo.nextPage));
            dispatch(setResultPrevPage(response.data.paginationInfo.page - 1));
            return response.data;
        } else {
            if (dispatch === null) return response.data;
            dispatch(setResultPage(1));
            dispatch(setResultTotalPages(0));
            dispatch(setResultNextPage(-1));
            dispatch(setResultPrevPage(-1));
            return response.data;
        }
    } catch (err: any) {
        if (err.response.status === 401) {
            LogoutAction();
        }
    }
}
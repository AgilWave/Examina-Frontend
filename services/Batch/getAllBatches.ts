/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { LogoutAction } from "@/services/actions/auth";
import {
    setBatchPage,
    setBatchTotalPages,
    setBatchNextPage,
    setBatchPrevPage,
} from "@/redux/features/BatchSlice";
import axios from "axios";
import Cookies from "js-cookie";
import { BACKEND_URL } from "@/Constants/backend";

export async function getAllBatches(
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
        let url = `${BACKEND_URL}/batch/Search?page=${page}&pageSize=${pageSize}`;

        if (filterApplied) {
            url += `&isActive=${isActive}`;
        }
        if (name) {
            url += `&name=${name}`;
        }
        const response = await axios.get(url, { headers });

        if (response.data.isSuccessful) {
            if (dispatch === null) return response.data;
            dispatch(setBatchPage(response.data.paginationInfo.page));
            dispatch(setBatchTotalPages(response.data.paginationInfo.totalPages));
            dispatch(setBatchNextPage(response.data.paginationInfo.nextPage));
            dispatch(setBatchPrevPage(response.data.paginationInfo.page - 1));
            return response.data;
        } else {
            if (dispatch === null) return response.data;
            dispatch(setBatchPage(1));
            dispatch(setBatchTotalPages(0));
            dispatch(setBatchNextPage(-1));
            dispatch(setBatchPrevPage(-1));
            return response.data;
        }
    } catch (err: any) {
        if (err.response.status === 401) {
            LogoutAction();
        }
    }
}
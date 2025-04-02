/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { LogoutAction } from "@/services/actions/auth";
import {
    setUserPage,
    setUserTotalPages,
    setUserNextPage,
    setUserPrevPage,
} from "@/redux/features/pageSlice";
import axios from "axios";
import Cookies from "js-cookie";

export async function getAllAdminUsers(
    dispatch: any | null,
    page: number,
    pageSize: number,
    filterApplied: boolean | null,
    name: string | null,
    isBlacklisted: string | null
) {
    const jwt = Cookies.get("adminjwt");
    const headers = {
        Accept: "text/plain",
        Authorization: `Bearer ${jwt}`,
    };
    try {
        let url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/Search?page=${page}&pageSize=${pageSize}&role=admin`;
        if (filterApplied) {
            url += `&isBlacklisted=${isBlacklisted}`;
        }
        if (name) {
            url += `&name=${name}`;
        }
        const response = await axios.get(url, { headers });

        if (response.data.isSuccessful) {
            if (dispatch === null) return response.data;
            dispatch(setUserPage(response.data.paginationInfo.page));
            dispatch(setUserTotalPages(response.data.paginationInfo.totalPages));
            dispatch(setUserNextPage(response.data.paginationInfo.nextPage));
            dispatch(setUserPrevPage(response.data.paginationInfo.page - 1));
            return response.data;
        } else {
            if (dispatch === null) return response.data;
            dispatch(setUserPage(1));
            dispatch(setUserTotalPages(0));
            dispatch(setUserNextPage(-1));
            dispatch(setUserPrevPage(-1));
            return response.data;
        }
    } catch (err: any) {
        if (err.response.status === 401) {
            LogoutAction();
        }
    }
}
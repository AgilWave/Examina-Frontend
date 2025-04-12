/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { LogoutAction } from "@/services/actions/auth";
import {
    setLecturePage,
    setLectureTotalPages,
    setLectureNextPage,
    setLecturePrevPage,
} from "@/redux/features/pageSlice";
import axios from "axios";
import Cookies from "js-cookie";
import { BACKEND_URL } from "@/Constants/backend";

export async function getAllLectures(
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
        let url = `${BACKEND_URL}/users/Search?page=${page}&pageSize=${pageSize}&role=admin`;

        if (filterApplied) {
            url += `&isBlacklisted=${isBlacklisted}`;
        }
        if (name) {
            url += `&name=${name}`;
        }
        const response = await axios.get(url, { headers });

        if (response.data.isSuccessful) {
            if (dispatch === null) return response.data;
            dispatch(setLecturePage(response.data.paginationInfo.page));
            dispatch(setLectureTotalPages(response.data.paginationInfo.totalPages));
            dispatch(setLectureNextPage(response.data.paginationInfo.nextPage));
            dispatch(setLecturePrevPage(response.data.paginationInfo.page - 1));
            return response.data;
        } else {
            if (dispatch === null) return response.data;
            dispatch(setLecturePage(1));
            dispatch(setLectureTotalPages(0));
            dispatch(setLectureNextPage(-1));
            dispatch(setLecturePrevPage(-1));
            return response.data;
        }
    } catch (err: any) {
        if (err.response.status === 401) {
            LogoutAction();
        }
    }
}
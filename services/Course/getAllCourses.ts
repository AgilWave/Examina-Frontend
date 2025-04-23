/* eslint-disable @typescript-eslint/no-explicit-any */
 "use client";

import { LogoutAction } from "@/services/actions/auth";
import {
    setCoursePage,  
    setCourseTotalPages,
    setCourseNextPage,
    setCoursePrevPage,
} from "@/redux/features/CourseSlice";
import axios from "axios";
import Cookies from "js-cookie";
import { BACKEND_URL } from "@/Constants/backend";

export async function getAllCourses(
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
        let url = `${BACKEND_URL}/course/Search?page=${page}&pageSize=${pageSize}`;

        if (filterApplied) {
            url += `&isActive=${isActive}`;
        }
        if (name) {
            url += `&name=${name}`;
        }
        const response = await axios.get(url, { headers });

        if (response.data.isSuccessful) {
            if (dispatch === null) return response.data;
            dispatch(setCoursePage(response.data.paginationInfo.page));
            dispatch(setCourseTotalPages(response.data.paginationInfo.totalPages));
            dispatch(setCourseNextPage(response.data.paginationInfo.nextPage));
            dispatch(setCoursePrevPage(response.data.paginationInfo.page - 1));
            return response.data;
        } else {
            if (dispatch === null) return response.data;
            dispatch(setCoursePage(1));
            dispatch(setCourseTotalPages(0));
            dispatch(setCourseNextPage(-1));
            dispatch(setCoursePrevPage(-1));
            return response.data;
        }
    } catch (err: any) {
        if (err.response.status === 401) {
            LogoutAction();
        }
    }
}
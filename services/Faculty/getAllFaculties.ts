/* eslint-disable @typescript-eslint/no-explicit-any */
 "use client";

import { LogoutAction } from "@/services/actions/auth";
import {
    setFacultyPage,  
    setFacultyTotalPages,
    setFacultyNextPage,
    setFacultyPrevPage,
} from "@/redux/features/FacultySlice";
import axios from "axios";
import Cookies from "js-cookie";
import { BACKEND_URL } from "@/Constants/backend";



export async function getAllFaculties(
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
        let url = `${BACKEND_URL}/Faculty/Search?page=${page}&pageSize=${pageSize}`;

        if (filterApplied) {
            url += `&isActive=${isActive}`;
        }
        if (name) {
            url += `&name=${name}`;
        }
        const response = await axios.get(url, { headers });

        if (response.data.isSuccessful) {
            if (dispatch === null) return response.data;
            dispatch(setFacultyPage(response.data.paginationInfo.page));
            dispatch(setFacultyTotalPages(response.data.paginationInfo.totalPages));
            dispatch(setFacultyNextPage(response.data.paginationInfo.nextPage));
            dispatch(setFacultyPrevPage(response.data.paginationInfo.page - 1));
            return response.data;
        } else {
            if (dispatch === null) return response.data;
            dispatch(setFacultyPage(1));
            dispatch(setFacultyTotalPages(0));
            dispatch(setFacultyNextPage(-1));
            dispatch(setFacultyPrevPage(-1));
            return response.data;
        }
    } catch (err: any) {
        if (err.response.status === 401) {
            LogoutAction();
        }
    }
}
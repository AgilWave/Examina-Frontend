/* eslint-disable @typescript-eslint/no-explicit-any */
 "use client";

import { LogoutAction } from "@/services/actions/auth";
import {
    setModulePage,
    setModuleTotalPages,
    setModuleNextPage,
    setModulePrevPage,
} from "@/redux/features/ModuleSlice";
import axios from "axios";
import Cookies from "js-cookie";
import { BACKEND_URL } from "@/Constants/backend";

export async function getAllModules(
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
        let url = `${BACKEND_URL}/module/Search?page=${page}&pageSize=${pageSize}`;

        if (filterApplied) {
            url += `&isActive=${isActive}`;
        }
        if (name) {
            url += `&name=${name}`;
        }
        const response = await axios.get(url, { headers });

        if (response.data.isSuccessful) {
            if (dispatch === null) return response.data;
            dispatch(setModulePage(response.data.paginationInfo.page));
            dispatch(setModuleTotalPages(response.data.paginationInfo.totalPages));
            dispatch(setModuleNextPage(response.data.paginationInfo.nextPage));
            dispatch(setModulePrevPage(response.data.paginationInfo.page - 1));
            return response.data;
        } else {
            if (dispatch === null) return response.data;
            dispatch(setModulePage(1));
            dispatch(setModuleTotalPages(0));
            dispatch(setModuleNextPage(-1));
            dispatch(setModulePrevPage(-1));
            return response.data;
        }
    } catch (err: any) {
        if (err.response.status === 401) {
            LogoutAction();
        }
    }
}
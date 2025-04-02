"use client";

import { createSlice } from "@reduxjs/toolkit";
import { PageState } from "@/types/page";

const initialState: PageState = {
    users: {
        totalPages: 0,
        page: 1,
        nextPage: -1,
        prevPage: -1,
    },
};

export const PageSlice = createSlice({
    name: "page",
    initialState,
    reducers: {
        setUserPage: (state, action) => {
            state.users.page = action.payload;
            if (typeof window !== "undefined") {
                sessionStorage.setItem("userPage", JSON.stringify(action.payload));
            }
        },
        setUserTotalPages: (state, action) => {
            state.users.totalPages = action.payload;
            if (typeof window !== "undefined") {
                sessionStorage.setItem("userTotalPages", JSON.stringify(action.payload));
            }
        },
        setUserNextPage: (state, action) => {
            state.users.nextPage = action.payload;
            if (typeof window !== "undefined") {
                sessionStorage.setItem("userNextPage", JSON.stringify(action.payload));
            }
        },
        setUserPrevPage: (state, action) => {
            state.users.prevPage = action.payload;
            if (typeof window !== "undefined") {
                sessionStorage.setItem("userPrevPage", JSON.stringify(action.payload));
            }
        },
        
    },
});

export const {
    setUserPage,
    setUserTotalPages,
    setUserNextPage,
    setUserPrevPage,
} = PageSlice.actions;

export default PageSlice.reducer;
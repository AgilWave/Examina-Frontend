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
    students: {
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

        //students
        setStudentPage: (state, action) => {
            state.students.page = action.payload;
            if (typeof window !== "undefined") {
                sessionStorage.setItem("studentPage", JSON.stringify(action.payload));
            }
        },
        setStudentTotalPages: (state, action) => {
            state.students.totalPages = action.payload;
            if (typeof window !== "undefined") {
                sessionStorage.setItem("studentTotalPages", JSON.stringify(action.payload));
            }
        },
        setStudentNextPage: (state, action) => {
            state.students.nextPage = action.payload;
            if (typeof window !== "undefined") {
                sessionStorage.setItem("studentNextPage", JSON.stringify(action.payload));
            }
        },
        setStudentPrevPage: (state, action) => {
            state.students.prevPage = action.payload;
            if (typeof window !== "undefined") {
                sessionStorage.setItem("studentPrevPage", JSON.stringify(action.payload));
            }
        },

        
    },
});

export const {
    setUserPage,
    setUserTotalPages,
    setUserNextPage,
    setUserPrevPage,

    //students
    setStudentPage,
    setStudentTotalPages,
    setStudentNextPage,
    setStudentPrevPage,
    
} = PageSlice.actions;



export default PageSlice.reducer;
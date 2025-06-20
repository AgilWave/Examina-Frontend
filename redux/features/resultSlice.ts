"use client";

import { createSlice } from "@reduxjs/toolkit";
import { AdminInteract } from "@/types/result";

const initialState: AdminInteract = {
    viewResult: {
        module: "",
        examCode: "",
        examDate: "",
        result: "",
        points: "",
        credits: "",
        updatedBy: "",
    },
    // Pagination
    page: 1,
    totalPages: 0,
    nextPage: -1,
    prevPage: -1,
    editBlocked: true
};

export const resultSlice = createSlice({
    name: "result",
    initialState,
    reducers: {

    // View Result
        setFullViewResult: (state, action) => {
            state.viewResult = action.payload;
        },
        setViewModule: (state, action) => {
            state.viewResult.module = action.payload;
        },
        setViewExamCode: (state, action) => {
            state.viewResult.examCode = action.payload;
        },
        setViewExamDate: (state, action) => {
            state.viewResult.examDate = action.payload;
        },
        setViewResult: (state, action) => {
            state.viewResult.result = action.payload;
        },
        setViewPoints: (state, action) => {
            state.viewResult.points = action.payload;
        },
        setViewCredits: (state, action) => {
            state.viewResult.credits = action.payload;
        },
        setViewUpdatedBy: (state, action) => {
            state.viewResult.updatedBy = action.payload;
        },
        setEditBlocked: (state, action) => {
            state.editBlocked = action.payload;
        },

        // Pagination
        setResultPage: (state, action) => {
            state.page = action.payload;
        },
        setResultTotalPages: (state, action) => {
            state.totalPages = action.payload;
        },
        setResultNextPage: (state, action) => {
            state.nextPage = action.payload;
        },
        setResultPrevPage: (state, action) => {
            state.prevPage = action.payload;
        },
    },
});

export const {

    // View Result
    setFullViewResult,
    setViewModule,
    setViewExamCode,
    setViewExamDate,
    setViewResult,
    setViewPoints,
    setViewCredits,
    setViewUpdatedBy,
    setEditBlocked,

    // Pagination
    setResultPage,
    setResultTotalPages,
    setResultNextPage,
    setResultPrevPage
} = resultSlice.actions;
export default resultSlice.reducer;

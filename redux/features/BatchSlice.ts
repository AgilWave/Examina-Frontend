"use client";

import { createSlice } from "@reduxjs/toolkit";
import { BatchInteract } from "@/types/batch";

const initialState: BatchInteract = {
    createBatch: {
        batchCode: "",
        courseName: "",
        courseId: "",
        year: "",
        status: "active",
    },
    viewBatch: {
        id: -1,
        batchCode: "",
        courseName: "",
        status: "",
        year: "",
        courseId: "",
        createdAt: "",
        updatedAt: "",
        createdBy: "",
        updatedBy: "",
        setIsActive: undefined
    },
    page: 1,
    totalPages: 0,
    nextPage: -1,
    prevPage: -1,
    editBlocked: true,
};

export const batchSlice = createSlice({
    name: "batch",
    initialState,
    reducers: {
        // Create Batch
        setCreateBatchDefault: (state) => {
            state.createBatch = initialState.createBatch;
        },
        setCreateBatch: (state, action) => {
            state.createBatch = action.payload;
        },
        setCreateBatchCode: (state, action) => {
            state.createBatch.batchCode = action.payload;
        },
        setCreateCourseName: (state, action) => {
            state.createBatch.courseName = action.payload;
        },
        setCreateBatchStatus: (state, action) => {
            state.createBatch.status = action.payload;
        },
        setCreateBatchYear: (state, action) => {
            state.createBatch.year = action.payload;
        },
        setCreateBatchCourseId: (state, action) => {
            state.createBatch.courseId = action.payload;
        },

        
        // View Batch
        setEditBlocked: (state, action) => {
            state.editBlocked = action.payload;
        },
        setViewBatch: (state, action) => {
            state.viewBatch = action.payload;
        },
        setViewBatchDefault: (state) => {
            state.viewBatch = initialState.viewBatch;
        },
        setViewBatchCode: (state, action) => {
            state.viewBatch.batchCode = action.payload;
        },
        setViewCourseName: (state, action) => {
            state.viewBatch.courseName = action.payload;
        },
        setViewBatchStatus: (state, action) => {
            state.viewBatch.status = action.payload;
        },
        setViewBatchYear: (state, action) => {
            state.viewBatch.year = action.payload;
        },
        setViewCourseId: (state, action) => {
            state.viewBatch.courseId = action.payload;
        },

        // Add pagination reducers
        setBatchPage: (state, action) => {
            state.page = action.payload;
        },
        setBatchTotalPages: (state, action) => {
            state.totalPages = action.payload;
        },
        setBatchNextPage: (state, action) => {
            state.nextPage = action.payload;
        },
        setBatchPrevPage: (state, action) => {
            state.prevPage = action.payload;
        }
    },
});

export const {
    // Create batch
    setCreateBatchDefault,
    setCreateBatch,
    setCreateBatchCode,
    setCreateCourseName,
    setCreateBatchYear,
    setCreateBatchStatus,
    setCreateBatchCourseId,

    // View batch 
    setEditBlocked,
    setViewBatch,
    setViewBatchDefault,
    setViewBatchCode,
    setViewCourseName,
    setViewBatchStatus,
    setViewCourseId,
    setViewBatchYear,


    // Pagination exports
    setBatchPage,
    setBatchTotalPages,
    setBatchNextPage,
    setBatchPrevPage
} = batchSlice.actions;

export default batchSlice.reducer;
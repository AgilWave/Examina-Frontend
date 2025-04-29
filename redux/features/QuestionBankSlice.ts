"use client";

import { createSlice } from "@reduxjs/toolkit";
import { QuestionBankInteract } from "@/types/questionBank";

const initialState: QuestionBankInteract = {
    viewQuestionBank: {
        id: -1,
        name: "",
        createdAt: "",
        updatedAt: "",
        createdBy: "",
        updatedBy: "",
    },
    page: 1,
    totalPages: 0,
    nextPage: -1,
    prevPage: -1,
    editBlocked: true,

    createQuestionBank: {
        name: ""
    }
};

export const QuestionBankSlice = createSlice({
    name: "questionBank",
    initialState,
    reducers: {
        // View question bank
        setViewQuestionBank: (state, action) => {
            state.viewQuestionBank = action.payload;
        },
        setViewQuestionBankDefault: (state) => {
            state.viewQuestionBank = initialState.viewQuestionBank;
        },
        setViewQuestionBankName: (state, action) => {
            state.viewQuestionBank.name = action.payload;
        },
        setViewQuestionBankCreatedAt: (state, action) => {
            state.viewQuestionBank.createdAt = action.payload;
        },
        setViewQuestionBankUpdatedAt: (state, action) => {
            state.viewQuestionBank.updatedAt = action.payload;
        },
        setViewQuestionBankCreatedBy: (state, action) => {
            state.viewQuestionBank.createdBy = action.payload;
        },
        setViewQuestionBankUpdatedBy: (state, action) => {
            state.viewQuestionBank.updatedBy = action.payload;
        },
        setEditBlocked: (state, action) => {
            state.editBlocked = action.payload;
        },

        // Add pagination reducers
        setQuestionBankPage: (state, action) => {
            state.page = action.payload;
        },
        setQuestionBankTotalPages: (state, action) => {
            state.totalPages = action.payload;
        },
        setQuestionBankNextPage: (state, action) => {
            state.nextPage = action.payload;
        },
        setQuestionBankPrevPage: (state, action) => {
            state.prevPage = action.payload;
        },
    },
});

export const {
    // View question bank
    setViewQuestionBank,
    setViewQuestionBankDefault,
    setViewQuestionBankName,
    setViewQuestionBankCreatedAt,
    setViewQuestionBankUpdatedAt,
    setViewQuestionBankCreatedBy,
    setViewQuestionBankUpdatedBy,


    // Pagination exports
    setQuestionBankPage,
    setQuestionBankTotalPages,
    setQuestionBankNextPage,
    setQuestionBankPrevPage,
    setEditBlocked,
} = QuestionBankSlice.actions;

export default QuestionBankSlice.reducer;
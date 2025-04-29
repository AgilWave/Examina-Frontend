"use client";

import { createSlice } from "@reduxjs/toolkit";
import { QuestionInteract } from "@/types/question"; // Assume QuestionInteract is a type for question-related data.

const initialState: QuestionInteract = {
  viewQuestion: {
    id: -1,
    lectureName: "",
    questionType: "",
    questionText: "",
    options: [],
    correctAnswer: "",
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

  createQuestion: {
    lectureName: "",
    questionType: "",
    questionText: "",
    options: [],
    correctAnswer: "",
  },
};

export const QuestionSlice = createSlice({
  name: "question",
  initialState,
  reducers: {
    // View question
    setViewQuestion: (state, action) => {
      state.viewQuestion = action.payload;
    },
    setViewQuestionDefault: (state) => {
      state.viewQuestion = initialState.viewQuestion;
    },
    setViewQuestionLectureName: (state, action) => {
      state.viewQuestion.lectureName = action.payload;
    },
    setViewQuestionType: (state, action) => {
      state.viewQuestion.questionType = action.payload;
    },
    setViewQuestionText: (state, action) => {
      state.viewQuestion.questionText = action.payload;
    },
    setViewQuestionOptions: (state, action) => {
      state.viewQuestion.options = action.payload;
    },
    setViewQuestionCorrectAnswer: (state, action) => {
      state.viewQuestion.correctAnswer = action.payload;
    },
    setViewQuestionCreatedAt: (state, action) => {
      state.viewQuestion.createdAt = action.payload;
    },
    setViewQuestionUpdatedAt: (state, action) => {
      state.viewQuestion.updatedAt = action.payload;
    },
    setViewQuestionCreatedBy: (state, action) => {
      state.viewQuestion.createdBy = action.payload;
    },
    setViewQuestionUpdatedBy: (state, action) => {
      state.viewQuestion.updatedBy = action.payload;
    },

    setEditBlocked: (state, action) => {
      state.editBlocked = action.payload;
    },

    // Add pagination reducers for questions
    setQuestionPage: (state, action) => {
      state.page = action.payload;
    },
    setQuestionTotalPages: (state, action) => {
      state.totalPages = action.payload;
    },
    setQuestionNextPage: (state, action) => {
      state.nextPage = action.payload;
    },
    setQuestionPrevPage: (state, action) => {
      state.prevPage = action.payload;
    },

    // Create question
    setCreateQuestionLectureName: (state, action) => {
      state.createQuestion.lectureName = action.payload;
    },
    setCreateQuestionType: (state, action) => {
      state.createQuestion.questionType = action.payload;
    },
    setCreateQuestionText: (state, action) => {
      state.createQuestion.questionText = action.payload;
    },
    setCreateQuestionOptions: (state, action) => {
      state.createQuestion.options = action.payload;
    },
    setCreateQuestionCorrectAnswer: (state, action) => {
      state.createQuestion.correctAnswer = action.payload;
    },
    setCreateQuestionDefault: (state) => {
      state.createQuestion = initialState.createQuestion;
    },
  },
});

export const {
  // View question
  setViewQuestion,
  setViewQuestionDefault,
  setViewQuestionLectureName,
  setViewQuestionType,
  setViewQuestionText,
  setViewQuestionOptions,
  setViewQuestionCorrectAnswer,
  setViewQuestionCreatedAt,
  setViewQuestionUpdatedAt,
  setViewQuestionCreatedBy,
  setViewQuestionUpdatedBy,

  // Edit block state
  setEditBlocked,

  // Pagination actions for questions
  setQuestionPage,
  setQuestionTotalPages,
  setQuestionNextPage,
  setQuestionPrevPage,

  // Create question actions
  setCreateQuestionLectureName,
  setCreateQuestionType,
  setCreateQuestionText,
  setCreateQuestionOptions,
  setCreateQuestionCorrectAnswer,
  setCreateQuestionDefault,
} = QuestionSlice.actions;

export default QuestionSlice.reducer;

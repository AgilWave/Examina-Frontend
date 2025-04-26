"use client";

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import dialogReducer from "./features/dialogState";
import pageReducer from "./features/pageSlice";
import userReducer from "./features/UserSlice";
import studentReducer from "./features/StudentSlice";
import lectureReducer from "./features/LectureSlice";
import batchReducer from "./features/BatchSlice";
import courseReducer from "./features/CourseSlice";
import yearReducer from "./features/YearSlice"; 
import moduleReducer from "./features/ModuleSlice";
import facultyReducer from "./features/FacultySlice";

const rootReducer = combineReducers({
  dialog: dialogReducer,
  page: pageReducer,
  user: userReducer,
  student: studentReducer,
  lecture : lectureReducer,
  batch: batchReducer,
  course: courseReducer,
  year: yearReducer, 
  module: moduleReducer,
  faculty: facultyReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, 
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

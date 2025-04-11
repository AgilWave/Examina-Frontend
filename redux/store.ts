"use client";

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import dialogReducer from "./features/dialogState";
import pageReducer from "./features/pageSlice";
import userReducer from "./features/UserSlice";
import studentReducer from "./features/StudentSlice";
import lectureReducer from "./features/LectureSlice";

const rootReducer = combineReducers({
  dialog: dialogReducer,
  page: pageReducer,
  user: userReducer,
  student: studentReducer,
  lecture : lectureReducer,
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

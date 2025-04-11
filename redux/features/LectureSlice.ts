"use client";

import { createSlice } from "@reduxjs/toolkit";
import { LectureInteract } from "@/types/lectures";

const initialState: LectureInteract = {
    viewLecture: {
        id: -1,
        email: "",
        name: "",
        batchCode: "",
        course: "",
        faculty: "",
        createdAt: "",
        updatedAt: "",
        isBlacklisted: false,
        createdBy: "",
        updatedBy: "",
        blackelistedReason: "",
        username: "",
        role: ""
    },
    editBlocked: true,
};

export const lectureSlice = createSlice({
    name: "lecture",
    initialState,
    reducers: {
        // View Lecture
        setEditBlocked: (state, action) => {
            state.editBlocked = action.payload;
        },
       
        setviewLecture: (state, action) => {
            state.viewLecture = action.payload;
        },
        setviewLectureDefault: (state) => {
            state.viewLecture = initialState.viewLecture;
        },
        setViewBatchCode: (state, action) => {
            state.viewLecture.batchCode = action.payload;
        },

        setViewCourse: (state, action) => {
            state.viewLecture.course = action.payload;
        },
        setViewFaculty: (state, action) => {
            state.viewLecture.faculty = action.payload;
        }
    },
});

export const {
    // View Lecture
    setEditBlocked,
    setviewLecture,
    setviewLectureDefault,
    setViewBatchCode,
    setViewCourse,
    setViewFaculty,
} = lectureSlice.actions;
export default lectureSlice.reducer;

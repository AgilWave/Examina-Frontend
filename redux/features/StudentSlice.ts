"use client";

import { createSlice } from "@reduxjs/toolkit";
import { StudentInteract } from "@/types/student";

const initialState: StudentInteract = {
    viewStudent: {
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
    },
    editBlocked: true,
};

export const studentSlice = createSlice({
    name: "student",
    initialState,
    reducers: {
        // View Student
        setEditBlocked: (state, action) => {
            state.editBlocked = action.payload;
        },
       
        setviewStudent: (state, action) => {
            state.viewStudent = action.payload;
        },
        setviewStudentDefault: (state) => {
            state.viewStudent = initialState.viewStudent;
        },

        setViewBatchCode: (state, action) => {
            state.viewStudent.batchCode = action.payload;
        },

        setViewCourse: (state, action) => {
            state.viewStudent.course = action.payload;
        },
        setViewFaculty: (state, action) => {
            state.viewStudent.faculty = action.payload;
        }
    },
});

export const {
    // View Student
    setEditBlocked,
    setviewStudent,
    setViewBatchCode,
    setViewCourse,
    setViewFaculty,
    setviewStudentDefault
} = studentSlice.actions;
export default studentSlice.reducer;

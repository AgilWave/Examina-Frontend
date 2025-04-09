"use client";

import { createSlice } from "@reduxjs/toolkit";
import { StudentInteract } from "@/types/student";

const initialState: StudentInteract = {
    viewStudent: {
        id: -1,
        email: "",
        name: "",
        createdAt: "",
        updatedAt: "",
        isBlacklisted: false,
        createdBy: "",
        updatedBy: "",
        blackelistedReason: "",
        student: {
            facultyId: -1,
            courseId: -1,
            batchId: -1,
        },
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

        setViewBatchId: (state, action) => {
            state.viewStudent.student.batchId = action.payload;
        },
        setViewCourseId: (state, action) => {
            state.viewStudent.student.courseId = action.payload;
        },
        setViewFacultyId: (state, action) => {
            state.viewStudent.student.facultyId = action.payload;
        },
        
           
    },
});

export const {
    // View Student
    setEditBlocked,
    setviewStudent,
    setViewBatchId,
    setViewCourseId,
    setViewFacultyId,
    setviewStudentDefault
} = studentSlice.actions;
export default studentSlice.reducer;

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
            faculty: {
                id: -1,
                name: "",
            },
            course: {
                id: -1,
                name: "",
            },
            batch: {
                id: -1,
                name: "",
            },
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
            if (!state.viewStudent.student.batch) {
                state.viewStudent.student.batch = { id: -1, name: "" };
            }
            state.viewStudent.student.batch.id = action.payload;
        },
        setViewCourseId: (state, action) => {
            if (!state.viewStudent.student.course) {
                state.viewStudent.student.course = { id: -1, name: "" };
            }
            state.viewStudent.student.course.id = action.payload;
        },
        setViewFacultyId: (state, action) => {
            if (!state.viewStudent.student.faculty) {
                state.viewStudent.student.faculty = { id: -1, name: "" };
            }
            state.viewStudent.student.faculty.id = action.payload;
        },
        
        setViewCourseName: (state, action) => {
            state.viewStudent.student.course.name = action.payload;
        },
        setViewBatchName: (state, action) => {
            state.viewStudent.student.batch.name = action.payload;
        },
        setViewFacultyName: (state, action) => {
            state.viewStudent.student.faculty.name = action.payload;
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
    setviewStudentDefault,
    setViewCourseName,
    setViewBatchName,
    setViewFacultyName,
} = studentSlice.actions;
export default studentSlice.reducer;

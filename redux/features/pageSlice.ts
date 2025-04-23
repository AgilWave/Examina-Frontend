"use client";

import { createSlice } from "@reduxjs/toolkit";
import { PageState } from "@/types/page";

const initialState: PageState = {
    users: {
        totalPages: 0,
        page: 1,
        nextPage: -1,
        prevPage: -1,
    },
    students: {
        totalPages: 0,
        page: 1,
        nextPage: -1,
        prevPage: -1,
    },
    lectures: {
        totalPages: 0,
        page: 1,
        nextPage: -1,
        prevPage: -1,
    },
    batch: {
        totalPages: 0,
        page: 1,
        nextPage: -1,
        prevPage: -1,
    },
    course: {
        totalPages: 0,
        page: 1,
        nextPage: -1,
        prevPage: -1,
    },
    module: {
        totalPages: 0,
        page: 1,
        nextPage: -1,
        prevPage: -1,
    },
    faculty: {
        totalPages: 0,
        page: 1,
        nextPage: -1,
        prevPage: -1,
    },
};

export const PageSlice = createSlice({
    name: "page",
    initialState,
    reducers: {
        setUserPage: (state, action) => {
            state.users.page = action.payload;
            if (typeof window !== "undefined") {
                sessionStorage.setItem("userPage", JSON.stringify(action.payload));
            }
        },
        setUserTotalPages: (state, action) => {
            state.users.totalPages = action.payload;
            if (typeof window !== "undefined") {
                sessionStorage.setItem("userTotalPages", JSON.stringify(action.payload));
            }
        },
        setUserNextPage: (state, action) => {
            state.users.nextPage = action.payload;
            if (typeof window !== "undefined") {
                sessionStorage.setItem("userNextPage", JSON.stringify(action.payload));
            }
        },
        setUserPrevPage: (state, action) => {
            state.users.prevPage = action.payload;
            if (typeof window !== "undefined") {
                sessionStorage.setItem("userPrevPage", JSON.stringify(action.payload));
            }
        },

        //students
        setStudentPage: (state, action) => {
            state.students.page = action.payload;
            if (typeof window !== "undefined") {
                sessionStorage.setItem("studentPage", JSON.stringify(action.payload));
            }
        },
        setStudentTotalPages: (state, action) => {
            state.students.totalPages = action.payload;
            if (typeof window !== "undefined") {
                sessionStorage.setItem("studentTotalPages", JSON.stringify(action.payload));
            }
        },
        setStudentNextPage: (state, action) => {
            state.students.nextPage = action.payload;
            if (typeof window !== "undefined") {
                sessionStorage.setItem("studentNextPage", JSON.stringify(action.payload));
            }
        },
        setStudentPrevPage: (state, action) => {
            state.students.prevPage = action.payload;
            if (typeof window !== "undefined") {
                sessionStorage.setItem("studentPrevPage", JSON.stringify(action.payload));
            }
        },

        //lectures
        setLecturePage: (state, action) => {
            state.users.page = action.payload;
            if (typeof window !== "undefined") {
                sessionStorage.setItem("userPage", JSON.stringify(action.payload));
            }
        },
        setLectureTotalPages: (state, action) => {
            state.users.totalPages = action.payload;
            if (typeof window !== "undefined") {
                sessionStorage.setItem("userTotalPages", JSON.stringify(action.payload));
            }
        },
        setLectureNextPage: (state, action) => {
            state.users.nextPage = action.payload;
            if (typeof window !== "undefined") {
                sessionStorage.setItem("userNextPage", JSON.stringify(action.payload));
            }
        },
        setLecturePrevPage: (state, action) => {
            state.users.prevPage = action.payload;
            if (typeof window !== "undefined") {
                sessionStorage.setItem("userPrevPage", JSON.stringify(action.payload));
            }
        },

        //batch
        setBatchPage: (state, action) => {
            state.batch.page = action.payload;
            if (typeof window !== "undefined") {
                sessionStorage.setItem("batchPage", JSON.stringify(action.payload));
            }
        },
        setBatchTotalPages: (state, action) => {
            state.batch.totalPages = action.payload;
            if (typeof window !== "undefined") {
                sessionStorage.setItem("batchTotalPages", JSON.stringify(action.payload));
            }
        },
        setBatchNextPage: (state, action) => {
            state.batch.nextPage = action.payload;
            if (typeof window !== "undefined") {
                sessionStorage.setItem("batchNextPage", JSON.stringify(action.payload));
            }
        },
        setBatchPrevPage: (state, action) => {
            state.batch.prevPage = action.payload;
            if (typeof window !== "undefined") {
                sessionStorage.setItem("batchPrevPage", JSON.stringify(action.payload));
            }
        },

        //course
        setCoursePage: (state, action) => {
            state.course.page = action.payload;
            if (typeof window !== "undefined") {
                sessionStorage.setItem("coursePage", JSON.stringify(action.payload));
            }
        },
        setCourseTotalPages: (state, action) => {
            state.course.totalPages = action.payload;
            if (typeof window !== "undefined") {
                sessionStorage.setItem("courseTotalPages", JSON.stringify(action.payload));
            }
        },
        setCourseNextPage: (state, action) => {
            state.course.nextPage = action.payload;
            if (typeof window !== "undefined") {
                sessionStorage.setItem("courseNextPage", JSON.stringify(action.payload));
            }
        },
        setCoursePrevPage: (state, action) => {
            state.course.prevPage = action.payload;
            if (typeof window !== "undefined") {    
                sessionStorage.setItem("coursePrevPage", JSON.stringify(action.payload));
            }
        },

        //module
        setModulePage: (state, action) => {
            state.module.page = action.payload;
            if (typeof window !== "undefined") {
                sessionStorage.setItem("modulePage", JSON.stringify(action.payload));
            }
        },
        setModuleTotalPages: (state, action) => {
            state.module.totalPages = action.payload;
            if (typeof window !== "undefined") {
                sessionStorage.setItem("moduleTotalPages", JSON.stringify(action.payload));
            }
        },
        setModuleNextPage: (state, action) => {
            state.module.nextPage = action.payload;
            if (typeof window !== "undefined") {
                sessionStorage.setItem("moduleNextPage", JSON.stringify(action.payload));
            }
        },
        setModulePrevPage: (state, action) => {
            state.module.prevPage = action.payload;
            if (typeof window !== "undefined") {
                sessionStorage.setItem("modulePrevPage", JSON.stringify(action.payload));
            }
        },

        //faculty
        setFacultyPage: (state, action) => {
            state.faculty.page = action.payload;
            if (typeof window !== "undefined") {
                sessionStorage.setItem("facultyPage", JSON.stringify(action.payload));
            }
        },
        setFacultyTotalPages: (state, action) => {
            state.faculty.totalPages = action.payload;
            if (typeof window !== "undefined") {
                sessionStorage.setItem("facultyTotalPages", JSON.stringify(action.payload));
            }
        },
        setFacultyNextPage: (state, action) => {
            state.faculty.nextPage = action.payload;
            if (typeof window !== "undefined") {
                sessionStorage.setItem("facultyNextPage", JSON.stringify(action.payload));
            }
        },
        setFacultyPrevPage: (state, action) => {
            state.faculty.prevPage = action.payload;
            if (typeof window !== "undefined") {
                sessionStorage.setItem("facultyPrevPage", JSON.stringify(action.payload));
            }
        },

        
    },
});

export const {
    setUserPage,
    setUserTotalPages,
    setUserNextPage,
    setUserPrevPage,

    //students
    setStudentPage,
    setStudentTotalPages,
    setStudentNextPage,
    setStudentPrevPage,

    //lectures
    setLecturePage,
    setLectureTotalPages,
    setLectureNextPage,
    setLecturePrevPage,  
    
    //batch
    setBatchPage,
    setBatchTotalPages,
    setBatchNextPage,
    setBatchPrevPage,

    //course
    setCoursePage,
    setCourseTotalPages,
    setCourseNextPage,
    setCoursePrevPage,

    //module
    setModulePage,
    setModuleTotalPages,
    setModuleNextPage,
    setModulePrevPage,

    //faculty
    setFacultyPage,
    setFacultyTotalPages,
    setFacultyNextPage,
    setFacultyPrevPage,
    
} = PageSlice.actions;



export default PageSlice.reducer;
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
    questionBank: {
        totalPages: 0,
        page: 1,
        nextPage: -1,
        prevPage: -1,
    },
    question: {
        totalPages: 0,
        page: 1,
        nextPage: -1,
        prevPage: -1,
    },
    exam: {
        totalPages: 0,
        page: 1,
        nextPage: -1,
        prevPage: -1,
    },
    examHistory: {
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

        //questionBank
        setQuestionBankPage: (state, action) => {
            state.questionBank.page = action.payload;
            if (typeof window !== "undefined") {
                sessionStorage.setItem("questionBankPage", JSON.stringify(action.payload));
            }
        },
        setQuestionBankTotalPages: (state, action) => {
            state.questionBank.totalPages = action.payload;
            if (typeof window !== "undefined") {
                sessionStorage.setItem("questionBankTotalPages", JSON.stringify(action.payload));
            }
        },
        setQuestionBankNextPage: (state, action) => {
            state.questionBank.nextPage = action.payload;
            if (typeof window !== "undefined") {
                sessionStorage.setItem("questionBankNextPage", JSON.stringify(action.payload));
            }
        },
        setQuestionBankPrevPage: (state, action) => {
            state.questionBank.prevPage = action.payload;
            if (typeof window !== "undefined") {
                sessionStorage.setItem("questionBankPrevPage", JSON.stringify(action.payload));
            }
        },

        //question
        setQuestionPage: (state, action) => {
            state.question.page = action.payload;
            if (typeof window !== "undefined") {
                sessionStorage.setItem("questionPage", JSON.stringify(action.payload));
            }
        },
        setQuestionTotalPages: (state, action) => {
            state.question.totalPages = action.payload;
            if (typeof window !== "undefined") {
                sessionStorage.setItem("questionTotalPages", JSON.stringify(action.payload));
            }
        },

        setQuestionNextPage: (state, action) => {
            state.question.nextPage = action.payload;
            if (typeof window !== "undefined") {
                sessionStorage.setItem("questionNextPage", JSON.stringify(action.payload));
            }
        },
        setQuestionPrevPage: (state, action) => {
            state.question.prevPage = action.payload;
            if (typeof window !== "undefined") {
                sessionStorage.setItem("questionPrevPage", JSON.stringify(action.payload));
            }
        },

        //exams
        setExamPage: (state, action) => {
            state.exam.page = action.payload;
            if (typeof window !== "undefined") {
                sessionStorage.setItem("examPage", JSON.stringify(action.payload));
            }
        },
        setExamTotalPages: (state, action) => {
            state.exam.totalPages = action.payload;
            if (typeof window !== "undefined") {
                sessionStorage.setItem("examTotalPages", JSON.stringify(action.payload));
            }
        },
        setExamNextPage: (state, action) => {
            state.exam.nextPage = action.payload;
            if (typeof window !== "undefined") {
                sessionStorage.setItem("examNextPage", JSON.stringify(action.payload));
            }
        },
        setExamPrevPage: (state, action) => {
            state.exam.prevPage = action.payload;
            if (typeof window !== "undefined") {
                sessionStorage.setItem("examPrevPage", JSON.stringify(action.payload));
            }
        },

        //examHistory
        setExamHistoryPage: (state, action) => {
            state.examHistory.page = action.payload;
            if (typeof window !== "undefined") {
                sessionStorage.setItem("examHistoryPage", JSON.stringify(action.payload));
            }
        },
        setExamHistoryTotalPages: (state, action) => {
            state.examHistory.totalPages = action.payload;
            if (typeof window !== "undefined") {
                sessionStorage.setItem("examHistoryTotalPages", JSON.stringify(action.payload));
            }
        },
        setExamHistoryNextPage: (state, action) => {
            state.examHistory.nextPage = action.payload;
            if (typeof window !== "undefined") {
                sessionStorage.setItem("examHistoryNextPage", JSON.stringify(action.payload));
            }
        },
        setExamHistoryPrevPage: (state, action) => {
            state.examHistory.prevPage = action.payload;
            if (typeof window !== "undefined") {
                sessionStorage.setItem("examHistoryPrevPage", JSON.stringify(action.payload));
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

    //questionBank
    setQuestionBankPage,
    setQuestionBankTotalPages,
    setQuestionBankNextPage,
    setQuestionBankPrevPage,

    //question
    setQuestionPage,
    setQuestionTotalPages,
    setQuestionNextPage,
    setQuestionPrevPage,

    //exams
    setExamPage,
    setExamTotalPages,
    setExamNextPage,
    setExamPrevPage,

    //examHistory
    setExamHistoryPage,
    setExamHistoryTotalPages,
    setExamHistoryNextPage,
    setExamHistoryPrevPage,
    
} = PageSlice.actions;



export default PageSlice.reducer;
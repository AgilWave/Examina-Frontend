"use client";

import { createSlice } from "@reduxjs/toolkit";
import { CourseInteract } from "@/types/course";

const initialState: CourseInteract = {
  createCourse: {
    courseName: "",
    status: "active",
  },
  viewCourse: {
    id: -1,
    courseName: "",
    status: "",
    module: [],
    createdAt: "",
    updatedAt: "",
    createdBy: "",
    updatedBy: "",
  },
  courseEditBlocked: true,

  // Pagination state
  page: 1,
  totalPages: 0,
  nextPage: -1,
  prevPage: -1,
  editBlocked: undefined,
};

export const courseSlice = createSlice({
  name: "course",
  initialState,
  reducers: {
    // Create Course
    setCreateCourseDefault: (state) => {
      state.createCourse = initialState.createCourse;
    },
    setCreateCourse: (state, action) => {
      state.createCourse = action.payload;
    },
    setCreateCourseName: (state, action) => {
      state.createCourse.courseName = action.payload;
    },
    setCreateCourseStatus: (state, action) => {
      state.createCourse.status = action.payload;
    },

    // View Course
    setCourseEditBlocked: (state, action) => {
      state.courseEditBlocked = action.payload;
    },
    setViewCourse: (state, action) => {
      state.viewCourse = action.payload;
    },
    setViewCourseDefault: (state) => {
      state.viewCourse = initialState.viewCourse;
    },
    setViewCourseName: (state, action) => {
      state.viewCourse.courseName = action.payload;
    },
    setViewCourseStatus: (state, action) => {
      state.viewCourse.status = action.payload;
    },
    setViewCourseModule: (state, action) => {
      state.viewCourse.module = action.payload;
    },

    // Pagination
    setCoursePage: (state, action) => {
      state.page = action.payload;
    },
    setCourseTotalPages: (state, action) => {
      state.totalPages = action.payload;
    },
    setCourseNextPage: (state, action) => {
      state.nextPage = action.payload;
    },
    setCoursePrevPage: (state, action) => {
      state.prevPage = action.payload;
    },
  },
});

export const {
  // Create course
  setCreateCourseDefault,
  setCreateCourse,
  setCreateCourseName,
  setCreateCourseStatus,

  // View course
  setCourseEditBlocked,
  setViewCourse,
  setViewCourseDefault,
  setViewCourseName,
  setViewCourseStatus,
  setViewCourseModule,

  // Pagination
  setCoursePage,
  setCourseTotalPages,
  setCourseNextPage,
  setCoursePrevPage,
} = courseSlice.actions;

export default courseSlice.reducer;

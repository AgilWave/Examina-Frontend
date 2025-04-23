"use client";

import { createSlice } from "@reduxjs/toolkit";
import { CourseInteract } from "@/types/course";
import { PayloadAction } from "@reduxjs/toolkit";


const initialState: CourseInteract = {
  createCourse: {
    courseName: "",
    facultyId: -1,
    moduleIds: [] as number[],
  },
  viewCourse: {
    id: -1,
    name: "",
    facultyId: -1,
    modules: [],
    moduleIds: [],
    createdAt: "",
    updatedAt: "",
    createdBy: "",
    updatedBy: "",
    isActive: false,
  },

  // Pagination state
  page: 1,
  totalPages: 0,
  nextPage: -1,
  prevPage: -1,
  editBlocked: true,
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
    setCreateCourseModules: (state, action) => {
      state.createCourse.moduleIds = action.payload;
    },
    setCreateCourseFaculty: (state, action) => {
      state.createCourse.facultyId = action.payload;
    },
    

    // View Course
    setEditBlocked: (state, action) => {
      state.editBlocked = action.payload;
    },
    setViewCourse: (state, action) => {
      state.viewCourse = action.payload;
    },
    setViewCourseDefault: (state) => {
      state.viewCourse = initialState.viewCourse;
    },
    setViewCourseName: (state, action) => {
      state.viewCourse.name = action.payload;
    },
    setViewCourseFaculty: (state, action) => {
      state.viewCourse.facultyId = action.payload;
    },
    setViewCourseModules(state, action: PayloadAction<any[]>) {
      state.viewCourse.modules = action.payload;
      state.viewCourse.moduleIds = action.payload.map((module) => module.id);
    },
    setViewCourseId: (state, action) => {
      state.viewCourse.id = action.payload;
    },
    setViewCourseModuleIds: (state, action) => {
      state.viewCourse.moduleIds = action.payload;
    },
    setViewCourseIsActive: (state, action) => {
      state.viewCourse.isActive = action.payload;
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
  setCreateCourseModules,
  setCreateCourseFaculty,

  // View course
  setEditBlocked,
  setViewCourse,
  setViewCourseDefault,
  setViewCourseName,
  setViewCourseModules,
  setViewCourseFaculty,
  setViewCourseId,
  setViewCourseModuleIds,

  // Pagination
  setCoursePage,
  setCourseTotalPages,
  setCourseNextPage,
  setCoursePrevPage,
} = courseSlice.actions;

export default courseSlice.reducer;

"use client";

import { createSlice } from "@reduxjs/toolkit";
import { FacultyInteract } from "@/types/faculty";
import { PayloadAction } from "@reduxjs/toolkit";


const initialState: FacultyInteract = {
  createFaculty: {
    name: "",
  },
  viewFaculty: {
    id: -1,
    name: "",
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

export const FacultySlice = createSlice({
  name: "Faculty",
  initialState,
  reducers: {
    // Create Faculty
    setCreateFacultyDefault: (state) => {
      state.createFaculty = initialState.createFaculty;
    },
    setCreateFaculty: (state, action) => {
      state.createFaculty = action.payload;
    },
    setCreateFacultyName: (state, action) => {
      state.createFaculty.name = action.payload;
    },
    

    // View Faculty
    setEditBlocked: (state, action) => {
      state.editBlocked = action.payload;
    },
    setViewFaculty: (state, action) => {
      state.viewFaculty = action.payload;
    },
    setViewFacultyDefault: (state) => {
      state.viewFaculty = initialState.viewFaculty;
    },
    setViewFacultyName: (state, action) => {
      state.viewFaculty.name = action.payload;
    },
    setViewFacultyIsActive: (state, action) => {
      state.viewFaculty.isActive = action.payload;
    },

  

    // Pagination
    setFacultyPage: (state, action) => {
      state.page = action.payload;
    },
    setFacultyTotalPages: (state, action) => {
      state.totalPages = action.payload;
    },
    setFacultyNextPage: (state, action) => {
      state.nextPage = action.payload;
    },
    setFacultyPrevPage: (state, action) => {
      state.prevPage = action.payload;
    },
  },
});

export const {
  // Create Faculty
  setCreateFacultyDefault,
  setCreateFaculty,
  setCreateFacultyName,

  // View Faculty
  setEditBlocked,
  setViewFaculty,
  setViewFacultyDefault,
  setViewFacultyName,
  
  // Pagination
  setFacultyPage,
  setFacultyTotalPages,
  setFacultyNextPage,
  setFacultyPrevPage,
} = FacultySlice.actions;

export default FacultySlice.reducer;

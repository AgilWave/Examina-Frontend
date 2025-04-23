"use client";

import { createSlice } from "@reduxjs/toolkit";
import { ModuleInteract } from "@/types/module";

const initialState: ModuleInteract = {
  createModule: {
    moduleName: "",
    facultyName: "",
    status: "active",
  },
    viewModule: {
      id: -1,
      moduleName: "",
      facultyName: "",
      status: "",
      createdAt: "",
      updatedAt: "",
      createdBy: "",
      updatedBy: "",
      setIsActive: undefined
    },

  // Pagination state
  page: 1,
  totalPages: 0,
  nextPage: -1,
  prevPage: -1,
  editBlocked: true,
};

export const moduleSlice = createSlice({
  name: "module",
  initialState,
  reducers: {
    // Create Module
    setCreateModuleDefault: (state) => {
      state.createModule = initialState.createModule;
    },
    setCreateModule: (state, action) => {
      state.createModule = action.payload;
    },
    setCreateModuleName: (state, action) => {
        state.createModule.moduleName = action.payload;
    },
    setCreateModuleStatus: (state, action) => {
        state.createModule.status = action.payload;
    },
    setCreateModuleFacaltyName: (state, action) => {
        state.createModule.facultyName = action.payload;
    },


    // View Module
    setViewModule: (state, action) => {
      state.viewModule = action.payload;
    },
    setViewModuleDefault: (state) => {
      state.viewModule = initialState.viewModule;
    },
    setViewModuleName: (state, action) => {
      state.viewModule.moduleName = action.payload;
    },
    setViewModuleStatus: (state, action) => {
      state.viewModule.status = action.payload;
    },
    setViewModuleFacaltyName: (state, action) => {
      state.viewModule.facultyName = action.payload;
  },
    setViewModuleCreatedAt: (state, action) => {
        state.viewModule.createdAt = action.payload;
    },
    setViewModuleUpdatedAt: (state, action) => {
        state.viewModule.updatedAt = action.payload;
    },
    setViewModuleCreatedBy: (state, action) => {
        state.viewModule.createdBy = action.payload;
    },
    setViewModuleUpdatedBy: (state, action) => {
        state.viewModule.updatedBy = action.payload;
    },
    
    // Pagination
    setModulePage: (state, action) => {
      state.page = action.payload;
      if (typeof window !== "undefined") {
        sessionStorage.setItem("modulePage", JSON.stringify(action.payload));
      }
    },
    setModuleTotalPages: (state, action) => {
      state.totalPages = action.payload;
      if (typeof window !== "undefined") {
        sessionStorage.setItem("moduleTotalPages", JSON.stringify(action.payload));
      }
    },
    setModuleNextPage: (state, action) => {
        state.nextPage = action.payload;
        if (typeof window !== "undefined") {
            sessionStorage.setItem("moduleNextPage", JSON.stringify(action.payload));
        }
    },
    setModulePrevPage: (state, action) => {
        state.prevPage = action.payload;
        if (typeof window !== "undefined") {
            sessionStorage.setItem("modulePrevPage", JSON.stringify(action.payload));
        }
    },
    setEditBlocked: (state, action) => {
        state.editBlocked = action.payload;
        if (typeof window !== "undefined") {
            sessionStorage.setItem("editBlocked", JSON.stringify(action.payload));
        }
    },

  },
});

export const {
  // Create module
    setCreateModuleDefault,
    setCreateModule,
    setCreateModuleName,
    setCreateModuleStatus,
    setCreateModuleFacaltyName,

  // View module
    setViewModule,
    setViewModuleDefault,
    setViewModuleName,
    setViewModuleStatus,
    setViewModuleFacaltyName,
    setViewModuleCreatedAt,
    setViewModuleUpdatedAt,
    setViewModuleCreatedBy,
    setViewModuleUpdatedBy,

  // Pagination
    setModulePage,
    setModuleTotalPages,
    setModuleNextPage,
    setModulePrevPage,
    setEditBlocked,
} = moduleSlice.actions;

export default moduleSlice.reducer;

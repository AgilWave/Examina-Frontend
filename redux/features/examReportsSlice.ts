import { createSlice } from "@reduxjs/toolkit";

interface ExamReportFilterState {
  facultyId: number;
  courseId: number;
  batchId: number;
  moduleId: number;
  examDate: string;
}

const initialState: ExamReportFilterState = {
  facultyId: 0,
  courseId: 0,
  batchId: 0,
  moduleId: 0,
  examDate: "",
};

export const examReportFilterSlice = createSlice({
  name: "examReportFilter",
  initialState,
  reducers: {
    setFilterFacultyId: (state, action) => {
      state.facultyId = action.payload;
    },
    setFilterCourseId: (state, action) => {
      state.courseId = action.payload;
    },
    setFilterBatchId: (state, action) => {
      state.batchId = action.payload;
    },
    setFilterModuleId: (state, action) => {
      state.moduleId = action.payload;
    },
    setFilterExamDate: (state, action) => {
      state.examDate = action.payload;
    },
    resetAllFilters: (state) => {
      state.facultyId = 0;
      state.courseId = 0;
      state.batchId = 0;
      state.moduleId = 0;
      state.examDate = "";
    },
  },
});

export const {
  setFilterFacultyId,
  setFilterCourseId,
  setFilterBatchId,
  setFilterModuleId,
  setFilterExamDate,
  resetAllFilters,
} = examReportFilterSlice.actions;

export default examReportFilterSlice.reducer;

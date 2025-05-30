"use client";

import { createSlice } from "@reduxjs/toolkit";
import { ExamInteract } from "@/types/exam";

const initialState: ExamInteract = {
  createExam: {
    facultyId: 0,
    courseId: 0,
    batchId: 0,
    moduleId: 0,
    examName: "",
    examCode: "",
    description: "",
    lectureId: 0,
    examDate: "",
    startTime: "",
    endTime: "",
    examMode: "online",
    randomizeQuestions: false,
    randomizeAnswers: false,
    allowBackTracking: false,
    lateEntry: false,
    lateEntryTime: 0,
    webcamRequired: false,
    micRequired: false,
    networkStrengthTest: false,
    lockdownBrowser: false,
    surroundingEnvironmentCheck: false,
    examQuestions: [],
    notifyStudents: false,
    sendReminders: false,
    reminderTime: 0,
  },
};

export const examSlice = createSlice({
  name: "exam",
  initialState,
  reducers: {
    setCreateExamDefault: (state) => {
      state.createExam = initialState.createExam;
    },
    setCreateExam: (state, action) => {
      state.createExam = action.payload;
    },
    setCreateExamFacultyId: (state, action) => {
      state.createExam.facultyId = action.payload;
    },
    setCreateExamCourseId: (state, action) => {
      state.createExam.courseId = action.payload;
    },
    setCreateExamBatchId: (state, action) => {
      state.createExam.batchId = action.payload;
    },
    setCreateExamModuleId: (state, action) => {
      state.createExam.moduleId = action.payload;
    },
    setCreateExamName: (state, action) => {
      state.createExam.examName = action.payload;
    },
    setCreateExamCode: (state, action) => {
      state.createExam.examCode = action.payload;
    },
    setCreateExamDescription: (state, action) => {
      state.createExam.description = action.payload;
    },
    setCreateExamLectureId: (state, action) => {
      state.createExam.lectureId = action.payload;
    },
    setCreateExamDate: (state, action) => {
      state.createExam.examDate = action.payload;
    },
    setCreateExamStartTime: (state, action) => {
      state.createExam.startTime = action.payload;
    },
    setCreateExamEndTime: (state, action) => {
      state.createExam.endTime = action.payload;
    },
    setCreateExamMode: (state, action) => {
      state.createExam.examMode = action.payload;
    },
    setCreateExamRandomizeQuestions: (state, action) => {
      state.createExam.randomizeQuestions = action.payload;
    },
    setCreateExamRandomizeAnswers: (state, action) => {
      state.createExam.randomizeAnswers = action.payload;
    },
    setCreateExamAllowBackTracking: (state, action) => {
      state.createExam.allowBackTracking = action.payload;
    },
    setCreateExamLateEntry: (state, action) => {
      state.createExam.lateEntry = action.payload;
    },
    setCreateExamLateEntryTime: (state, action) => {
      state.createExam.lateEntryTime = action.payload;
    },
    setCreateExamWebcamRequired: (state, action) => {
      state.createExam.webcamRequired = action.payload;
    },
    setCreateExamMicRequired: (state, action) => {
      state.createExam.micRequired = action.payload;
    },
    setCreateExamNetworkStrengthTest: (state, action) => {
      state.createExam.networkStrengthTest = action.payload;
    },
    setCreateExamLockdownBrowser: (state, action) => {
      state.createExam.lockdownBrowser = action.payload;
    },
    setCreateExamSurroundingEnvironmentCheck: (state, action) => {
      state.createExam.surroundingEnvironmentCheck = action.payload;
    },
    setCreateExamQuestions: (state, action) => {
      state.createExam.examQuestions = action.payload;
    },
    setCreateExamNotifyStudents: (state, action) => {
      state.createExam.notifyStudents = action.payload;
    },
    setCreateExamSendReminders: (state, action) => {
      state.createExam.sendReminders = action.payload;
    },
    setCreateExamReminderTime: (state, action) => {
      state.createExam.reminderTime = action.payload;
    },
  },
});

export const {
  setCreateExamDefault,
  setCreateExam,
  setCreateExamFacultyId,
  setCreateExamCourseId,
  setCreateExamBatchId,
  setCreateExamModuleId,
  setCreateExamName,
  setCreateExamCode,
  setCreateExamDescription,
  setCreateExamLectureId,
  setCreateExamDate,
  setCreateExamStartTime,
  setCreateExamEndTime,
  setCreateExamMode,
  setCreateExamRandomizeQuestions,
  setCreateExamRandomizeAnswers,
  setCreateExamAllowBackTracking,
  setCreateExamLateEntry,
  setCreateExamLateEntryTime,
  setCreateExamWebcamRequired,
  setCreateExamMicRequired,
  setCreateExamNetworkStrengthTest,
  setCreateExamLockdownBrowser,
  setCreateExamSurroundingEnvironmentCheck,
  setCreateExamQuestions,
  setCreateExamNotifyStudents,
  setCreateExamSendReminders,
  setCreateExamReminderTime,
} = examSlice.actions;

export default examSlice.reducer;

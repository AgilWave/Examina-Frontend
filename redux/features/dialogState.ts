"use client";

import { createSlice } from "@reduxjs/toolkit";
import { DialogState } from "@/types/dialog";

const initialState: DialogState = {
  createDialog: false,
  viewDialog: false,
  viewDialogId: 0,
  editClose: false,
  editCancel: false,
};

export const DialogSlice = createSlice({
  name: "userCreate",
  initialState,
  reducers: {
    setCreateDialog: (state, action) => {
      state.createDialog = action.payload;
    },
    setViewDialog: (state, action) => {
      state.viewDialog = action.payload;
      sessionStorage.setItem("viewDialog", JSON.stringify(action.payload));
    },
    setViewDialogId: (state, action) => {
      state.viewDialogId = action.payload;
      sessionStorage.setItem("viewDialogId", JSON.stringify(action.payload));
    },
    setEditClose: (state, action) => {
      state.editClose = action.payload;
    },
    setEditCancel: (state, action) => {
      state.editCancel = action.payload;
    },
  },
});

export const {
  setCreateDialog,
  setViewDialog,
  setViewDialogId,
  setEditClose,
  setEditCancel,
} = DialogSlice.actions;
export default DialogSlice.reducer;

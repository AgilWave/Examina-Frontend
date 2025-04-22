// redux/features/YearSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface YearState {
  viewYear: string;
  editBlocked: boolean;
}

const initialState: YearState = {
  viewYear: "",
  editBlocked: true,
};

export const yearSlice = createSlice({
  name: "year",
  initialState,
  reducers: {
    setViewYear: (state, action: PayloadAction<string>) => {
      state.viewYear = action.payload;
    },
    setYearEditBlocked: (state, action: PayloadAction<boolean>) => {
      state.editBlocked = action.payload;
    },
    setYearDefault: (state) => {
      state.viewYear = "";
      state.editBlocked = true;
    },
  },
});

export const { setViewYear, setYearEditBlocked, setYearDefault } = yearSlice.actions;
export default yearSlice.reducer;

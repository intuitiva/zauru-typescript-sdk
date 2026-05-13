import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

export interface SessionState {
  [key: string]: any;
}

const initialState: SessionState = {};

const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    setSessionValue: (
      state,
      action: PayloadAction<{ name: string; data: any }>
    ) => {
      state[action.payload.name] = action.payload.data;
    },
  },
});

export const { setSessionValue } = sessionSlice.actions;

export default sessionSlice.reducer;
